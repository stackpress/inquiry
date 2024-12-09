//modules
import type { FieldPacket } from 'mysql2/promise';

export type Results<R = unknown> = [ R[], FieldPacket[] ];