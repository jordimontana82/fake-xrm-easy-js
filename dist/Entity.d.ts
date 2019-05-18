import IEntity from './IEntity';
import Guid from 'guid';
export declare class Entity implements IEntity {
    logicalName: string;
    id: Guid;
    attributes: any;
    constructor(logicalName: string, id: Guid, attributes: any);
    clone(): IEntity;
    toXrmEntity(): any;
    projectAttributes(columnSet: Array<string>): IEntity;
    satisfiesFilter(filter: any): boolean;
    protected satisfiesFilterFunctionCall(filter: any): boolean;
    protected satisfiesFilterFunctionCallStartsWith(filter: any): boolean;
    protected satisfiesFilterFunctionCallEndsWith(filter: any): boolean;
    protected satisfiesFilterFunctionCallSubstringOf(filter: any): boolean;
    protected satisfiesFilterEq(filter: any): boolean;
    protected satisfiesFilterGt(filter: any): boolean;
    protected satisfiesFilterLt(filter: any): boolean;
    protected satisfiesFilterNe(filter: any): boolean;
    protected getFilterProperty(filter: any): any;
    protected getFilterLiteral(filter: any): any;
    protected getFilterPropertyFromArgs(filter: any): any;
    protected getFilterLiteralFromArgs(filter: any): any;
}
