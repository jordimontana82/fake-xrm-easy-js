import XrmFakedContext from '../../src/XrmFakedContext';
import FakeXmlHttpRequest from '../../src/FakeXmlHttpRequest';

var WebApiClient = require('../../webresources/new_WebApiClient.ts');
var fakeUrl: string = 'http://fakeUrl';

describe("XrmFakedContext: Fake Messages", function () {
    let context: XrmFakedContext = null;
    let fakeXhr: any = null;
    var userId = "10968b5b-4f11-e311-a411-0050568a69e2";

    beforeEach(() => {
        context = new XrmFakedContext("v9.0",fakeUrl, true);

        context.addFakeMessageExecutor({
            relativeUrl: "WhoAmI",
            method: "GET",
            execute: (body: any) => {
                return {
                    statusCode: 200,
                    responseBody: {
                        UserId: userId
                    }
                }
            }
        })
    });

    test("it should retrieve custom fake message response ", done => {
        WebApiClient.whoAmI(function (data) {
            expect(data.UserId).toBe(userId);
            done();
        });
    });

});



