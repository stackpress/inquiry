//common
import type { 
  Field, 
  Resolve,
  Dialect,
  AlterFields, 
  AlterKeys, 
  AlterUnqiues, 
  AlterPrimaries
} from '../types';
import type Engine from '../Engine';
import Exception from '../Exception';

export default class Alter<R = unknown> {
  /**
   * Database engine
   */
  protected _engine?: Engine;

  /**
   * List of fields
   */
  protected _fields: AlterFields = { add: {}, update: {}, remove: [] };

  /**
   * List of key indexes
   */
  protected _keys: AlterKeys = { add: {}, remove: [] };

  /**
   * The table to create.
   */
  protected _table: string;

  /**
   * List of primary keys
   */
  protected _primary: AlterPrimaries = { add: [], remove: [] };

  /**
   * List of unique keys
   */
  protected _unique: AlterUnqiues = { add: {}, remove: [] };

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
    this._fields.add[name] = field;
    return this;
  }

  /**
   * Add a key index to the table.
   */
  public addKey(name: string, field: string|string[]) {
    if (!Array.isArray(field)) {
      field = [field];
    }
    this._keys.add[name] = field;
    return this;
  }

  /**
   * Add a primary key to the table.
   */
  public addPrimaryKey(name: string) {
    this._primary.add.push(name);
    return this;
  }

  /**
   * Add a unique key to the table.
   */
  public addUniqueKey(name: string, field: string|string[]) {
    if (!Array.isArray(field)) {
      field = [field];
    }
    this._unique.add[name] = field;
    return this;
  }

  /**
   * Converts the class data to object
   */
  public build() {
    return {
      fields: this._fields,
      keys: this._keys,
      primary: this._primary,
      table: this._table,
      unique: this._unique
    }
  }

  /**
   * Update a field in the table.
   */
  public changeField(name: string, field: Field) {
    this._fields.update[name] = field;
    return this;
  }

  /**
   * Convert the builder to a query object.
   */
  public query(dialect?: Dialect) {
    dialect = dialect || this._engine?.dialect;
    if (!dialect) {
      throw Exception.for('No dialect provided');
    }
    return dialect.alter(this);
  }

  /**
   * Remove a field from the table.
   */
  public removeField(name: string) {
    this._fields.remove.push(name);
    return this;
  }

  /**
   * Remove a key index from the table.
   */
  public removeKey(name: string) {
    this._keys.remove.push(name)
    return this;
  }

  /**
   * Add a primary key to the table.
   */
  public removePrimaryKey(name: string) {
    this._primary.remove.push(name);
    return this;
  }

  /**
   * Remove a unique key from the table.
   */
  public removeUniqueKey(name: string) {
    this._unique.remove.push(name)
    return this;
  }

  /**
   * Makes class awaitable. Should get the 
   * query and values and call the action.
   */
  public then(resolve: Resolve<R[]>) {
    if (!this._engine) {
      throw Exception.for('No engine provided');
    }
    return this._engine.query<R>([ this.query() ]).then(resolve);
  }
}