import XrmFakedContext from '../../src/XrmFakedContext';
import Entity from '../../src/Entity';
var Guid = require('guid');

var WebApiClient = require('../../webresources/new_WebApiClient.ts');
var fakeUrl: string = 'http://fakeUrl';

describe("XrmFakedContext: Initialize", function () {
    let context: XrmFakedContext = null;
    beforeEach(() => {
        context = new XrmFakedContext("v9.0",fakeUrl, true);
    });

    test("getAllData should retrieve the initialised data", done => {
        context.initialize([
            new Entity("account", Guid.create(), {name: 'Company 1', revenue: 3000, other: "somevalue"}),
            new Entity("account", Guid.create(), {name: 'Company 2', revenue: 100001, other: "someothervalue"})
        ]);

        var allData = context.getAllData();
        var accounts = allData.get("account").values();

        expect(accounts.length).toBe(2); //2 records
        expect(accounts[0].attributes["name"]).toBe("Company 1");
        expect(accounts[1].attributes["name"]).toBe("Company 2");
        expect(accounts[0].attributes["revenue"]).toBe(3000);
        expect(accounts[1].attributes["revenue"]).toBe(100001);
        expect(accounts[0].attributes["other"]).toBe("somevalue");
        expect(accounts[1].attributes["other"]).toBe("someothervalue");
        done();
    });
});

