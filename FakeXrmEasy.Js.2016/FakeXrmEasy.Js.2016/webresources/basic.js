(function (exports) {

    function onLoad() {
        console.log()
    }
    exports.onLoad = onLoad;

})(typeof exports === 'undefined' ? this['accountForm'] = {} : exports);


//Call the event as accountForm.onLoad from CRM (assuming this defaults to the current scope in Xrm Page)