//modules
import type { PGlite } from '@electric-sql/pglite';

export type Results<T = any> = {
  rows: T[],
  fields: {
    name: string,
    dataTypeID: number
  }[],
  affectedRows: number
};

export type Resource = PGlite;
export type Connector = Resource|(() => Promise<Resource>);