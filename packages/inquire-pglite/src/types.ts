export type Results<T = any> = {
  rows: T[],
  fields: {
    name: string,
    dataTypeID: number
  }[],
  affectedRows: number
}