//modules
import type { 
  ResultSetHeader,
  Connection as Database 
} from 'mysql2/promise';
//stackpress
import type { 
  Dialect, 
  Connection, 
  QueryObject
} from '@stackpress/inquire/dist/types';
import Mysql from '@stackpress/inquire/dist/dialect/Mysql';
import Exception from '@stackpress/inquire/dist/Exception';
//local
import type { Results } from './types';

export default class Mysql2Connection implements Connection {
  //sql language dialect
  public readonly dialect: Dialect = Mysql;

  //the database connection
  public readonly resource: Database;

  /**
   * Set the connection
   */
  public constructor(resource: Database) {
    this.resource = resource;
  }

  /**
   * Query the database. Should return just the expected 
   * results, because the raw results depends on the 
   * native database connection. Any code that uses this 
   * library should not care about the kind of database.
   */
  public async query<R = unknown>(queries: QueryObject[]) {
    const results = await this.raw<R>(queries);
    return Array.isArray(results[0]) ? results[0] : [];
  }

  /**
   * Returns queries and returns the raw results 
   * dictated by the native database connection.
   */
  public async raw<R = unknown>(queries: QueryObject[]) {
    if (queries.length === 0) {
      throw Exception.for('No queries to execute.');
    } 

    const queue = queries.slice();
    const last = queue.pop() as QueryObject;
    
    if (queue.length === 0) {
      const formatted = this._format(last);
      return await this._query<R>(formatted);
    }

    try {
      await this.resource.query('START TRANSACTION');
      for (const request of queries) {
        const formatted = this._format(request);
        await this._query<R>(formatted);
      }
      const formatted = this._format(last);
      const results = await this._query<R>(formatted);
      await this.resource.query('COMMIT');
      return results;
    } catch (e) {
      await this.resource.query('ROLLBACK');
      throw e;
    }
  }

  /**
   * Formats the query to what the database connection understands
   * Formats the values to what the database connection accepts 
   */
  protected _format(request: QueryObject) {
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

