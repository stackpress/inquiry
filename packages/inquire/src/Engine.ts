import type { Connection } from './types';

import Alter from './builder/Alter';
import Create from './builder/Create';
import Delete from './builder/Delete';
import Insert from './builder/Insert';
import Select from './builder/Select';
import Update from './builder/Update';

export default class Engine {
  public readonly connection: Connection;

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
    return new Alter<R>(table, this.connection);
  }

  /**
   * Create table query builder
   */
  public create<R = unknown>(table: string) {
    return new Create<R>(table, this.connection);
  }

  /**
   * Delete table query builder
   */
  public delete<R = unknown>(table: string) {
    return new Delete<R>(table, this.connection);
  }

  /**
   * Inser table query builder
   */
  public insert<R = unknown>(table: string) {
    return new Insert<R>(table, this.connection);
  }

  /**
   * Select table query builder
   */
  public select<R = unknown>(columns?: string|string[]) {
    return new Select<R>(columns, this.connection);
  }

  /**
   * Update table query builder
   */
  public update<R = unknown>(table: string) {
    return new Update<R>(table, this.connection);
  }
}