import IXrmFakedContext from './IXrmFakedContext';
import IFakeXmlHttpRequest from './IFakeXmlHttpRequest';
import IODataUrlParser from './IODataUrlParser';
import ODataParsedUrl from './ODataParsedUrl';
import Dictionary from './Dictionary';
import IEntity from './IEntity';
export declare class XrmFakedContext implements IXrmFakedContext {
    readonly _apiVersion: string;
    readonly _fakeAbsoluteUrlPrefix: string;
    readonly _oDataUrlParser: IODataUrlParser;
    private _data;
    constructor(apiVersion: string, fakeAbsoluteUrlPrefix: string, autoMockGlobalNamespace?: boolean);
    protected setupGlobalMock(): void;
    initialize(entities: Array<IEntity>): void;
    getAllData(): Dictionary<Dictionary<IEntity>>;
    executeRequest(fakeXhr: IFakeXmlHttpRequest): void;
    protected executePostRequest(fakeXhr: IFakeXmlHttpRequest): void;
    protected executePatchRequest(fakeXhr: IFakeXmlHttpRequest): void;
    protected executeDeleteRequest(fakeXhr: IFakeXmlHttpRequest): void;
    protected executeGetRequest(fakeXhr: IFakeXmlHttpRequest): void;
    protected getSingularSetName(pluralEntitySetName: string): string;
    protected executeQuery(entityName: string, parsedQuery: ODataParsedUrl): Array<IEntity>;
}
