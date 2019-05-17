import IDictionary from './IDictionary';
export default class Dictionary<T> implements IDictionary<T> {
    _keys: string[];
    _values: T[];
    constructor(init?: {
        key: string;
        value: T;
    }[]);
    add(key: string, value: T): void;
    set(key: string, value: T): void;
    get(key: string): T;
    remove(key: string): void;
    keys(): string[];
    values(): T[];
    containsKey(key: string): boolean;
    toLookup(): IDictionary<T>;
}
