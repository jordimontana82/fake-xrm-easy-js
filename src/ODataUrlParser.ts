import IODataUrlParser from './IODataUrlParser';
import ODataParsedUrl from './ODataParsedUrl';
import * as odataParser from 'odata-parser';

export default class ODataUrlParser implements IODataUrlParser {
    parse(url: string): ODataParsedUrl {
        var result = new ODataParsedUrl();

        if (url.indexOf('?') >= 0) {
            //Query
            result.entitySetName = url.split('?')[0];
            var queryParamsString: string = url.split('?')[1];
            result.queryParams = odataParser.parse(decodeURIComponent(queryParamsString));
        }
        else {
            result.entitySetName = url;
            result.queryParams = null; //Empty query
        }

        return result;
    }
}
