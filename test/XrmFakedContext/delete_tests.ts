import { XrmFakedContext } from '../../src/XrmFakedContext';
import { Entity } from '../../src/Entity';

var Guid = require('guid');
var WebApiClient = require('../../webresources/new_WebApiClient.ts');
var fakeUrl: string = 'http://fakeUrl';

describe("XrmFakedContext: Delete", function () {
    var context: XrmFakedContext;
    let fakeXhr: any = null;
    var idToDelete = Guid.create();

    beforeEach(() => {
        context = new XrmFakedContext("v9.0",fakeUrl, true);
        context.initialize([
            new Entity("account", Guid.create(), {name: 'Account 1', other: 'Other'}),
            new Entity("account", idToDelete, {name: 'Account 2', other: 'Other'})
        ]);
    });

    test("it should delete an account with properties if exists", done => {
        WebApiClient.delete("accounts", idToDelete.toString(), function success(xhr) {

            //verify an account was created with the exact same fields
            var accounts = context.getAllData().get("account").values();
            expect(accounts.length).toBe(1);
            
            var accountDeleted = context.getAllData().get("account").get(idToDelete.toString());

            //Attributes updated
            expect(accountDeleted).toBe(undefined);
            
            //verify xhr response
            expect(xhr.status).toBe(204);

            done();
        });
    });

    test("it should return error if an account record doesn't exists (upsert)", done => {
        var newId = Guid.create();

        var deleteFn = () => WebApiClient.delete("accounts", newId.toString(), function success(xhr) {

            //verify an account was created with the exact same fields
            var accounts = context.getAllData().get("account").values();
            expect(accounts.length).toBe(3);
            
            var accountUpdated = context.getAllData().get("account").get(newId.toString()).toXrmEntity();

            //Attributes updated
            expect(accountUpdated["name"]).toBe("Sample Account Updated");
            expect(accountUpdated["description"]).toBe("Updated description");
            expect(accountUpdated["creditonhold"]).toBe(true);

            //verify xhr response
            expect(xhr.status).toBe(204);

        });

        expect(deleteFn).toThrow();
        done();
    });
});



