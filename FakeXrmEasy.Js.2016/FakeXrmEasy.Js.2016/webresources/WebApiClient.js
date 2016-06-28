
(function (exports) {

    var version = "v8.1";

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
        req.send({});
    }

    function create(entityName, data, successCallback, errorCallback) {
        var req = new XMLHttpRequest();

        var clientUrl = Xrm.Page.context.getClientUrl();

        var entityUrl = clientUrl + "/api/data/" + version + "/" + entityName;
        req.open("POST", encodeURI(entityUrl), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");

        req.onreadystatechange = function () {
            if (this.readyState == 4/* complete */) {
                req.onreadystatechange = null;
                if (this.status == 204) {
                    var data = JSON.parse(this.response);
                    if (successCallback) {
                        //GetResponseHeader
                        var entityIdUrl = req.getResponseHeader("OData-EntityId");
                        if (entityIdUrl) {
                            //Get just the ID
                            var guid = entityIdUrl.replace(entityUrl, "")
                                .replace("(", "")
                                .replace(")", "");

                            successCallback(guid);
                        }
                        
                    }
                }
                else {
                    var error = JSON.parse(this.response).error;
                    console.log(error.message);
                }
            }
        };
        req.send(JSON.stringify(data));
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
        req.send({});
    }
    
    exports.get = getRecords;
    exports.retrieveMultiple = getMultipleRecords;
    exports.create = create;

})(typeof exports === 'undefined' ? this['WebApiClient'] = {} : exports);


