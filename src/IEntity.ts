import IGuid from './IGuid';

export default interface IEntity {
    logicalName: string;
    id: IGuid;
    attributes: Array<any>;
}
