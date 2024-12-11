//common
import type { Field, Resolve, Dialect, ForeignKey } from '../types';
import Engine from '../Engine';
import Exception from '../Exception';

export default class Create<R = unknown> {
  /**
   * Database engine
   */
  protected _engine?: Engine;
  
  /**
   * List of fields
   */
  protected _fields: Record<string, Field> = {};

  /**
   * List of foreign key definitions
   */
  protected _foreign: Record<string, ForeignKey> = {};

  /**
   * List of key indexes
   */
  protected _keys: Record<string, string[]> = {};

  /**
   * List of primary keys
   */
  protected _primary: string[] = [];
  
  /**
   * The table to create.
   */
  protected _table: string;

  /**
   * List of unique keys
   */
  protected _unique: Record<string, string[]> = {};

  /**
   * Sets the engine for the builder
   */
  public get engine() {
    return this._engine;
  }

  /**
   * Sets the engine for the builder
   */
  public set engine(engine: Engine | undefined) {
    this._engine = engine;
  }

  /**
   * Set table, quote and action
   */
  public constructor(table: string, engine?: Engine) {
    this._table = table;
    this._engine = engine;
  }

  /**
   * Add a field to the table.
   */
  public addField(name: string, field: Field) {
    this._fields[name] = field;
    return this;
  }

  /**
   * Add a foreign key to the table.
   */
  public addForeignKey(name: string, foriegnKey: ForeignKey) {
    this._foreign[name] = foriegnKey;
    return this;
  }

  /**
   * Add a key index to the table.
   */
  public addKey(name: string, field: string|string[]) {
    if (!Array.isArray(field)) {
      field = [field];
    }
    this._keys[name] = field;
    return this;
  }

  /**
   * Add a primary key to the table.
   */
  public addPrimaryKey(name: string) {
    this._primary.push(name);
    return this;
  }

  /**
   * Add a unique key to the table.
   */
  public addUniqueKey(name: string, field: string|string[]) {
    if (!Array.isArray(field)) {
      field = [field];
    }
    this._unique[name] = field;
    return this;
  }

  /**
   * Converts the class data to object
   */
  public build() {
    return {
      fields: this._fields,
      foreign: this._foreign,
      keys: this._keys,
      primary: this._primary,
      table: this._table,
      unique: this._unique
    }
  }

  /**
   * Convert the builder to a query object.
   */
  public query(dialect?: Dialect) {
    dialect = dialect || this._engine?.dialect;
    if (!dialect) {
      throw Exception.for('No dialect provided');
    }
    return dialect.create(this);
  }

  /**
   * Makes class awaitable. Should get the 
   * query and values and call the action.
   */
  public then(resolve: Resolve<R[]>) {
    if (!this._engine) {
      throw Exception.for('No engine provided');
    }
    return this._engine.query<R>(this.query()).then(resolve);
  }
}