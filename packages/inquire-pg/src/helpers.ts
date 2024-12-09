//modules
import { Client, PoolClient } from 'pg';
//stackpress
import Engine from '@stackpress/inquire/dist/Engine';
//local
import Connection from './Connection';

export function connect(resource: Client|PoolClient) {
  const connection = new Connection(resource);
  return new Engine(connection);
}