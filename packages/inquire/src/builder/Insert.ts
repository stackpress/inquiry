//common
import type { Value, Resolve } from '../types';
import Engine from '../Engine';

export default class Insert<R = unknown> {
  /**
   * Database engine
   */
  public readonly engine: Engine;
  
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
    return this.engine.dialect.insert(this);
  }

  /**
   * Set table, quote and action
   */
  public constructor(table: string, engine: Engine) {
    this._table = table;
    this.engine = engine;
  }

  /**
   * Makes class awaitable. Should get the 
   * query and values and call the action.
   */
  public then(resolve: Resolve<R[]>) {
    return this.engine.query<R>([ this.query ]).then(resolve);
  }

  values(values: Record<string, Value>|Record<string, Value>[]) {
    if (!Array.isArray(values)) {
      values = [values];
    }

    this._values = values as Record<string, any>[];
    return this;
  }
}