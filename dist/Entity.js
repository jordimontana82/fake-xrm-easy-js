"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Entity = /** @class */ (function () {
    function Entity(logicalName, id, attributes) {
        this.logicalName = logicalName;
        this.id = id;
        this.attributes = attributes;
    }
    Entity.prototype.clone = function () {
        var e = new Entity(this.logicalName, this.id, this.attributes);
        return e;
    };
    Entity.prototype.toXrmEntity = function () {
        var entity = {};
        for (var attr in this.attributes) {
            entity[attr] = this.attributes[attr];
        }
        return entity;
    };
    Entity.prototype.projectAttributes = function (columnSet) {
        var cloned = this.clone();
        if (!columnSet)
            return cloned; //All columns
        cloned.attributes = {};
        for (var i = 0; i < columnSet.length; i++) {
            var attribute = columnSet[i];
            cloned.attributes[attribute] = this.attributes[attribute];
        }
        return cloned;
    };
    Entity.prototype.satisfiesFilter = function (filter) {
        if (!filter)
            return true;
        switch (filter.type) {
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
            case "functioncall":
                return this.satisfiesFilterFunctionCall(filter);
            case "and":
                return this.satisfiesFilter(filter.left) && this.satisfiesFilter(filter.right);
            case "or":
                return this.satisfiesFilter(filter.left) || this.satisfiesFilter(filter.right);
        }
        return false;
    };
    Entity.prototype.satisfiesFilterFunctionCall = function (filter) {
        switch (filter.func) {
            case "startswith":
                return this.satisfiesFilterFunctionCallStartsWith(filter);
            case "endswith":
                return this.satisfiesFilterFunctionCallEndsWith(filter);
            case "substringof":
                return this.satisfiesFilterFunctionCallSubstringOf(filter);
        }
        return false;
    };
    Entity.prototype.satisfiesFilterFunctionCallStartsWith = function (filter) {
        var property = this.getFilterPropertyFromArgs(filter);
        var literal = this.getFilterLiteralFromArgs(filter);
        var propertyValue = this.attributes[property.name];
        if (propertyValue) {
            return propertyValue.toLowerCase().startsWith(literal.value.toLowerCase());
        }
        else {
            return false;
        }
    };
    Entity.prototype.satisfiesFilterFunctionCallEndsWith = function (filter) {
        var property = this.getFilterPropertyFromArgs(filter);
        var literal = this.getFilterLiteralFromArgs(filter);
        var propertyValue = this.attributes[property.name];
        if (propertyValue) {
            return propertyValue.toLowerCase().endsWith(literal.value.toLowerCase());
        }
        else {
            return false;
        }
    };
    Entity.prototype.satisfiesFilterFunctionCallSubstringOf = function (filter) {
        var property = this.getFilterPropertyFromArgs(filter);
        var literal = this.getFilterLiteralFromArgs(filter);
        var propertyValue = this.attributes[property.name];
        if (propertyValue) {
            return propertyValue.toLowerCase().includes(literal.value.toLowerCase());
        }
        else {
            return false;
        }
    };
    Entity.prototype.satisfiesFilterEq = function (filter) {
        var property = this.getFilterProperty(filter);
        var literal = this.getFilterLiteral(filter);
        return this.attributes[property.name] === literal.value;
    };
    Entity.prototype.satisfiesFilterGt = function (filter) {
        var property = this.getFilterProperty(filter);
        var literal = this.getFilterLiteral(filter);
        return this.attributes[property.name] > literal.value;
    };
    Entity.prototype.satisfiesFilterLt = function (filter) {
        var property = this.getFilterProperty(filter);
        var literal = this.getFilterLiteral(filter);
        return this.attributes[property.name] < literal.value;
    };
    Entity.prototype.satisfiesFilterNe = function (filter) {
        return !this.satisfiesFilterEq(filter);
    };
    Entity.prototype.getFilterProperty = function (filter) {
        return filter.left.type === "property" ? filter.left : filter.right;
    };
    Entity.prototype.getFilterLiteral = function (filter) {
        return filter.left.type === "literal" ? filter.left : filter.right;
    };
    Entity.prototype.getFilterPropertyFromArgs = function (filter) {
        for (var i = 0; i < filter.args.length; i++) {
            if (filter.args[i].type === "property")
                return filter.args[i];
        }
        return null;
    };
    Entity.prototype.getFilterLiteralFromArgs = function (filter) {
        for (var i = 0; i < filter.args.length; i++) {
            if (filter.args[i].type === "literal")
                return filter.args[i];
        }
        return null;
    };
    return Entity;
}());
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map