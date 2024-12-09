//local
import type { Connection as Database } from 'mysql2/promise';
//stackpress
import Engine from '@stackpress/inquire/dist/Engine';
//local
import Connection from './Connection';

export function connect(resource: Database) {
  const connection = new Connection(resource);
  return new Engine(connection);
}