var edge = require('edge');
var odataParser = require('odata-parser');
var Guid = require('guid');


(function (exports) {

    var _apiVersion = 'v9.0';
    var _proxyVersion = 'v9';
    var _dllProxyBasePath = '../../../EdgeProxy/bin/Debug';

    var _fakeCrmUrl = "http://fakecrmurl:5555/fakeOrgName";

    var xrm = {
        Page: {
            context: {
                getClientUrl: function () {
                    return _fakeCrmUrl;
                }
            }
        }
    };

    //Override get crm context function to return a dummy url
    global.GetGlobalContext = function () {
        return {
            getClientUrl: function () {
                return _fakeCrmUrl;
            }
        }
    };

    var _data = []; //Entities in memory
    var xhr, requests;
    
    //XmlHttpRequest backup
    var _realXMLHttpRequest = global.XMLHttpRequest;
    var _xhrRequests = [];

    

    //var edgeReferences = [
    //    '../../../packages/FakeXrmEasy.2016.1.13.7/lib/net452/FakeXrmEasy.dll',
    //    '../../../EdgeProxy/bin/Debug/EdgeProxy.dll'

    //];
    var translateMethod = null;

    function initProxy() {
        var proxyVersion = "";

        if (_dllProxyBasePath.indexOf('v9') >= 0) {
            proxyVersion = "v9";
            _apiVersion = "v9.0";
        }
        else if (_dllProxyBasePath.indexOf('v365') >= 0) {
            proxyVersion = "v365";
            _apiVersion = "v8.2";
        }
        else if (_dllProxyBasePath.indexOf('v2016') >= 0) {
            proxyVersion = "v2016";
            _apiVersion = "v8.0";
        }
        else if (_dllProxyBasePath.indexOf('v2015') >= 0) {
            proxyVersion = "v2015";
            _apiVersion = "v7.0";
        }
        else if (_dllProxyBasePath.indexOf('v2013') >= 0) {
            proxyVersion = "v2013";
            _apiVersion = "v6.0";
        }
        else {
            throw "Couldn't determine which proxy version to use based on the proxy package name";
        }

        translateMethod = edge.func({
            assemblyFile: _dllProxyBasePath + '/FakeXrmEasy.EdgeProxy.' + proxyVersion + '.dll',
            typeName: 'FakeXrmEasy.EdgeProxy.Proxy',
            methodName: 'TranslateODataQueryToQueryExpression' // This must be Func<object,Task<object>>
        });
    }

    function processXhr(fakeXhr) {
        //Only process requests which belong to the CRM URL
        if (fakeXhr.url.indexOf(_fakeCrmUrl) < 0) {
            return;
        }
        
        //Get relative url
        fakeXhr.relativeApiUrl = fakeXhr.url.replace(_fakeCrmUrl, "");
        
        //Check api v8
        if (fakeXhr.relativeApiUrl.indexOf("/api/data/" + _apiVersion) < 0) {
            throw 'Only Web API Requests are supported (' + _apiVersion + ')';
        }
        
        //get url part after version
        fakeXhr.relativeUrl = fakeXhr.relativeApiUrl.replace("/api/data/" + _apiVersion + "/", "");

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

    function GetInverseSetName(pluralEntitySetName) {

        var ending3 = pluralEntitySetName.slice(-3);
        var ending2 = pluralEntitySetName.slice(-2);
        var ending = pluralEntitySetName.slice(-1);

        if (ending3 == "ies")
            return pluralEntitySetName.substring(0, pluralEntitySetName.length - 3) + "y";

        if (ending2 == "es")
            return pluralEntitySetName.substring(0, pluralEntitySetName.length - 2) + "s";

        return pluralEntitySetName.substring(0, pluralEntitySetName.length - 1); //remove last "s" in any other case
    }
    function translateODataToQueryExpression(entityname, parsedQuery) {
        var qe = {};

        qe.EntityName = GetInverseSetName(entityname);
        if (parsedQuery['$select']) {
            qe.ColumnSet = translateODataToQueryExpression_select(entityname, parsedQuery['$select']);
        }
        else {
            qe.ColumnSet = { AllColumns: true };
        }

        qe.Criteria = null;
        if (parsedQuery['$filter']) {
            qe.Criteria = parsedQuery['$filter'];
        }

        if (parsedQuery['$top']) {
            qe.TopCount = parsedQuery['$top'];
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
        jsonData.id = Guid.create().toString();

        if (!_data[entityName]) {
            _data[entityName] = [];
        }

        _data[entityName][jsonData.id] = jsonData;

        //Compose fake response
        var response = {};

        fakeXhr.status = 204;
        fakeXhr.response = JSON.stringify({});
        fakeXhr.readyState = 4; //Completed

        //Headers
        var entityIdUrl = _fakeCrmUrl + '/api/data/' + _apiVersion + '/' + entityName + '(' + jsonData.id + ')'; 
        fakeXhr.setResponseHeader("OData-EntityId", entityIdUrl);

        //Force callback
        if (fakeXhr.onreadystatechange)
            fakeXhr.onreadystatechange();
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
            if (error) {
                throw JSON.stringify(error);
            }

            if (result.Entities) {

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
    FakeXMLHttpRequest.prototype.getRequestHeader = function (key) {
        return this.requestHeaders[key];
    };
    FakeXMLHttpRequest.prototype.setResponseHeader = function (key, value) {
        this.responseHeaders[key] = value;
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
    

    exports.Xrm = xrm;
    exports.data = _data;
    exports.setApiVersion = function (version) {
        _apiVersion = version;
    }
    exports.setProxyPath = function (path) {
        _dllProxyBasePath = path;
        initProxy();
    };
    exports.initialize = function (entities) {
        initProxy();

        if (!entities.length) {
            throw new "Entities must be a JS array";
        }

        _data = [];

        var l = entities.length;
        for (var i = 0; i < l; i++) {
            var e = entities[i];

            if (!e.id) {
                throw new "Entity"+ i.toString() + " must have an id property";
            }

            if (!Guid.isGuid(e.id)) {
                throw new "Entity" + i.toString() + " must have a valid id property (Guid expected)";
            }

            if (!e.logicalName) {
                throw new "Entity" + i.toString() + " must have a valid logicalName attribute";
            }

            e.id = e.id.toString();

            var entityName = e.logicalName.toLowerCase();

            if (!_data[entityName])
                _data[entityName] = [];

            _data[entityName][e.id.toString()] = e;
        }
    };

})(exports);


