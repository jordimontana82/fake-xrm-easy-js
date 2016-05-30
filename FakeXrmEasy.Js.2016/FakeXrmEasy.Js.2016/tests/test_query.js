global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xrmFakedContext = require('../src/xrmFakedContext.js');
global.Xrm = xrmFakedContext.Xrm;

var queryHelper = require('../webresources/queryHelper.js');
var assert = require('chai').assert;
var Guid = require('guid');

describe("XHR Get", function () {
    it("$select: it should retrieve fields specified in $select clause", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'Company 1', revenue: 3000, other: "somevalue" },
            { id: Guid.create(), name: 'Company 2', revenue: 100001, other: "someothervalue" }
        ]);

        var bWasCalled = false;

        queryHelper.retrieveMultiple("accounts?$select=name,revenue", function (data) {
            bWasCalled = true;
            assert.equal(data.value.length, 2); //2 records
            assert.equal(data.value[0].name, "Company 1"); 
            assert.equal(data.value[1].name, "Company 2"); 
            assert.equal(data.value[0].revenue, 3000);
            assert.equal(data.value[1].revenue, 100001); 
            assert.equal(data.value[0].other, undefined);
            assert.equal(data.value[1].other, undefined); 
        });

        assert.isTrue(bWasCalled);
    });

    it("$select: it should return all columns when there is no $select", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'Company 1', revenue: 3000 },
            { id: Guid.create(), name: 'Company 2', revenue: 100001 }
        ]);

        var bWasCalled = false;

        queryHelper.retrieveMultiple("accounts", function (data) {
            bWasCalled = true;

            assert.equal(data.value.length, 2); //2 records
            assert.equal(data.value[0].name, "Company 1");
            assert.equal(data.value[1].name, "Company 2");
            assert.equal(data.value[0].revenue, 3000);
            assert.equal(data.value[1].revenue, 100001); 
        });

        assert.isTrue(bWasCalled);
    });

    it("$filter: gt test", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'Company 1', revenue: 3000 },
            { id: Guid.create(), name: 'Company 1', revenue: 100001 }
        ]);

        queryHelper.get("accounts?$select=name,revenue$filter=revenue gt 100000");
    });

    it("$top: it should retrieve the top X first results", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'Company 1', revenue: 3000 },
            { id: Guid.create(), name: 'Company 2', revenue: 100001 },
            { id: Guid.create(), name: 'Company 3', revenue: 100001 },
            { id: Guid.create(), name: 'Company 4', revenue: 100001 },
            { id: Guid.create(), name: 'Company 5', revenue: 100001 },
            { id: Guid.create(), name: 'Company 6', revenue: 100001 }
        ]);

        queryHelper.get("accounts?$select=name,revenue&$top=3");
    });
});

