//modules
import type { PGlite } from '@electric-sql/pglite';
//stackpress
import Engine from '@stackpress/inquire/dist/Engine';
//local
import Connection from './Connection';

export function connect(resource: PGlite) {
  const connection = new Connection(resource);
  return new Engine(connection);
}