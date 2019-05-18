"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Guid = require('guid');
var Enumerable = require("linq");
var ODataUrlParser_1 = require("./ODataUrlParser");
var Dictionary_1 = require("./Dictionary");
var FakeXmlHttpRequest_1 = require("./FakeXmlHttpRequest");
var Entity_1 = require("./Entity");
var XrmFakedContext = /** @class */ (function () {
    function XrmFakedContext(apiVersion, fakeAbsoluteUrlPrefix, autoMockGlobalNamespace) {
        this._apiVersion = "v9.0";
        this._fakeAbsoluteUrlPrefix = "http://fakecrmurl:5555/fakeOrgName";
        this._oDataUrlParser = new ODataUrlParser_1.default();
        this._apiVersion = apiVersion;
        this._fakeAbsoluteUrlPrefix = fakeAbsoluteUrlPrefix;
        this._data = new Dictionary_1.default();
        if (autoMockGlobalNamespace) {
            this.setupGlobalMock();
        }
    }
    XrmFakedContext.prototype.setupGlobalMock = function () {
        var self = this;
        var fakeXhr = new FakeXmlHttpRequest_1.FakeXmlHttpRequest();
        fakeXhr.sendCallback = function (xhr) {
            self.executeRequest(xhr);
        };
        global.XMLHttpRequest = function () { return fakeXhr; };
        var self = this;
        if (!global.Xrm) {
            global.Xrm = {
                Page: {
                    context: {
                        getClientUrl: function () {
                            return self._fakeAbsoluteUrlPrefix;
                        }
                    }
                }
            };
        }
    };
    XrmFakedContext.prototype.initialize = function (entities) {
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
            if (!this._data.containsKey(entityName)) {
                this._data.add(entityName, new Dictionary_1.default());
            }
            var entityDictionary = this._data.get(entityName);
            if (!entityDictionary.containsKey(e.id.toString())) {
                entityDictionary.add(e.id.toString(), e);
            }
            else {
                entityDictionary.set(e.id.toString(), e);
            }
        }
    };
    XrmFakedContext.prototype.getAllData = function () {
        return this._data;
    };
    XrmFakedContext.prototype.executeRequest = function (fakeXhr) {
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
                    this.executeDeleteRequest(fakeXhr);
                case "PATCH":
                    this.executePatchRequest(fakeXhr);
            }
        }
        else {
            throw 'Content-Type not supported. Fake server supports JSON requests only';
        }
    };
    XrmFakedContext.prototype.executePostRequest = function (fakeXhr) {
        var parsedOData = this._oDataUrlParser.parse(fakeXhr.relativeUrl);
        var entityName = this.getSingularSetName(parsedOData.entitySetName);
        var jsonData = JSON.parse(fakeXhr.requestBody);
        //Create a new record of the specified entity in the context
        var id = Guid.create();
        if (!this._data.containsKey(entityName)) {
            this._data.add(entityName, new Dictionary_1.default());
        }
        var entityDictionary = this._data.get(entityName);
        entityDictionary.add(id.toString(), new Entity_1.Entity(entityName, id, jsonData));
        //Compose fake response
        var response = {};
        fakeXhr.status = 204;
        fakeXhr.response = JSON.stringify({});
        fakeXhr.readyState = 4; //Completed
        //Headers
        var entityIdUrl = this._fakeAbsoluteUrlPrefix + '/api/data/' + this._apiVersion + '/' + parsedOData.entitySetName + '(' + id.toString() + ')';
        fakeXhr.setResponseHeader("OData-EntityId", entityIdUrl);
        //Force onload
        if (fakeXhr.onload) {
            fakeXhr.onload();
            return;
        }
        //Force callback
        if (fakeXhr.onreadystatechange)
            fakeXhr.onreadystatechange();
    };
    XrmFakedContext.prototype.executePatchRequest = function (fakeXhr) {
        var parsedOData = this._oDataUrlParser.parse(fakeXhr.relativeUrl);
        var entityName = this.getSingularSetName(parsedOData.entitySetName);
        var jsonData = JSON.parse(fakeXhr.requestBody);
        if (!parsedOData.id || parsedOData.id == "") {
            throw "Patch message requires an id";
        }
        var id = parsedOData.id;
        if (!this._data.containsKey(entityName)) {
            this._data.add(entityName, new Dictionary_1.default());
        }
        var entityDictionary = this._data.get(entityName);
        if (entityDictionary.containsKey(id)) {
            var currentEntity = entityDictionary.get(id);
            for (var attr in jsonData) {
                currentEntity.attributes[attr] = jsonData[attr];
            }
            entityDictionary.set(id, currentEntity);
        }
        else {
            entityDictionary.add(id.toString(), new Entity_1.Entity(entityName, id, jsonData));
        }
        //Compose fake response
        var response = {};
        fakeXhr.status = 204;
        fakeXhr.response = JSON.stringify({});
        fakeXhr.readyState = 4; //Completed
        //Force onload
        if (fakeXhr.onload) {
            fakeXhr.onload();
            return;
        }
        //Force callback
        if (fakeXhr.onreadystatechange)
            fakeXhr.onreadystatechange();
    };
    XrmFakedContext.prototype.executeDeleteRequest = function (fakeXhr) {
        var parsedOData = this._oDataUrlParser.parse(fakeXhr.relativeUrl);
        var entityName = this.getSingularSetName(parsedOData.entitySetName);
        var jsonData = JSON.parse(fakeXhr.requestBody);
        if (!parsedOData.id || parsedOData.id == "") {
            throw "Delete message requires an id";
        }
        var id = parsedOData.id;
        if (!this._data.containsKey(entityName)) {
            this._data.add(entityName, new Dictionary_1.default());
        }
        var entityDictionary = this._data.get(entityName);
        if (entityDictionary.containsKey(id)) {
            entityDictionary.remove(id);
        }
        else {
            throw 'Entity with entity name = "' + entityName + '" and id="' + id + '"does not exist';
        }
        //Compose fake response
        var response = {};
        fakeXhr.status = 204;
        fakeXhr.response = JSON.stringify({});
        fakeXhr.readyState = 4; //Completed
        //Force onload
        if (fakeXhr.onload) {
            fakeXhr.onload();
            return;
        }
        //Force callback
        if (fakeXhr.onreadystatechange)
            fakeXhr.onreadystatechange();
    };
    XrmFakedContext.prototype.executeGetRequest = function (fakeXhr) {
        var parsedOData = this._oDataUrlParser.parse(fakeXhr.relativeUrl);
        var entityName = this.getSingularSetName(parsedOData.entitySetName);
        //query entities
        var queryResult = this.executeQuery(entityName, parsedOData);
        //Return a list of entities
        var response = {};
        response["@odata.context"] = "";
        var entities = [];
        for (var i = 0; i < queryResult.length; i++) {
            var odataEntity = queryResult[i].toXrmEntity();
            odataEntity["@odata.etag"] = "W/\"" + i.toString() + "\"";
            entities.push(odataEntity);
        }
        response.value = entities;
        fakeXhr.status = 200;
        fakeXhr.response = JSON.stringify(response);
        fakeXhr.responseText = JSON.stringify(response);
        fakeXhr.readyState = 4; //Completed
        //Force onload
        if (fakeXhr.onload) {
            fakeXhr.onload();
            return;
        }
        if (fakeXhr.onreadystatechange)
            fakeXhr.onreadystatechange();
    };
    XrmFakedContext.prototype.getSingularSetName = function (pluralEntitySetName) {
        var ending3 = pluralEntitySetName.slice(-3);
        var ending2 = pluralEntitySetName.slice(-2);
        var ending = pluralEntitySetName.slice(-1);
        if (ending3 == "ies")
            return pluralEntitySetName.substring(0, pluralEntitySetName.length - 3) + "y";
        if (ending2 == "es")
            return pluralEntitySetName.substring(0, pluralEntitySetName.length - 2) + "s";
        return pluralEntitySetName.substring(0, pluralEntitySetName.length - 1); //remove last "s" in any other case
    };
    XrmFakedContext.prototype.executeQuery = function (entityName, parsedQuery) {
        if (!this._data.containsKey(entityName))
            return [];
        var entityDictionary = this._data.get(entityName);
        var records = entityDictionary.values();
        //from
        //join / expands
        //where clause
        //projection
        //orderby
        var columnSet = parsedQuery.queryParams ? parsedQuery.queryParams['$select'] : null;
        var filter = parsedQuery.queryParams ? parsedQuery.queryParams['$filter'] : null;
        var topCount = parsedQuery.queryParams ? parsedQuery.queryParams['$top'] : null;
        var queryeable = Enumerable.from(records)
            //.join()
            .where(function (e, index) { return parsedQuery.id && parsedQuery.id !== "" ? parsedQuery.id == e.id.toString() : true; }) //Single id filter if retrieving single record
            .where(function (e, index) { return e.satisfiesFilter(filter); })
            .select(function (e, index) { return e.projectAttributes(columnSet); });
        //orderby
        if (topCount) {
            queryeable = queryeable.take(topCount);
        }
        var arrayResult = queryeable.toArray();
        var result = [];
        for (var i = 0; i < arrayResult.length; i++) {
            result.push(arrayResult[i]);
        }
        return result;
    };
    return XrmFakedContext;
}());
exports.XrmFakedContext = XrmFakedContext;
//# sourceMappingURL=XrmFakedContext.js.map