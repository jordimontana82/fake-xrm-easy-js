global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xrmFakedContext = require('./src/xrmFakedContext.js');
global.Xrm = xrmFakedContext.Xrm;

var accountHelper = require('./webresources/createAccount.js');
var assert = require('chai').assert;


describe("XHR Create", function () {
    it("it should create an account with name", function () {
        accountHelper.createAccount({ name : "Company Name" });

        //entity exists in the context with name property
        assert.equal(xrmFakedContext.data["accounts"].name, "Company Name");
    });
});

