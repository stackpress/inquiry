//common
import type { Field, Resolve, Connection } from '../types';

export default class Create<R = unknown> {
  /**
   * Database connection
   */
  public readonly connection: Connection;
  
  /**
   * List of fields
   */
  protected _fields: Record<string, Field> = {};

  /**
   * List of key indexes
   */
  protected _keys: Record<string, string[]> = {};

  /**
   * List of primary keys
   */
  protected _primary: string[] = [];
  
  /**
   * The table to create.
   */
  protected _table: string;

  /**
   * List of unique keys
   */
  protected _unique: Record<string, string[]> = {};

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
    return this.connection.dialect.create(this);
  }

  /**
   * Set table, quote and action
   */
  public constructor(table: string, connection: Connection) {
    this._table = table;
    this.connection = connection;
  }

  /**
   * Add a field to the table.
   */
  public addField(name: string, field: Field) {
    this._fields[name] = field;
    return this;
  }

  /**
   * Add a key index to the table.
   */
  public addKey(name: string, field: string|string[]) {
    if (!Array.isArray(field)) {
      field = [field];
    }
    this._keys[name] = field;
    return this;
  }

  /**
   * Add a primary key to the table.
   */
  public addPrimaryKey(name: string) {
    this._primary.push(name);
    return this;
  }

  /**
   * Add a unique key to the table.
   */
  public addUniqueKey(name: string, field: string|string[]) {
    if (!Array.isArray(field)) {
      field = [field];
    }
    this._unique[name] = field;
    return this;
  }

  /**
   * Makes class awaitable. Should get the 
   * query and values and call the action.
   */
  public then(resolve: Resolve<R[]>) {
    return this.connection.query<R>([ this.query ]).then(resolve);
  }
}