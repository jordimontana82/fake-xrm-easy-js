import IODataUrlParser from './IODataUrlParser';
import ODataParsedUrl from './ODataParsedUrl';
export default class ODataUrlParser implements IODataUrlParser {
    parse(url: string): ODataParsedUrl;
}
