import IEntity from './IEntity';
import IFakeXmlHttpRequest from './IFakeXmlHttpRequest';

export default interface IXrmFakedContext {
    initialize(entities: Array<IEntity>): void;
    executeRequest(fakeXhr: IFakeXmlHttpRequest): void;
}

    



