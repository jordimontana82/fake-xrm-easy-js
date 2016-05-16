var edge = require('edge');
//var sinon = require('sinon');
var odataParser = require('odata-parser');

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
    
    function processXhr(fakeXhr) {
        //Only process requests which belong to the CRM URL
        if (fakeXhr.url.indexOf(xrm.Page.context.getClientUrl()) < 0) {
            return;
        }

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
    
    //Process query depending on method
    function processXhrPost(fakeXhr) {
        var jsonData = JSON.parse(fakeXhr.requestBody);
    }
    function processXhrGet(fakeXhr) {
        if (fakeXhr.url.indexOf('?') >= 0) {
            //Query
            var odataQuery = fakeXhr.url.split('?')[1];
            var parsedUrl = odataParser.parse(odataQuery);
        }
        else {
            //Return the first x records??
        }
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
    exports.initialize = function (entities) {
        if (!entities.length) {
            throw new "Entities must be a JS array";
        }
        
        var l = entities.length;
        for (var i = 0; i < l; i++) {
            var e = entities[i];

            if (!e.id) {
                throw new "Entity"+ i.toString() + " must have an id property";
            }


        }
    };

})(exports);


