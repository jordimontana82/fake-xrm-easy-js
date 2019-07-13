import { XrmFakedContext } from '../../src/XrmFakedContext';
import { Entity } from '../../src/Entity';

var Guid = require('guid');
var WebApiClient = require('../../webresources/new_WebApiClient.ts');
var fakeUrl: string = 'http://fakeUrl';

describe("XrmFakedContext: Update", function () {
    let context: XrmFakedContext = null;
    let fakeXhr: any = null;
    var idToUpdate = Guid.create();

    beforeEach(() => {
        context = new XrmFakedContext("v9.0",fakeUrl, true);
        context.initialize([
            new Entity("account", Guid.create(), {name: 'Account 1', other: 'Other'}),
            new Entity("account", idToUpdate, {name: 'Account 2', other: 'Other'})
        ]);
    });

    test("it should update an account with properties if exists", done => {
        WebApiClient.update("accounts", idToUpdate.toString(),
            {
                "name": "Sample Account Updated",
                "creditonhold": true,
                "description": "Updated description"
            }, function success(xhr) {

                //verify an account was created with the exact same fields
                var accounts = context.createQuery("account").toArray();
                expect(accounts.length).toBe(2);
                
                var accountUpdated = context.getEntity("account", idToUpdate.toString()).toXrmEntity();

                //Attributes updated
                expect(accountUpdated["name"]).toBe("Sample Account Updated");
                expect(accountUpdated["description"]).toBe("Updated description");
                expect(accountUpdated["creditonhold"]).toBe(true);

                //Previous attributes still retain values
                expect(accountUpdated["other"]).toBe("Other");

                //verify xhr response
                expect(xhr.status).toBe(204);

                done();
        });
    });

    test("it should create an account if id doesn't exists (upsert)", done => {
        var newId = Guid.create();

        WebApiClient.update("accounts", newId.toString(),
            {
                "name": "Sample Account Updated",
                "creditonhold": true,
                "description": "Updated description"
            }, function success(xhr) {

                //verify an account was created with the exact same fields
                var accounts = context.createQuery("account").toArray();
                expect(accounts.length).toBe(3);
                
                var accountUpdated = context.getEntity("account", newId.toString()).toXrmEntity();

                //Attributes updated
                expect(accountUpdated["name"]).toBe("Sample Account Updated");
                expect(accountUpdated["description"]).toBe("Updated description");
                expect(accountUpdated["creditonhold"]).toBe(true);

                //verify xhr response
                expect(xhr.status).toBe(204);

                done();
        });
    });
});



