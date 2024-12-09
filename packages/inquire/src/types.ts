import type { NestedObject } from '@stackpress/types/dist/types';

import type Alter from './builder/Alter';
import type Create from './builder/Create';
import type Delete from './builder/Delete';
import type Insert from './builder/Insert';
import type Select from './builder/Select';
import type Update from './builder/Update';

//--------------------------------------------------------------------//
// Schema Types

export type Field = {
  type: string,
  length?: number,
  attribute?: string,
  default?: string|number,
  nullable?: boolean,
  unsigned?: boolean,
  autoIncrement?: boolean,
  comment?: string  
}

export type Relation = { 
  type: string, 
  table: string, 
  as: string, 
  from: string, 
  to: string 
};

export type AlterFields = {
  add: Record<string, Field>,
  update: Record<string, Field>,
  remove: string[]
};

export type AlterKeys = {
  add: Record<string, string[]>,
  remove: string[]
};

export type AlterUnqiues = {
  add: Record<string, string[]>,
  remove: string[]
};

export type AlterPrimaries = {
  add: string[],
  remove: string[]
};

//--------------------------------------------------------------------//
// Builder Types

export type StrictValue = string|number;
export type StrictOptValue = StrictValue|null;
//for filters
export type FlatValue = StrictOptValue|boolean|Date;
//for setting values
export type Value = FlatValue
  | (FlatValue|NestedObject<Value>)[]
  | NestedObject<Value>;


export type Resolve<T> = (value: T) => T;
export type Reject = (error: Error) => void;

export type Order = 'ASC'|'DESC'|'asc'|'desc';
export type Join = 'inner'
  | 'left'
  | 'left_outer'
  | 'right'
  | 'right_outer'
  | 'full'
  | 'full_outer'
  | 'cross';

//--------------------------------------------------------------------//
// Dialect Types

export type Dialect = {
  alter(builder: Alter): QueryObject;
  create(builder: Create): QueryObject;
  delete(builder: Delete): QueryObject;
  insert(builder: Insert): QueryObject;
  select(builder: Select): QueryObject;
  update(builder: Update): QueryObject;
};

//--------------------------------------------------------------------//
// Engine Types

export type QueryObject = { query: string, values?: Value[] };

export interface Connection {
  dialect: Dialect;

  /**
   * Query the database. Should return just the expected 
   * results, because the raw results depends on the 
   * native database engine connection. Any code that uses
   * this library should not care about the kind of database.
   */
  query<R = unknown>(queries: QueryObject[]): Promise<R[]>;
};