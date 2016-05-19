global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xrmFakedContext = require('../src/xrmFakedContext.js');
global.Xrm = xrmFakedContext.Xrm;

var queryHelper = require('../webresources/queryHelper.js');
var assert = require('chai').assert;
var Guid = require('guid');

describe("XHR Get", function () {
    it("it should retrieve filtered accounts", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'Company 1', revenue: 3000 },
            { id: Guid.create(), name: 'Company 1', revenue: 100001 }
        ]);
        
        queryHelper.get("$select=name,revenue&$top=3&$filter=revenue gt 100000");
    });
});

