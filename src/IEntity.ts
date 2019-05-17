import IGuid from './IGuid';

export default interface IEntity {
    logicalName: string;
    id: IGuid;
    attributes: any;

    clone(): IEntity;
    toXrmEntity(): any;
    projectAttributes(columnSet: Array<string>): IEntity;
    satisfiesFilter(filter: any): boolean;
}
