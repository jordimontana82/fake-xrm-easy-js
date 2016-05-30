var edge = require('edge');
//var sinon = require('sinon');
var odataParser = require('odata-parser');
var Guid = require('guid');


(function (exports) {
    
    var xrm = {
        Page: {
            context: {
                getClientUrl: function () {
                    return "http://fakecrmurl:5555/fakeOrgName";
                }
            }
        }
    };

    var _data = []; //Entities in memory
    var xhr, requests;
    
    //XmlHttpRequest backup
    var _realXMLHttpRequest = global.XMLHttpRequest;
    var _xhrRequests = [];

    var dllProxyBasePath = '../../../EdgeProxy/bin/Debug';
    //var edgeReferences = [
    //    '../../../packages/FakeXrmEasy.2016.1.13.7/lib/net452/FakeXrmEasy.dll',
    //    '../../../EdgeProxy/bin/Debug/EdgeProxy.dll'

    //];
    var translateMethod = edge.func({
        assemblyFile: dllProxyBasePath + '/EdgeProxy.dll',
        typeName: 'EdgeProxy.Proxy',
        methodName: 'TranslateODataQueryToQueryExpression' // This must be Func<object,Task<object>>
    });

    function processXhr(fakeXhr) {
        //Only process requests which belong to the CRM URL
        if (fakeXhr.url.indexOf(xrm.Page.context.getClientUrl()) < 0) {
            return;
        }
        
        //Get relative url
        fakeXhr.relativeApiUrl = fakeXhr.url.replace(xrm.Page.context.getClientUrl(), "");
        
        //Check api v8
        if (fakeXhr.relativeApiUrl.indexOf("/api/data/v8.0/") < 0) {
            throw 'Only Web API Requests are supported (v8.0)';
        }
        
        //get url part after version
        fakeXhr.relativeUrl = fakeXhr.relativeApiUrl.replace("/api/data/v8.0/", "");

        //Undo substring and parse body
        if (fakeXhr.requestHeaders["Content-Type"] &&
            fakeXhr.requestHeaders["Content-Type"].indexOf("application/json") >= 0) {
            
            switch (fakeXhr.method.toUpperCase()) {
                case "POST":
                    processXhrPost(fakeXhr);
                    break;
                case "GET":
                    processXhrGet(fakeXhr);
                    break;
                case "PUT":
                    throw 'PUT method not yet supported';
                case "DELETE":
                    throw 'DELETE method not yet supported';
                case "PATCH":
                    throw 'PATCH method not yet supported';
            }
            
        }
        else {
            throw 'Content-Type not supported. Fake server supports JSON requests only';
        }
    }

    function translateODataToQueryExpression_select(entityname, selectClause) {
        return selectClause; //Already parsed
    }

    function translateODataToQueryExpression_top(entityname, parsedQuery) {

    }

    function translateODataToQueryExpression_filter(entityname, parsedQuery) {

    }

    function translateODataToQueryExpression(entityname, parsedQuery) {
        var qe = {};

        qe.EntityName = entityname;
        if (parsedQuery['$select']) {
            qe.ColumnSet = translateODataToQueryExpression_select(entityname, parsedQuery['$select']);
        }
        else {
            qe.ColumnSet = { AllColumns: true };
        }
        return qe;
    }

    function getContextForEdge() {
        var entities = [];
        for (var entityname in _data) {
            for (var id in _data[entityname]) {
                entities.push({
                    EntityName: entityname,
                    Entity: _data[entityname][id]
                });
            }
        }
        return entities;
    }

    function convertEntityFromDotNetToOData(entity) {
        var jsEntity = { id: entity.Id };
        
        //Copy attributes
        for (var j = 0; j < entity.Attributes.length; j++) {
            var att = entity.Attributes[j];
            jsEntity[att.Key] = att.Value;
        }

        return jsEntity;
    }

    //Process query depending on method
    function processXhrPost(fakeXhr) {
        var entityName = fakeXhr.relativeUrl;
        var jsonData = JSON.parse(fakeXhr.requestBody);

        //Create a new record of the specified entity in the context
        jsonData.id = Guid.create();

        _data[entityName][jsonData.id] = jsonData;
    }

    function processXhrGet(fakeXhr) {
        //Query
        var entityName;
        var odataQuery;
        var parsedQuery;

        if (fakeXhr.relativeUrl.indexOf('?') >= 0) {
            //Query
            var entityName = fakeXhr.relativeUrl.split('?')[0];
            var odataQuery = fakeXhr.relativeUrl.split('?')[1];
            var parsedQuery = odataParser.parse(decodeURIComponent(odataQuery));
        }
        else {
            var entityName = fakeXhr.relativeUrl;
            var parsedQuery = {}; //Empty query
        }

        var qe = translateODataToQueryExpression(entityName, parsedQuery);

        //Pass the context plus the queryexpression as the parameter
        var executionContext = {
            QueryExpression: qe,
            Context: getContextForEdge()
        };
        translateMethod(executionContext, function (error, result) {
            if (result.Entities) {
                if (result.Entities.length > 0) {
                    //Found

                    //Return a list of entities
                    var response = {};
                    response["@odata.context"] = "";

                    var entities = [];
                    for (var i = 0; i < result.Entities.length; i++) {
                        var entity = result.Entities[i];
                        var odataEntity = convertEntityFromDotNetToOData(entity);
                        odataEntity["@odata.etag"] = "W/\"" + i.toString() + "\"";
                        entities.push(odataEntity);
                    }

                    response.value = entities;

                    fakeXhr.status = 200;
                    fakeXhr.response = JSON.stringify(response);
                    fakeXhr.readyState = 4; //Completed

                    //Force callback
                    if (fakeXhr.onreadystatechange)
                        fakeXhr.onreadystatechange();
                }
            }
        });
    }

    function FakeXMLHttpRequest() {
        this.method = '';
        this.url = '';
        this.async = true;
        this.requestBody = null;
        this.requestHeaders = [];
        this.response = null;
        this.responseXML = null;
        this.responseHeaders = [];
        this.readyState = 1;
        this.status = 100;
        
        this.relativeApiUrl = '';
        this.relativeUrl = '';

        //Push to the requests array
        _xhrRequests.push(this);
    }
    FakeXMLHttpRequest.prototype.open = function (method, url, async) {
        this.method = method
        this.url = url
        if (async === undefined)
            async = true; //default

        this.async = async;
    };
    FakeXMLHttpRequest.prototype.setRequestHeader = function (key, value) {
        this.requestHeaders[key] = value; 
    };
    FakeXMLHttpRequest.prototype.getResponseHeader = function (key) {
        return this.responseHeaders[key];
    };
    FakeXMLHttpRequest.prototype.send = function (body) {
        this.requestBody = body;
        processXhr(this);
    };

    
    

    //Replace default XHR behavior with the custom fake one
    global.XMLHttpRequest = FakeXMLHttpRequest;
    
    /*
    xhr.onCreate = function (req) {
        requests.push(req);

        //Respond automatically
        /*req.respond(200, 
                    { "Content-Type": "application/json" }, 
                    JSON.stringify({ id: 1 }));
    };

    //var _fakeServer = sinon.fakeServer.create();
   */

    exports.Xrm = xrm;
    exports.data = _data;
    exports.initialize = function (entityname, entities) {
        if (!entities.length) {
            throw new "Entities must be a JS array";
        }
        
        var l = entities.length;
        for (var i = 0; i < l; i++) {
            var e = entities[i];

            if (!e.id) {
                throw new "Entity"+ i.toString() + " must have an id property";
            }

            if (!Guid.isGuid(e.id)) {
                throw new "Entity" + i.toString() + " must have a valid id property (Guid expected)";
            }

            e.id = e.id.toString();

            if (!_data[entityname])
                _data[entityname] = [];

            _data[entityname][e.id.toString()] = e;
        }
    };

})(exports);


