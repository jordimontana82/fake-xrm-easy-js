import IXrmFakedContext from './IXrmFakedContext';
import IFakeXmlHttpRequest from './IFakeXmlHttpRequest';
import IODataUrlParser from './IODataUrlParser';
import ODataParsedUrl from './ODataParsedUrl';
import Dictionary from './Dictionary';
import IEntity from './IEntity';
import IFakeMessageExecutor from './IFakeMessageExecutor';
export default class XrmFakedContext implements IXrmFakedContext {
    readonly _apiVersion: string;
    readonly _fakeAbsoluteUrlPrefix: string;
    readonly _oDataUrlParser: IODataUrlParser;
    private _executors;
    private _data;
    constructor(apiVersion: string, fakeAbsoluteUrlPrefix: string, autoMockGlobalNamespace?: boolean);
    protected setupGlobalMock(): void;
    initialize(entities: Array<IEntity>): void;
    getAllData(): Dictionary<Dictionary<IEntity>>;
    executeRequest(fakeXhr: IFakeXmlHttpRequest): void;
    addFakeMessageExecutor(executor: IFakeMessageExecutor): void;
    protected executePostRequest(fakeXhr: IFakeXmlHttpRequest): void;
    protected executePatchRequest(fakeXhr: IFakeXmlHttpRequest): void;
    protected executeDeleteRequest(fakeXhr: IFakeXmlHttpRequest): void;
    protected executeGetRequest(fakeXhr: IFakeXmlHttpRequest): void;
    protected getSingularSetName(pluralEntitySetName: string): string;
    protected executeQuery(entityName: string, parsedQuery: ODataParsedUrl): Array<IEntity>;
    protected findExecutorFor(relativeUrl: string, method: string): IFakeMessageExecutor;
    protected executeCustomExecutor(executor: IFakeMessageExecutor, fakeXhr: IFakeXmlHttpRequest): void;
}
