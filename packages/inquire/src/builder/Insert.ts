import type { Value, DatabaseEngine } from '../types';

export default class Insert {
  /**
   * Database engine
   */
  public readonly engine: DatabaseEngine;
  
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
    return this.engine.dielect.insert(this);
  }

  /**
   * Set table, quote and action
   */
  public constructor(table: string, engine: DatabaseEngine) {
    this._table = table;
    this.engine = engine;
  }

  /**
   * Makes class awaitable. Should get the 
   * query and values and call the action.
   */
  public then() {
    return this.engine.query([ this.query ]);
  }

  values(values: Record<string, Value>|Record<string, Value>[]) {
    if (!Array.isArray(values)) {
      values = [values];
    }

    this._values = values as Record<string, any>[];
    return this;
  }
}