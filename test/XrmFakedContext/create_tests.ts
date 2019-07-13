import { XrmFakedContext } from '../../src/XrmFakedContext';

var WebApiClient = require('../../webresources/new_WebApiClient.ts');
var fakeUrl: string = 'http://fakeUrl';

describe("XrmFakedContext: Create", function () {
    let context: XrmFakedContext = null;
    let fakeXhr: any = null;
    beforeEach(() => {
        context = new XrmFakedContext("v9.0",fakeUrl, true);
    });

    test("it should create an account with properties", done => {
        WebApiClient.create("accounts", 
            {
                "name": "Sample Account",
                "creditonhold": false,
                "address1_latitude": 47.639583,
                "description": "This is the description of the sample account",
                "revenue": 5000000,
                "accountcategorycode": 1
            }, function success(guid, xhr) {

                //verify an account was created with the exact same fields
                var accountCreated = context.getEntity("account", guid);

                expect(accountCreated.attributes["name"]).toBe("Sample Account");
                expect(accountCreated.attributes["creditonhold"]).toBe(false);
                expect(accountCreated.attributes["address1_latitude"]).toBe(47.639583);
                expect(accountCreated.attributes["description"]).toBe("This is the description of the sample account");
                expect(accountCreated.attributes["revenue"]).toBe(5000000);
                expect(accountCreated.attributes["accountcategorycode"]).toBe(1);

                //verify xhr response
                expect(xhr.status).toBe(204);
                expect(xhr.getResponseHeader("OData-EntityId")).not.toBeNull();

                done();
        });
    });

});



