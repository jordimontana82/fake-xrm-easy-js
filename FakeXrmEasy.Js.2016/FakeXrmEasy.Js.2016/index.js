var edge = require('edge');
var xhrMock = require('./src/xhr.js');

function XrmFakedContext() {
    //constructor
    this.data = []; //list of entities in memory
    
    //Fake server initialization
    var urlPrefix = Xrm.Page.getClientUrl();
    this._fakeServer = xhrMock.fakeServer(urlPrefix);
};

XrmFakedContext.prototype.initialize = function (entities) {

};

var exports = module.exports = {
    Xrm: {
        Page: {
            context: {
                getClientUrl: function () {
                    return "http://fakecrmurl:5555/fakeOrgName/";
                }
            }
        }
    },
    XrmFakedContext: XrmFakedContext
};
