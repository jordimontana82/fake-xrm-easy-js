import XrmFakedContext from '../../src/XrmFakedContext';
import Entity from '../../src/Entity';
import { doesNotThrow } from 'assert';
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

    test("it should return all columns when there is no $select", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'Company 1', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Company 2', revenue: 100001, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts", function (data) {
            expect(data.value.length).toBe(2); //2 records
            expect(data.value[0].name).toBe("Company 1");
            expect(data.value[1].name).toBe("Company 2");
            expect(data.value[0].revenue).toBe(3000);
            expect(data.value[1].revenue).toBe(100001);
            expect(data.value[0].other).toBe("somevalue");
            expect(data.value[1].other).toBe("someothervalue");
            expect(data.value.length).toBe(2);
            done();
        });
    });

});

//Got these filters from https://msdn.microsoft.com/en-gb/library/gg334767.aspx
describe("XrmFakedContext Queries: $filter", function () {
    
    test("$filter: no filter should return all records", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'Company 1', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Company 2', revenue: 100001, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts", function (data) {

            expect(data.value.length).toBe(2); 
            done();
        });
    });

    test("$filter: eq test", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'Company 1', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Company 2', revenue: 100001, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts?$filter=revenue eq 100001", function (data) {

            expect(data.value.length).toBe(1); 
            expect(data.value[0].name).toBe("Company 2");
            expect(data.value[0].revenue).toBe(100001);
            done();
        });
    });

    
    test("$filter: eq test with no matching results", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'Company 1', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Company 2', revenue: 100001, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts?$filter=revenue eq 100000", function (data) {
            expect(data.value.length).toBe(0);
            done();
        });
    });

    test("$filter: ne test", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'Company 1', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Company 2', revenue: 4567, other: "someothervalue"}),
            new Entity("account", Guid.create(), {name: 'Company 3', revenue: 100001, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts?$filter=revenue ne 100001", function (data) {
            expect(data.value.length).toBe(2);
            expect(data.value[0].name).toBe("Company 1");
            expect(data.value[1].name).toBe("Company 2");
            done();
        });
    });

    test("$filter: gt test", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'Company 1', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Company 2', revenue: 4567, other: "someothervalue"}),
            new Entity("account", Guid.create(), {name: 'Company 3', revenue: 100001, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts?$filter=revenue gt 3000", function (data) {
            expect(data.value.length).toBe(2);
            expect(data.value[0].name).toBe("Company 2");
            expect(data.value[1].name).toBe("Company 3");
            done();
        });
    });

    test("$filter: ge test", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'Company 1', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Company 2', revenue: 4567, other: "someothervalue"}),
            new Entity("account", Guid.create(), {name: 'Company 3', revenue: 100001, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts?$filter=revenue ge 4567", function (data) {
            expect(data.value.length).toBe(2);
            expect(data.value[0].name).toBe("Company 2");
            expect(data.value[1].name).toBe("Company 3");
            done();
        });
    });

    test("$filter: lt test", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'Company 1', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Company 2', revenue: 4567, other: "someothervalue"}),
            new Entity("account", Guid.create(), {name: 'Company 3', revenue: 100001, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts?$filter=revenue lt 4567", function (data) {
            expect(data.value.length).toBe(1);
            expect(data.value[0].name).toBe( "Company 1");
            done();
        });
    });

    test("$filter: le test", done => {

        context.initialize([
            new Entity("account", Guid.create(), {name: 'Company 1', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Company 2', revenue: 4567, other: "someothervalue"}),
            new Entity("account", Guid.create(), {name: 'Company 3', revenue: 100001, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts?$filter=revenue le 4567", function (data) {
            expect(data.value.length).toBe(2);
            expect(data.value[0].name).toBe("Company 1");
            expect(data.value[1].name).toBe("Company 2");
            done();
        });
    });

    
    test("$filter: startsWith test", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'A Company', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Another Company', revenue: 4567, other: "someothervalue"}),
            new Entity("account", Guid.create(), {name: 'Company 3', revenue: 100001, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts?$filter=startswith(name,'a')", function (data) {
            expect(data.value.length).toBe(2);
            expect(data.value[0].name).toBe( "A Company");
            expect(data.value[1].name).toBe( "Another Company");
            done();
        });
    });

    test("$filter: startsWith upperCase test", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'A Company', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Another Company', revenue: 4567, other: "someothervalue"}),
            new Entity("account", Guid.create(), {name: 'Company 3', revenue: 100001, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts?$filter=startswith(name,'A')", function (data) {
            expect(data.value.length).toBe(2);
            expect(data.value[0].name).toBe( "A Company");
            expect(data.value[1].name).toBe( "Another Company");
            done();
        });
    });

    test("$filter: startsWith should return empty collection if there was no match", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'A Company', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Another Company', revenue: 4567, other: "someothervalue"}),
            new Entity("account", Guid.create(), {name: 'Company 3', revenue: 100001, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts?$filter=startswith(name,'AnT')", function (data) {
            expect(data.value.length).toBe(0);
            done();
        });
    });

    
    test("$filter: endsWith test", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'A Company', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Another Company', revenue: 4567, other: "someothervalue"}),
            new Entity("account", Guid.create(), {name: 'Company 3', revenue: 100001, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts?$filter=endswith(name,'company')", function (data) {
            expect(data.value.length).toBe(2);
            expect(data.value[0].name).toBe( "A Company");
            expect(data.value[1].name).toBe( "Another Company");
            done();
        });
    });

    test("$filter: substringof test", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'Company A', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Another Company', revenue: 4567, other: "someothervalue"}),
            new Entity("account", Guid.create(), {name: 'This is a Company 3', revenue: 100001, other: "someothervalue"}),
            new Entity("account", Guid.create(), {name: 'Other', revenue: 3, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts?$filter=substringof('Company', name)", function (data) {
            expect(data.value.length).toBe(3);
            expect(data.value[0].name).toBe( "Company A");
            expect(data.value[1].name).toBe( "Another Company");
            expect(data.value[2].name).toBe( "This is a Company 3");
            done();
        });

    });

    test("$filter: and test", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'A Company', revenue: 4567, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Company 1', revenue: 4567, other: "someothervalue"}),
            new Entity("account", Guid.create(), {name: 'Company 1', revenue: 100001, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts?$filter=revenue eq 4567 and name eq 'Company 1'", function (data) {
            expect(data.value.length).toBe(1);
            expect(data.value[0].name).toBe("Company 1");
            expect(data.value[0].revenue).toBe(4567);
            done();
        });

    });

    test("$filter: or test", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'Company 1', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Company 2', revenue: 4567, other: "someothervalue"}),
            new Entity("account", Guid.create(), {name: 'Company 3', revenue: 100001, other: "someothervalue"})
        ]);

        WebApiClient.retrieveMultiple("accounts?$filter=revenue eq 4567 or revenue eq 100001", function (data) {
            expect(data.value.length).toBe(2);
            expect(data.value[0].name).toBe( "Company 2");
            expect(data.value[1].name).toBe( "Company 3");
            done();
        });
    });

    /*
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

