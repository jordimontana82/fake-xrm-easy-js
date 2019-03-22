import XrmFakedContext from '../../src/XrmFakedContext';
import FakeXmlHttpRequest from '../../src/FakeXmlHttpRequest';

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
            }, function success(guid) {
                //entityid was returned
                var accountName = context.getAllData().get("account").get(guid).attributes["name"];
                expect(accountName).toBe("Sample Account");
                done();
        });
    });

});



