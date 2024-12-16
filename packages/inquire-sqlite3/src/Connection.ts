//modules
import type { Database } from 'better-sqlite3';
//stackpress
import type { 
  Dialect, 
  Connection, 
  QueryObject,
  Transaction
} from '@stackpress/inquire/dist/types';
import Sqlite from '@stackpress/inquire/dist/dialect/Sqlite';
//local
import type { Results } from './types';

export default class BetterSqlite3Connection implements Connection {
  //sql language dialect
  public readonly dialect: Dialect = Sqlite;
  //the database connection
  public readonly resource: Database;
  //last inserted id
  protected _lastId?: number|string;

  /**
   * Get the last inserted id
   */
  public get lastId() {
    return this._lastId;
  }

  /**
   * Set the connection
   */
  public constructor(resource: Database) {
    this.resource = resource;
  }

  /**
   * Formats the query to what the database connection understands
   * Formats the values to what the database connection accepts 
   */
  public format(request: QueryObject) {
    let { query, values = [] } = request;
    for (let i = 0; i < values.length; i++) {
      //check the value for Date and arrays and objects
      const value = values[i];
      if (value instanceof Date) {
        values[i] = value.toISOString();
      } else if (Array.isArray(value)) {
        values[i] = JSON.stringify(value);
      } else if (value && typeof value === 'object') {
        values[i] = JSON.stringify(value);
      }
    }
    return { query, values };
  }

  /**
   * Query the database. Should return just the expected 
   * results, because the raw results depends on the 
   * native database connection. Any code that uses this 
   * library should not care about the kind of database.
   */
  public async query<R = unknown>(request: QueryObject) {
    const results = await this.raw(request);
    if (!Array.isArray(results) && results.lastInsertRowid) {
      this._lastId = results.lastInsertRowid;
    }
    return Array.isArray(results) ? results as R[] : [];
  }

  /**
   * Runs query and returns the raw results 
   * dictated by the native database connection.
   */
  public async raw<R = unknown>(request: QueryObject) {
    const formatted = this.format(request);
    return this._query<R>(formatted);
  }

  /**
   * Runs multiple queries in a transaction
   */
  public async transaction<R = unknown>(callback: Transaction<R>) {
    try {
      await this.raw({ query: 'BEGIN TRANSACTION' });
      const results = await callback(this);
      await this.raw({ query: 'COMMIT' });
      return results;
    } catch (e) {
      await this.raw({ query: 'ROLLBACK' });
      throw e;
    }
  }

  /**
   * Call the database. If no values are provided, use exec
   */
  protected _query<R = unknown>(request: QueryObject) {
    const { query, values = [] } = request;
    const stmt = this.resource.prepare(query);
    if (query.toUpperCase().startsWith('SELECT')) {
      return stmt.all(...values) as R[];
    }
    return stmt.run(...values) as Results;
  }
}