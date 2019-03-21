global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xrmFakedContext = require('../src/xrmFakedContext.js');
global.Xrm = xrmFakedContext.Xrm;

var WebApiClient = require('../webresources/new_WebApiClient.js/index.js');
var assert = require('chai').assert;


describe("Web API Create: basic", function () {
    it("it should create an account with properties", function () {
        WebApiClient.create("accounts", {
            "name": "Sample Account",
            "creditonhold": false,
            "address1_latitude": 47.639583,
            "description": "This is the description of the sample account",
            "revenue": 5000000,
            "accountcategorycode": 1
        }, function success(guid) {
            //entityid was returned

            assert.equal(xrmFakedContext.data["accounts"][guid].name, "Sample Account");
        });

        
    });
});

