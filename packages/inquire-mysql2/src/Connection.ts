//modules
import type { 
  ResultSetHeader,
  Connection as Database 
} from 'mysql2/promise';
//stackpress
import type { 
  Dialect, 
  Connection, 
  QueryObject,
  Transaction
} from '@stackpress/inquire/dist/types';
import Mysql from '@stackpress/inquire/dist/dialect/Mysql';
//local
import type { Results } from './types';

export default class Mysql2Connection implements Connection {
  //sql language dialect
  public readonly dialect: Dialect = Mysql;
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
    if (!Array.isArray(results[0]) && results[0].insertId) {
      this._lastId = results[0].insertId;
    }
    return Array.isArray(results[0]) ? results[0] as R[] : [];
  }

  /**
   * Returns queries and returns the raw results 
   * dictated by the native database connection.
   */
  public async raw<R = unknown>(request: QueryObject) {
    const formatted = this.format(request);
    return await this._query<R>(formatted);
  }

  /**
   * Runs multiple queries in a transaction
   */
  public async transaction<R = unknown>(callback: Transaction<R>) {
    try {
      await this.resource.beginTransaction();
      const results = await callback(this);
      await this.resource.commit();
      return results;
    } catch (e) {
      await this.resource.rollback();
      throw e;
    }
  }

  /**
   * Call the database. If no values are provided, use exec
   */
  protected async _query<R = unknown>(request: QueryObject) {
    const { query, values = [] } = request;
    const results = await this.resource.execute(query, values);
    if (Array.isArray(results[0])) {
      return results as Results<R>;
    }
    return results as unknown as [ ResultSetHeader, undefined ];
  }
}

