import IGuid from './IGuid';

export interface IEntity {
    logicalName: string;
    id: IGuid;
    attributes: any;

    clone(): IEntity;
    toXrmEntity(): any;
    projectAttributes(columnSet: Array<string>): IEntity;
    satisfiesFilter(filter: any): boolean;
}
