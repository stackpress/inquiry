import type { 
  Dialect, 
  Connection, 
  QueryObject
} from '@stackpress/inquire/dist/types';
import { Database } from 'better-sqlite3';
import Pgsql from '@stackpress/inquire/dist/dialect/Pgsql';
import Exception from '@stackpress/inquire/dist/Exception';

//see: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/35b9555e28ea08d9f0054fc8929b2b71fa1b244f/types/pg/index.d.ts#L92C1-L94C2
// export interface QueryResultRow {
//   [column: string]: any;
// }
export type Results = { 
  changes: number, 
  lastInsertRowid: number 
};

export default class BetterSqlite3Connection implements Connection {
  //sql language dialect
  public readonly dialect: Dialect = Pgsql;

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
    return Array.isArray(results) ? results : [];
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
      return this._query<R>(formatted);
    }

    const tx = this.resource.transaction(() => {
      for (const request of queries) {
        const formatted = this._format(request);
        this._query<R>(formatted);
      }
      const formatted = this._format(last);
      return this._query<R>(formatted);
    });

    return tx();
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
  protected _query<R = unknown>(request: QueryObject) {
    const { query, values = [] } = request;
    const stmt = this.resource.prepare(query);
    if (query.toUpperCase().startsWith('SELECT')) {
      return stmt.all(...values) as R[];
    }
    return stmt.run(...values) as Results;
  }
}