//modules
import type { Client, PoolClient } from 'pg';

//see: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/35b9555e28ea08d9f0054fc8929b2b71fa1b244f/types/pg/index.d.ts#L92C1-L94C2
// export interface QueryResultRow {
//   [column: string]: any;
// }
export type Results<R = any> = {
  command: string,
  rowCount: number|null,
  oid: number|null,
  rows: R[],
  fields: {
    name: string,
    tableID: number,
    columnID: number,
    dataTypeID: number,
    dataTypeSize: number,
    dataTypeModifier: number,
    format: string
  }[],
  RowCtor: any, //??
  rowAsArray: boolean
}

export type Resource = Client|PoolClient;
export type Connector = Resource|(() => Promise<Resource>);