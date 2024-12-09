//modules
import { Database } from 'better-sqlite3';
//stackpress
import Engine from '@stackpress/inquire/dist/Engine';
//local
import Connection from './Connection';

export function connect(resource: Database) {
  const connection = new Connection(resource);
  return new Engine(connection);
}