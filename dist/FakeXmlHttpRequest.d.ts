import IFakeXmlHttpRequest from './IFakeXmlHttpRequest';
export default class FakeXmlHttpRequest implements IFakeXmlHttpRequest {
    method: string;
    url: string;
    async: boolean;
    requestBody: any;
    requestHeaders: Array<any>;
    response: any;
    responseText: string;
    responseXML: any;
    responseHeaders: Array<any>;
    readyState: number;
    status: number;
    relativeApiUrl: string;
    relativeUrl: string;
    sendCallback: (fakeXhr: IFakeXmlHttpRequest) => void;
    onload: () => void;
    onreadystatechange: () => void;
    constructor();
    open(method?: string, url?: string, async?: boolean): void;
    setRequestHeader(key: string, value: any): void;
    getRequestHeader(key: string): any;
    setResponseHeader(key: string, value: any): void;
    getResponseHeader(key: string): any;
    send(body: any): void;
}
