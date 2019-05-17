
(function (exports) {

    var version = "v9.0";

    function getRecords(query) {
        var req = new XMLHttpRequest();
        
        var clientUrl = Xrm.Page.context.getClientUrl();

        req.open("GET", encodeURI(clientUrl + "/api/data/" + version + "/" + query), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4/* complete */) {
                req.onreadystatechange = null;
                if (this.status == 204) {
                    var accountUri = this.getResponseHeader("OData-EntityId");
                    console.log("Created account with URI: " + accountUri)
                }
                else {
                    var error = JSON.parse(this.response).error;
                    console.log(error.message);
                }
            }
        };
        req.send(null);
    }

    function create(entityName, data, successCallback, errorCallback) {
        var xhr: any = new XMLHttpRequest();

        var clientUrl = Xrm.Page.context.getClientUrl();

        var entityUrl = clientUrl + "/api/data/" + version + "/" + entityName;
        xhr.open("POST", encodeURI(entityUrl), true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.setRequestHeader("OData-MaxVersion", "4.0");
        xhr.setRequestHeader("OData-Version", "4.0");

        xhr.onreadystatechange = function () {
            if (this.readyState == 4/* complete */) {
                xhr.onreadystatechange = null;
                if (this.status == 204) {
                    var data = JSON.parse(this.response);
                    if (successCallback) {
                        //GetResponseHeader
                        var entityIdUrl = xhr.getResponseHeader("OData-EntityId");
                        if (entityIdUrl) {
                            //Get just the ID
                            var guid = entityIdUrl.replace(entityUrl, "")
                                .replace("(", "")
                                .replace(")", "");

                            successCallback(guid, xhr);
                        }
                        
                    }
                }
                else {
                    var error = JSON.parse(this.response).error;
                    console.log(error.message);
                }
            }
        };
        xhr.send(JSON.stringify(data));
    }

    function update(entityName, id, data, successCallback, errorCallback) {
        var xhr: any = new XMLHttpRequest();

        var clientUrl = Xrm.Page.context.getClientUrl();

        var entityUrl = clientUrl + "/api/data/" + version + "/" + entityName + '(' + id + ')';
        xhr.open("PATCH", encodeURI(entityUrl), true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.setRequestHeader("OData-MaxVersion", "4.0");
        xhr.setRequestHeader("OData-Version", "4.0");

        xhr.onreadystatechange = function () {
            if (this.readyState == 4/* complete */) {
                xhr.onreadystatechange = null;
                if (this.status == 204) {
                    var data = JSON.parse(this.response);
                    if (successCallback) {
                            successCallback(xhr);
                    }
                }
                else {
                    var error = JSON.parse(this.response).error;
                    console.log(error.message);
                }
            }
        };
        xhr.send(JSON.stringify(data));
    }

    function deleteRecord(entityName, id, successCallback, errorCallback) {
        var xhr: any = new XMLHttpRequest();

        var clientUrl = Xrm.Page.context.getClientUrl();

        var entityUrl = clientUrl + "/api/data/" + version + "/" + entityName + '(' + id + ')';
        xhr.open("DELETE", encodeURI(entityUrl), true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.setRequestHeader("OData-MaxVersion", "4.0");
        xhr.setRequestHeader("OData-Version", "4.0");

        xhr.onreadystatechange = function () {
            if (this.readyState == 4/* complete */) {
                xhr.onreadystatechange = null;
                if (this.status == 204) {
                    var data = JSON.parse(this.response);
                    if (successCallback) {
                            successCallback(xhr);
                    }
                }
                else {
                    var error = JSON.parse(this.response).error;
                    console.log(error.message);
                }
            }
        };
        xhr.send(null);
    }

    function getMultipleRecords(query, successCallback, errorCallback) {
        var req = new XMLHttpRequest();

        var clientUrl = Xrm.Page.context.getClientUrl();

        req.open("GET", encodeURI(clientUrl + "/api/data/" + version + "/" + query), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4/* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    var data = JSON.parse(this.response);
                    if (successCallback) {
                        successCallback(data);
                    }
                }
                else {
                    var error = JSON.parse(this.response).error;
                    console.log(error.message);
                }
            }
        };
        req.send(null);
    }
    
    exports.get = getRecords;
    exports.retrieveMultiple = getMultipleRecords;
    exports.create = create;
    exports.update = update;
    exports.delete = deleteRecord;

})(typeof exports === 'undefined' ? this['WebApiClient'] = {} : exports);


