//builder
import Alter from './builder/Alter';
import Create from './builder/Create';
import Delete from './builder/Delete';
import Insert from './builder/Insert';
import Select from './builder/Select';
import Update from './builder/Update';
//local
import type { 
  Value, 
  Connection, 
  QueryObject, 
  Transaction 
} from './types';

export default class Engine {
  //database connection
  public readonly connection: Connection;
  //sql dialect
  public get dialect() {
    return this.connection.dialect;
  }

  /**
   * Sets the query callback
   */
  public constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Alter table query builder
   */
  public alter<R = unknown>(table: string) {
    return new Alter<R>(table, this);
  }

  /**
   * Create table query builder
   */
  public create<R = unknown>(table: string) {
    return new Create<R>(table, this);
  }

  /**
   * Delete table query builder
   */
  public delete<R = unknown>(table: string) {
    return new Delete<R>(table, this);
  }

  /**
   * Drops a table
   */
  public drop(table: string) {
    const { query, values } = this.dialect.drop(table);
    return this.query(query, values);
  }

  /**
   * Inser table query builder
   */
  public insert<R = unknown>(table: string) {
    return new Insert<R>(table, this);
  }

  /**
   * Query the database. Should return just the expected 
   * results, because the raw results depends on the 
   * native database engine connection. Any code that uses
   * this library should not care about the kind of database.
   */
  public query<R = unknown>(query: QueryObject): Promise<R[]>;
  public query<R = unknown>(query: string, values?: Value[]): Promise<R[]>;
  public query<R = unknown>(query: string|QueryObject, values: Value[] = []) {
    if (typeof query === 'string') {
      query = { query, values };
    }
    return this.connection.query<R>(query);
  }

  /**
   * Renames a table
   */
  public rename(from: string, to: string) {
    const { query, values } = this.dialect.rename(from, to);
    return this.query(query, values);
  }

  /**
   * Select table query builder
   */
  public select<R = unknown>(columns?: string|string[]) {
    return new Select<R>(columns, this);
  }

  /**
   * Common pattern to invoke a transaction
   */
  public transaction<R = unknown>(callback: Transaction<R>) {
    return this.connection.transaction<R>(callback);
  }

  /**
   * Truncate table
   */
  public truncate(table: string, cascade = false) {
    const { query, values } = this.dialect.truncate(table, cascade);
    return this.query(query, values);
  }

  /**
   * Update table query builder
   */
  public update<R = unknown>(table: string) {
    return new Update<R>(table, this);
  }
}