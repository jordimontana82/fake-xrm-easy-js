import IODataUrlParser from './IODataUrlParser';
import ODataParsedUrl from './ODataParsedUrl';
import * as odataParser from 'odata-parser';

export default class ODataUrlParser implements IODataUrlParser {
    parse(url: string): ODataParsedUrl {
        var result = new ODataParsedUrl();
        result.wasSingleRetrieve = false;
        
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

        var entityNameWithIdRegex = /^([a-z0-9_]+)\(([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\)(\/([a-z0-9_]+))?$/i;
        var match = entityNameWithIdRegex.exec(result.entitySetName);

        if(match && match.length > 0) {
            result.entitySetName = match[1];
            result.id = match[2];
            result.singleProperty = match[4];
            result.wasSingleRetrieve = true;
        }
        
        return result;
    }

}
