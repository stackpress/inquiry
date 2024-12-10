//common
import type { 
  Value, 
  Resolve,
  FlatValue 
} from '../types';
import Engine from '../Engine';

export default class Update<R = unknown> {
  /**
   * Database engine
   */
  public readonly engine: Engine;

  /**
   * The data to update.
   */
  protected _data: Record<string, Value> = {};
  
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
      data: this._data,
      filters: this._filters,
      table: this._table
    }
  }

  /**
   * Convert the builder to a query object.
   */
  public get query() {
    return this.engine.dialect.update(this);
  }

  /**
   * Set table, quote and action
   */
  public constructor(table: string, engine: Engine) {
    this._table = table;
    this.engine = engine;
  }

  /**
   * Set clause
   */
  public set(data: Record<string, Value>) {
    this._data = data;
    return this;
  }

  /**
   * Makes class awaitable. Should get the 
   * query and values and call the action.
   */
  public then(resolve: Resolve<R[]>) {
    return this.engine.query<R>([ this.query ]).then(resolve);
  }

  /**
   * WHERE clause
   */
  public where(query: string, values: FlatValue[] = []) {
    this._filters.push([query, values]);
    return this;
  }
}