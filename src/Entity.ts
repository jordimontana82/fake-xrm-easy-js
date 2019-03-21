import IEntity from './IEntity';
import Guid from 'guid';

export default class Entity implements IEntity 
{
    logicalName: string;
    id: Guid;
    attributes: any;

    constructor(logicalName: string, id: Guid, attributes: any) {
        this.logicalName = logicalName;
        this.id = id;
        this.attributes = attributes;
    }
}
