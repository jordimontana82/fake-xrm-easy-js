import ODataParsedUrl from './ODataParsedUrl';
export default interface IODataUrlParser {
    parse(url: string): ODataParsedUrl;
}
