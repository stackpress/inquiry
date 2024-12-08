import type { DatabaseEngine } from './types';

import Alter from './builder/Alter';
import Create from './builder/Create';
import Delete from './builder/Delete';
import Insert from './builder/Insert';
import Select from './builder/Select';
import Update from './builder/Update';

export default class Engine {
  public readonly engine: DatabaseEngine;

  /**
   * Sets the query callback
   */
  public constructor(engine: DatabaseEngine) {
    this.engine = engine;
  }

  /**
   * Alter table query builder
   */
  public alter(table: string) {
    return new Alter(table, this.engine);
  }

  /**
   * Create table query builder
   */
  public create(table: string) {
    return new Create(table, this.engine);
  }

  /**
   * Delete table query builder
   */
  public delete(table: string) {
    return new Delete(table, this.engine);
  }

  /**
   * Inser table query builder
   */
  public insert(table: string) {
    return new Insert(table, this.engine);
  }

  /**
   * Select table query builder
   */
  public select(columns?: string|string[]) {
    return new Select(columns, this.engine);
  }

  /**
   * Update table query builder
   */
  public update(table: string) {
    return new Update(table, this.engine);
  }
}