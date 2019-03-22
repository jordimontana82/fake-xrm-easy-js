import XrmFakedContext from '../../src/XrmFakedContext';
import Entity from '../../src/Entity';
import Guid from 'guid';

var WebApiClient = require('../../webresources/new_WebApiClient.ts');
var fakeUrl: string = 'http://fakeUrl';

describe("XrmFakedContext: Update", function () {
    let context: XrmFakedContext = null;
    let fakeXhr: any = null;
    var idToUpdate: Guid = Guid.create();

    beforeEach(() => {
        context = new XrmFakedContext("v9.0",fakeUrl, true);
        context.initialize([
            new Entity("account", Guid.create(), {name: 'Account 1'}),
            new Entity("account", idToUpdate, {name: 'Account 2'})
        ]);
    });

    test("it should update an account with properties", done => {
        WebApiClient.update("accounts", idToUpdate.toString(),
            {
                "name": "Sample Account Updated",
                "creditonhold": true,
                "description": "Updated description"
            }, function success(guid, xhr) {

                //verify an account was created with the exact same fields
                var accountCreated = context.getAllData().get("account").get(guid);
                expect(true).toBe(false);

                //verify xhr response
                expect(xhr.status).toBe(204);
                expect(xhr.getResponseHeader("OData-EntityId")).not.toBeNull();

                done();
        });
    });

});



