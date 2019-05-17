"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FakeXmlHttpRequest = /** @class */ (function () {
    function FakeXmlHttpRequest() {
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
    }
    FakeXmlHttpRequest.prototype.open = function (method, url, async) {
        this.method = method;
        this.url = url;
        if (async === undefined)
            async = true; //default
        this.async = async;
    };
    FakeXmlHttpRequest.prototype.setRequestHeader = function (key, value) {
        this.requestHeaders[key] = value;
    };
    FakeXmlHttpRequest.prototype.getRequestHeader = function (key) {
        return this.requestHeaders[key];
    };
    FakeXmlHttpRequest.prototype.setResponseHeader = function (key, value) {
        this.responseHeaders[key] = value;
    };
    FakeXmlHttpRequest.prototype.getResponseHeader = function (key) {
        return this.responseHeaders[key];
    };
    FakeXmlHttpRequest.prototype.send = function (body) {
        this.requestBody = body;
        this.sendCallback(this);
    };
    return FakeXmlHttpRequest;
}());
exports.default = FakeXmlHttpRequest;
//# sourceMappingURL=FakeXmlHttpRequest.js.map