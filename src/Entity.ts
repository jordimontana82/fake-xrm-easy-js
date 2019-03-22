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

    clone(): IEntity {
        var e = new Entity(this.logicalName, this.id, this.attributes);
        return e;
    }
    toXrmEntity(): any {
        var entity = {};
        for(var attr in this.attributes) {
            entity[attr] = this.attributes[attr];
        }
        return entity;
    }

    projectAttributes(columnSet: Array<string>): IEntity {
        var cloned = this.clone();

        if(!columnSet)
            return cloned; //All columns

        cloned.attributes = {};
        for(var i=0; i < columnSet.length; i++) {
            var attribute = columnSet[i];
            cloned.attributes[attribute] = this.attributes[attribute];
        }
        return cloned;
    }
}
