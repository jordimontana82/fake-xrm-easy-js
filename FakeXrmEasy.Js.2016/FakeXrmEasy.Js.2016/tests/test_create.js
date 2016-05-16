global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xrmFakedContext = require('./src/xrmFakedContext.js');
global.Xrm = xrmFakedContext.Xrm;

var accountHelper = require('./webresources/createAccount.js');

describe("XHR Create", function () {
    it("it should create an account", function () {
        accountHelper.createAccount({ name : "Company Name" });
    });
});

