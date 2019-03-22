import XrmFakedContext from '../../src/XrmFakedContext';
import Entity from '../../src/Entity';
var Guid = require('guid');

var WebApiClient = require('../../webresources/new_WebApiClient.ts');
var fakeUrl: string = 'http://fakeUrl';

let context: XrmFakedContext = null;
beforeEach(() => {
    context = new XrmFakedContext("v9.0",fakeUrl, true);
});

describe("XrmFakedContext Queries: $select", function () {

    test("it should return an empty data set if the context is empty", done => {

        WebApiClient.retrieveMultiple("accounts?$select=name,revenue", function (data) {
            expect(data.value.length).toBe(0); //2 records
            done();
        });

    });

    test("it should return an empty data set if there are no records for the entity requested", done => {
        context.initialize([
            new Entity("contact", Guid.create(), {firstname: 'Contact 1'}),
            new Entity("contact", Guid.create(), {firstname: 'Contact 2'})
        ]);

        WebApiClient.retrieveMultiple("accounts?$select=name,revenue", function (data) {
            expect(data.value.length).toBe(0);
            done();
        });

    });

    test("it should retrieve fields specified in $select clause only", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'Company 1', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Company 2', revenue: 100001, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts?$select=name,revenue", function (data) {
            expect(data.value.length).toBe(2); //2 records
            expect(data.value[0].name).toBe("Company 1");
            expect(data.value[1].name).toBe("Company 2");
            expect(data.value[0].revenue).toBe(3000);
            expect(data.value[1].revenue).toBe(100001);
            expect(data.value[0].other).toBe(undefined);
            expect(data.value[1].other).toBe(undefined);
            expect(data.value.length).toBe(2);
            done();
        });

    });


    /*
    it("$select: it should return all columns when there is no $select", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'Company 1', revenue: 3000 },
            { id: Guid.create(), name: 'Company 2', revenue: 100001 }
        ]);

        var bWasCalled = false;

        WebApiClient.retrieveMultiple("accounts", function (data) {
            bWasCalled = true;

            assert.equal(data.value.length, 2); //2 records
            assert.equal(data.value[0].name, "Company 1");
            assert.equal(data.value[1].name, "Company 2");
            assert.equal(data.value[0].revenue, 3000);
            assert.equal(data.value[1].revenue, 100001); 
        });

        assert.isTrue(bWasCalled);
    });

    //Got these filters from https://msdn.microsoft.com/en-gb/library/gg334767.aspx

    it("$filter: eq test", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'Company 1', revenue: 3000 },
            { id: Guid.create(), name: 'Company 2', revenue: 100001 }
        ]);

        var bWasCalled = false;

        WebApiClient.retrieveMultiple("accounts?$filter=revenue eq 100001", function (data) {
            bWasCalled = true;

            assert.equal(data.value.length, 1); 
            assert.equal(data.value[0].name, "Company 2");
            assert.equal(data.value[0].revenue, 100001);
        });

        assert.isTrue(bWasCalled);
    });

    it("$filter: eq test with no matching results", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'Company 1', revenue: 3000 },
            { id: Guid.create(), name: 'Company 2', revenue: 100001 }
        ]);

        var bWasCalled = false;

        WebApiClient.retrieveMultiple("accounts?$filter=revenue eq 100000", function (data) {
            bWasCalled = true;
            assert.equal(data.value.length, 0);
        });

        assert.isTrue(bWasCalled);
    });

    it("$filter: ne test", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'Company 1', revenue: 3000 },
            { id: Guid.create(), name: 'Company 2', revenue: 4567 },
            { id: Guid.create(), name: 'Company 3', revenue: 100001 }
        ]);

        var bWasCalled = false;

        WebApiClient.retrieveMultiple("accounts?$filter=revenue ne 100001", function (data) {
            bWasCalled = true;

            assert.equal(data.value.length, 2);
            assert.equal(data.value[0].name, "Company 1");
            assert.equal(data.value[1].name, "Company 2");
        });

        assert.isTrue(bWasCalled);
    });

    it("$filter: gt test", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'Company 1', revenue: 3000 },
            { id: Guid.create(), name: 'Company 2', revenue: 4567 },
            { id: Guid.create(), name: 'Company 3', revenue: 100001 }
        ]);

        var bWasCalled = false;

        WebApiClient.retrieveMultiple("accounts?$filter=revenue gt 3000", function (data) {
            bWasCalled = true;

            assert.equal(data.value.length, 2);
            assert.equal(data.value[0].name, "Company 2");
            assert.equal(data.value[1].name, "Company 3");
        });

        assert.isTrue(bWasCalled);
    });

    it("$filter: ge test", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'Company 1', revenue: 3000 },
            { id: Guid.create(), name: 'Company 2', revenue: 4567 },
            { id: Guid.create(), name: 'Company 3', revenue: 100001 }
        ]);

        var bWasCalled = false;

        WebApiClient.retrieveMultiple("accounts?$filter=revenue ge 4567", function (data) {
            bWasCalled = true;

            assert.equal(data.value.length, 2);
            assert.equal(data.value[0].name, "Company 2");
            assert.equal(data.value[1].name, "Company 3");
        });

        assert.isTrue(bWasCalled);
    });

    it("$filter: lt test", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'Company 1', revenue: 3000 },
            { id: Guid.create(), name: 'Company 2', revenue: 4567 },
            { id: Guid.create(), name: 'Company 3', revenue: 100001 }
        ]);

        var bWasCalled = false;

        WebApiClient.retrieveMultiple("accounts?$filter=revenue lt 4567", function (data) {
            bWasCalled = true;

            assert.equal(data.value.length, 1);
            assert.equal(data.value[0].name, "Company 1");
        });

        assert.isTrue(bWasCalled);
    });

    it("$filter: le test", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'Company 1', revenue: 3000 },
            { id: Guid.create(), name: 'Company 2', revenue: 4567 },
            { id: Guid.create(), name: 'Company 3', revenue: 100001 }
        ]);

        var bWasCalled = false;

        WebApiClient.retrieveMultiple("accounts?$filter=revenue le 4567", function (data) {
            bWasCalled = true;

            assert.equal(data.value.length, 2);
            assert.equal(data.value[0].name, "Company 1");
            assert.equal(data.value[1].name, "Company 2");
        });

        assert.isTrue(bWasCalled);
    });

    it("$filter: startsWith test", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'A Company', revenue: 3000 },
            { id: Guid.create(), name: 'Another Company', revenue: 4567 },
            { id: Guid.create(), name: 'Company 3', revenue: 100001 }
        ]);

        var bWasCalled = false;

        WebApiClient.retrieveMultiple("accounts?$filter=startswith(name,'a')", function (data) {
            bWasCalled = true;

            assert.equal(data.value.length, 2);
            assert.equal(data.value[0].name, "A Company");
            assert.equal(data.value[1].name, "Another Company");
        });

        assert.isTrue(bWasCalled);
    });

    it("$filter: endsWith test", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'A Company', revenue: 3000 },
            { id: Guid.create(), name: 'Another Company', revenue: 4567 },
            { id: Guid.create(), name: 'Company 3', revenue: 100001 }
        ]);

        var bWasCalled = false;

        WebApiClient.retrieveMultiple("accounts?$filter=endswith(name,'Company')", function (data) {
            bWasCalled = true;

            assert.equal(data.value.length, 2);
            assert.equal(data.value[0].name, "A Company");
            assert.equal(data.value[1].name, "Another Company");
        });

        assert.isTrue(bWasCalled);
    });

    it("$filter: substringof test", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'A Company', revenue: 3000 },
            { id: Guid.create(), name: 'Another Company', revenue: 4567 },
            { id: Guid.create(), name: 'Company 3', revenue: 100001 },
            { id: Guid.create(), name: 'Other', revenue: 3 }
        ]);

        var bWasCalled = false;

        WebApiClient.retrieveMultiple("accounts?$filter=substringof('Company', name)", function (data) {
            bWasCalled = true;

            assert.equal(data.value.length, 3);
            assert.equal(data.value[0].name, "A Company");
            assert.equal(data.value[1].name, "Another Company");
            assert.equal(data.value[2].name, "Company 3");
        });

        assert.isTrue(bWasCalled);
    });

    it("$filter: and test", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'Company 1', revenue: 3000 },
            { id: Guid.create(), name: 'Company 2', revenue: 4567 },
            { id: Guid.create(), name: 'Company 3', revenue: 100001 }
        ]);

        var bWasCalled = false;

        WebApiClient.retrieveMultiple("accounts?$filter=revenue le 4567 and name eq 'Company 1'", function (data) {
            bWasCalled = true;

            assert.equal(data.value.length, 1);
            assert.equal(data.value[0].name, "Company 1");
        });

        assert.isTrue(bWasCalled);
    });

    it("$filter: or test", function () {

        xrmFakedContext.initialize("accounts", [
            { id: Guid.create(), name: 'Company 1', revenue: 3000 },
            { id: Guid.create(), name: 'Company 2', revenue: 4567 },
            { id: Guid.create(), name: 'Company 3', revenue: 100001 }
        ]);

        var bWasCalled = false;

        WebApiClient.retrieveMultiple("accounts?$filter=revenue eq 4567 or revenue eq 100001", function (data) {
            bWasCalled = true;

            assert.equal(data.value.length, 2);
            assert.equal(data.value[0].name, "Company 2");
            assert.equal(data.value[1].name, "Company 3");
        });

        assert.isTrue(bWasCalled);
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


        var bWasCalled = false;

        WebApiClient.retrieveMultiple("accounts?$select=name&$top=3", function (data) {
            bWasCalled = true;

            assert.equal(data.value.length, 3);
            assert.equal(data.value[0].name, "Company 1");
            assert.equal(data.value[1].name, "Company 2");
            assert.equal(data.value[2].name, "Company 3");
        });

        assert.isTrue(bWasCalled);
    });
    */
});

