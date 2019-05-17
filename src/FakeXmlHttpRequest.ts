import IFakeXmlHttpRequest from './IFakeXmlHttpRequest';

export class FakeXmlHttpRequest implements IFakeXmlHttpRequest {
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

    constructor() {
        this.method = '';
        this.url = '';
        this.async = true;
        this.requestBody = null;
        this.requestHeaders = [];
        this.response = null;
        this.responseXML = null;
        this.responseHeaders = [];
        this.readyState = 1;
        this.status = 100;
        
        this.relativeApiUrl = '';
        this.relativeUrl = '';

    }
    open(method?: string, url?: string, async?: boolean): void {
        this.method = method
        this.url = url
        if (async === undefined)
            async = true; //default

        this.async = async;
    }
    setRequestHeader(key: string, value: any): void {
        this.requestHeaders[key] = value; 
    }
    getRequestHeader(key: string): any {
        return this.requestHeaders[key];
    }
    setResponseHeader(key: string, value: any): void {
        this.responseHeaders[key] = value; 
    }
    getResponseHeader(key: string): any {
        return this.responseHeaders[key];
    }
    send(body: any) {
        this.requestBody = body;
        this.sendCallback(this);
    }
}
