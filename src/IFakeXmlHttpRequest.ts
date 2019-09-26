
export default interface IFakeXmlHttpRequest {
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
    onload: () => void;
    onreadystatechange: () => void;
    

    open(method?: string, url?: string, async?: boolean): void;
    setRequestHeader(key: string, value: any): void;
    getRequestHeader(key: string): any;
    setResponseHeader(key: string, value: any): void;
    getResponseHeader(key: string): any;
    getAllResponseHeaders(): string | null;
    send(body: any): void;
}
