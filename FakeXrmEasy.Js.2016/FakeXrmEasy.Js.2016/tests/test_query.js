global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xrmFakedContext = require('../src/xrmFakedContext.js');
global.Xrm = xrmFakedContext.Xrm;

var accountHelper = require('../webresources/queryAccounts.js');
var assert = require('chai').assert;


describe("XHR Get", function () {
    it("it should retrieve filtered accounts", function () {
        xrmFakedContext.initialize("accounts", [
            { name: 'Company 1', revenue: 3000 },
            { name: 'Company 1', revenue: 100001 }
        ]);
        
        accountHelper.getAccounts("$select=name,revenue&$top=3&$filter=revenue gt 100000");
    });
});

