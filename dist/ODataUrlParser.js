"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataParsedUrl_1 = require("./ODataParsedUrl");
var odataParser = require("odata-parser");
var ODataUrlParser = /** @class */ (function () {
    function ODataUrlParser() {
    }
    ODataUrlParser.prototype.parse = function (url) {
        var result = new ODataParsedUrl_1.default();
        result.wasSingleRetrieve = false;
        if (url.indexOf('?') >= 0) {
            //Query
            result.entitySetName = url.split('?')[0];
            var queryParamsString = url.split('?')[1];
            result.queryParams = odataParser.parse(decodeURIComponent(queryParamsString));
        }
        else {
            result.entitySetName = url;
            result.queryParams = null; //Empty query
        }
        var entityNameWithIdRegex = /^([a-z0-9_])*\([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\)$/i;
        var match = entityNameWithIdRegex.exec(result.entitySetName);
        if (match && match.length > 0) {
            var split = result.entitySetName.split('(');
            result.entitySetName = split[0];
            result.id = split[1].replace(")", "");
            result.wasSingleRetrieve = true;
        }
        return result;
    };
    return ODataUrlParser;
}());
exports.default = ODataUrlParser;
//# sourceMappingURL=ODataUrlParser.js.map