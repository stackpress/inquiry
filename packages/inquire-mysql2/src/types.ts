//modules
import type { Connection, FieldPacket } from 'mysql2/promise';

export type Results<R = unknown> = [ R[], FieldPacket[] ];
export type Resource = Connection;
export type Connector = Resource|(() => Promise<Resource>);