
var Guid = require('guid');

import IXrmFakedContext from './IXrmFakedContext';
import IFakeXmlHttpRequest from './IFakeXmlHttpRequest';
import IODataUrlParser from './IODataUrlParser';
import ODataUrlParser from './ODataUrlParser';
import ODataParsedUrl from './ODataParsedUrl';
import Dictionary from './Dictionary';
import IEntity from './IEntity';
import FakeXmlHttpRequest from './FakeXmlHttpRequest';

export default class XrmFakedContext implements IXrmFakedContext 
{
    readonly _apiVersion: string = "v9.0";
    readonly _fakeAbsoluteUrlPrefix: string = "http://fakecrmurl:5555/fakeOrgName";
    readonly _oDataUrlParser: IODataUrlParser = new ODataUrlParser();
    private _data: Dictionary<Dictionary<IEntity>>;

    constructor(apiVersion: string, fakeAbsoluteUrlPrefix: string, autoMockGlobalNamespace?: boolean) {
        this._apiVersion = apiVersion;
        this._fakeAbsoluteUrlPrefix = fakeAbsoluteUrlPrefix;
        this._data = new Dictionary();

        if(autoMockGlobalNamespace) {
            this.setupGlobalMock();
        }
    }
    protected setupGlobalMock(): void {
        if(!global.XMLHttpRequest)
        {
            global.XMLHttpRequest = new FakeXmlHttpRequest();
        }
        if(!global.Xrm) 
        {
            global.Xrm = {
                Page: {
                    context: {
                        getClientUrl: function () {
                            return this._fakeAbsoluteUrlPrefix;
                        }
                    }
                }
            };
        }
    }
    initialize(entities: Array<IEntity>) {
        for (var i = 0; i < entities.length; i++) {
            var e = entities[i];

            if (!Guid.isGuid(e.id)) {
                throw "Entity " + i.toString() + " must have a valid id property (Guid expected)";
            }

            if (!e.logicalName) {
                throw "Entity " + i.toString() + " must have a valid logicalName attribute";
            }

            e.id = e.id.toString();

            var entityName = e.logicalName.toLowerCase();

            if(!this._data.containsKey(entityName)) {
                this._data.add(entityName, new Dictionary());
            }

            var entityDictionary = this._data.get(entityName);
            if(!entityDictionary.containsKey(e.id.toString())) {
                entityDictionary.add(e.id.toString(), e);
            }
            else {
                entityDictionary.set(e.id.toString(), e);
            }
        }
    }
    getAllData():  Dictionary<Dictionary<IEntity>> {
        return this._data;
    }
    executeRequest(fakeXhr: IFakeXmlHttpRequest): void {
        //Only process requests which belong to the CRM URL
        if (fakeXhr.url.indexOf(this._fakeAbsoluteUrlPrefix) < 0) {
            return;
        }
        
        //Get relative url
        fakeXhr.relativeApiUrl = fakeXhr.url.replace(this._fakeAbsoluteUrlPrefix, "");
        
        //Check web api >= v8
        if (fakeXhr.relativeApiUrl.indexOf("/api/data/" + this._apiVersion) < 0) {
            throw 'Only Web API Requests are supported (' + this._apiVersion + ')';
        }
        
        //get url part after version
        fakeXhr.relativeUrl = fakeXhr.relativeApiUrl.replace("/api/data/" + this._apiVersion + "/", "");

        //Undo substring and parse body
        if (fakeXhr.requestHeaders["Content-Type"] &&
            fakeXhr.requestHeaders["Content-Type"].indexOf("application/json") >= 0) {
            
            switch (fakeXhr.method.toUpperCase()) {
                case "POST":
                    this.executePostRequest(fakeXhr);
                    break;
                case "GET":
                    this.executeGetRequest(fakeXhr);
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

    protected executePostRequest(fakeXhr: IFakeXmlHttpRequest): void {

    }

    protected executeGetRequest(fakeXhr: IFakeXmlHttpRequest): void {
        var parsedOData = this._oDataUrlParser.parse(fakeXhr.relativeUrl);

    }
    protected getSingularSetName(pluralEntitySetName: string): string {
        var ending3 = pluralEntitySetName.slice(-3);
        var ending2 = pluralEntitySetName.slice(-2);
        var ending = pluralEntitySetName.slice(-1);

        if (ending3 == "ies")
            return pluralEntitySetName.substring(0, pluralEntitySetName.length - 3) + "y";

        if (ending2 == "es")
            return pluralEntitySetName.substring(0, pluralEntitySetName.length - 2) + "s";

        return pluralEntitySetName.substring(0, pluralEntitySetName.length - 1); //remove last "s" in any other case
    }
    protected executeQuery(parsedODataQuery: ODataParsedUrl): void {
        var entityName = this.getSingularSetName(parsedODataQuery.entitySetName);

    }

}



/*

(function (exports) {

    var _apiVersion = 'v9.0';
    var _proxyVersion = 'v9';

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


    function translateODataToQueryExpression_select(entityname, selectClause) {
        return selectClause; //Already parsed
    }

    function translateODataToQueryExpression_top(entityname, parsedQuery) {

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

        //Force onload
        if (fakeXhr.onload) {
            fakeXhr.onload();
            return;
        }

        //Force callback
        if (fakeXhr.onreadystatechange)
            fakeXhr.onreadystatechange();
    }

    function processXhrGet(fakeXhr) {


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
                fakeXhr.responseText = fakeXhr.response;
                fakeXhr.readyState = 4; //Completed

                //Force onload
                if (fakeXhr.onload) {
                    fakeXhr.onload();
                    return;
                }

                if (fakeXhr.onreadystatechange)
                    fakeXhr.onreadystatechange();
            }
            
        });
    }

    //Replace default XHR behavior with the custom fake one
    global.XMLHttpRequest = new FakeXMLHttpRequest();


})(exports);


*/