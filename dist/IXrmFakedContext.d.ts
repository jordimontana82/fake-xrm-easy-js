import IEntity from './IEntity';
import IFakeXmlHttpRequest from './IFakeXmlHttpRequest';
import IFakeMessageExecutor from './IFakeMessageExecutor';
export default interface IXrmFakedContext {
    initialize(entities: Array<IEntity>): void;
    executeRequest(fakeXhr: IFakeXmlHttpRequest): void;
    addFakeMessageExecutor(executor: IFakeMessageExecutor): void;
}
