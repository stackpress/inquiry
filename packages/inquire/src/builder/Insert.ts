//common
import type { Value, Resolve, Connection } from '../types';

export default class Insert<R = unknown> {
  /**
   * Database connection
   */
  public readonly connection: Connection;
  
  /**
   * The table to delete from.
   */
  protected _table: string;

  /**
   * The values to insert.
   */
  protected _values: Record<string, Value>[] = [];

  /**
   * Converts the class data to object
   */
  public get build() {
    return {
      table: this._table,
      values: this._values
    }
  }

  /**
   * Convert the builder to a query object.
   */
  public get query() {
    return this.connection.dialect.insert(this);
  }

  /**
   * Set table, quote and action
   */
  public constructor(table: string, connection: Connection) {
    this._table = table;
    this.connection = connection;
  }

  /**
   * Makes class awaitable. Should get the 
   * query and values and call the action.
   */
  public then(resolve: Resolve<R[]>) {
    return this.connection.query<R>([ this.query ]).then(resolve);
  }

  values(values: Record<string, Value>|Record<string, Value>[]) {
    if (!Array.isArray(values)) {
      values = [values];
    }

    this._values = values as Record<string, any>[];
    return this;
  }
}