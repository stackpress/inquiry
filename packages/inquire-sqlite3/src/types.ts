//modules
import type { Database } from 'better-sqlite3';

export type Results = { 
  changes: number, 
  lastInsertRowid: number 
};

export type Resource = Database;
export type Connector = Resource|(() => Promise<Resource>);