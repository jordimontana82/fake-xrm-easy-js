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

    satisfiesFilter(filter: any): boolean {
        if(!filter)
            return true;

        switch(filter.type) {
            case "eq":
                return this.satisfiesFilterEq(filter);
            case "ne":
                return this.satisfiesFilterNe(filter);
            case "gt":
                return this.satisfiesFilterGt(filter);
            case "lt":
                return this.satisfiesFilterLt(filter);
            case "ge":
                return this.satisfiesFilterGt(filter) || this.satisfiesFilterEq(filter);
            case "le":
                return this.satisfiesFilterLt(filter) || this.satisfiesFilterEq(filter);

        }
        
        return false;
    }

    protected satisfiesFilterEq(filter: any): boolean {
        var property = this.getFilterProperty(filter);
        var literal = this.getFilterLiteral(filter);

        return this.attributes[property.name] === literal.value;
    }

    protected satisfiesFilterGt(filter: any): boolean {
        var property = this.getFilterProperty(filter);
        var literal = this.getFilterLiteral(filter);

        return this.attributes[property.name] > literal.value;
    }

    protected satisfiesFilterLt(filter: any): boolean {
        var property = this.getFilterProperty(filter);
        var literal = this.getFilterLiteral(filter);

        return this.attributes[property.name] < literal.value;
    }

    protected satisfiesFilterNe(filter: any): boolean {
        return !this.satisfiesFilterEq(filter);
    }

    protected getFilterProperty(filter: any): any {
        return filter.left.type === "property" ? filter.left : filter.right;
    }

    protected getFilterLiteral(filter: any): any {
        return filter.left.type === "literal" ? filter.left : filter.right;
    }
}
