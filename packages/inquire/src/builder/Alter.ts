//common
import type { 
  Field, 
  Resolve,
  AlterFields, 
  AlterKeys, 
  AlterUnqiues, 
  AlterPrimaries
} from '../types';
import Engine from '../Engine';

export default class Alter<R = unknown> {
  /**
   * Database engine
   */
  public readonly engine: Engine;

  /**
   * List of fields
   */
  protected _fields: AlterFields = { add: {}, update: {}, remove: [] };

  /**
   * List of key indexes
   */
  protected _keys: AlterKeys = { add: {}, remove: [] };

  /**
   * The table to create.
   */
  protected _table: string;

  /**
   * List of primary keys
   */
  protected _primary: AlterPrimaries = { add: [], remove: [] };

  /**
   * List of unique keys
   */
  protected _unique: AlterUnqiues = { add: {}, remove: [] };

  /**
   * Converts the class data to object
   */
  public get build() {
    return {
      fields: this._fields,
      keys: this._keys,
      primary: this._primary,
      table: this._table,
      unique: this._unique
    }
  }

  /**
   * Convert the builder to a query object.
   */
  public get query() {
    return this.engine.dialect.alter(this);
  }

  /**
   * Set table, quote and action
   */
  public constructor(table: string, engine: Engine) {
    this._table = table;
    this.engine = engine;
  }

  /**
   * Add a field to the table.
   */
  public addField(name: string, field: Field) {
    this._fields.add[name] = field;
    return this;
  }

  /**
   * Add a key index to the table.
   */
  public addKey(name: string, field: string|string[]) {
    if (!Array.isArray(field)) {
      field = [field];
    }
    this._keys.add[name] = field;
    return this;
  }

  /**
   * Add a primary key to the table.
   */
  public addPrimaryKey(name: string) {
    this._primary.add.push(name);
    return this;
  }

  /**
   * Add a unique key to the table.
   */
  public addUniqueKey(name: string, field: string|string[]) {
    if (!Array.isArray(field)) {
      field = [field];
    }
    this._unique.add[name] = field;
    return this;
  }

  /**
   * Update a field in the table.
   */
  public changeField(name: string, field: Field) {
    this._fields.update[name] = field;
    return this;
  }

  /**
   * Remove a field from the table.
   */
  public removeField(name: string) {
    this._fields.remove.push(name);
    return this;
  }

  /**
   * Remove a key index from the table.
   */
  public removeKey(name: string) {
    this._keys.remove.push(name)
    return this;
  }

  /**
   * Add a primary key to the table.
   */
  public removePrimaryKey(name: string) {
    this._primary.remove.push(name);
    return this;
  }

  /**
   * Remove a unique key from the table.
   */
  public removeUniqueKey(name: string) {
    this._unique.remove.push(name)
    return this;
  }

  /**
   * Makes class awaitable. Should get the 
   * query and values and call the action.
   */
  public then(resolve: Resolve<R[]>) {
    return this.engine.query<R>([ this.query ]).then(resolve);
  }
}