import type { FlatValue, DatabaseEngine } from '../types';

export default class Delete {
  /**
   * Database engine
   */
  public readonly engine: DatabaseEngine;

  /**
   * The filters to apply.
   */
  protected _filters: [string, FlatValue[]][] = [];

  /**
   * The table to delete from.
   */
  protected _table: string;

  /**
   * Converts the class data to object
   */
  public get build() {
    return {
      table: this._table,
      filters: this._filters
    }
  }

  /**
   * Convert the builder to a query object.
   */
  public get query() {
    return this.engine.dielect.delete(this);
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

  /**
   * WHERE clause
   */
  public where(query: string, values: FlatValue[] = []) {
    this._filters.push([query, values]);
    return this;
  }
}