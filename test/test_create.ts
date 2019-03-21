import XrmFakedContext from '../src/XrmFakedContext';

var WebApiClient = require('../webresources/js/new_WebApiClient.js');
var fakeUrl: string = 'http://fakeUrl';

describe("Web API Create: basic", function () {
    let context: XrmFakedContext = null;
    beforeEach(() => {
        context = new XrmFakedContext("v9.0",fakeUrl, true);
    });

    it("it should create an account with properties", function () {
        WebApiClient.create("accounts", {
            "name": "Sample Account",
            "creditonhold": false,
            "address1_latitude": 47.639583,
            "description": "This is the description of the sample account",
            "revenue": 5000000,
            "accountcategorycode": 1
        }, function success(guid) {
            //entityid was returned
            var accountName = context.getAllData().get("account").get(guid).attributes[name];
            expect(accountName).toBe("Sample Account");
        });

        
    });

});



