

import IDictionary from './IDictionary';

export default class Dictionary<T> implements IDictionary<T> {

  _keys: string[] = [];
  _values: T[] = [];

  constructor(init?: { key: string; value: T; }[]) {
    if (init) {
      for (var x = 0; x < init.length; x++) {
        this[init[x].key] = init[x].value;
        this._keys.push(init[x].key);
        this._values.push(init[x].value);
      }
    }
  }

  add(key: string, value: T) {
    this[key] = value;
    this._keys.push(key);
    this._values.push(value);
  }

  set(key: string, value: T) {
      this[key] = value;
      var index = this._keys.indexOf(key, 0);
      this._values[index] = value;
  }

  get(key: string): T {
      var index = this._keys.indexOf(key, 0);
      return this._values[index];
  }
  remove(key: string) {
    var index = this._keys.indexOf(key, 0);
    this._keys.splice(index, 1);
    this._values.splice(index, 1);

    delete this[key];
  }

  keys(): string[] {
    return this._keys;
  }

  values(): T[] {
    return this._values;
  }

  containsKey(key: string) {
    if (typeof this[key] === "undefined") {
      return false;
    }

    return true;
  }

  toLookup(): IDictionary<T> {
    return this;
  }
}
