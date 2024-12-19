import { describe, it } from 'mocha';
import { expect } from 'chai';

import type { Connection, QueryObject, Transaction } from '../src/types';
import Pgsql from '../src/dialect/Pgsql';
import Engine from '../src/Engine';
import Exception from '../src/Exception';

describe('Engine Tests', () => {
  it('Should diff table schemas', async () => {
    const resource = new MockConnection();
    const engine = new Engine(resource);
    const from = engine.create('profile')
      .addField('id', { 
        type: 'INTEGER', 
        length: 11, 
        autoIncrement: true 
      })
      .addField('name', { type: 'varchar', length: 255 })
      .addField('bio', { type: 'varchar', length: 255 })
      .addField('created', { type: 'datetime', default: 'now()' })
      .addField('active', { type: 'boolean', default: false })
      .addPrimaryKey('id')
      .addUniqueKey('name', 'name')
      .addKey('active', 'active');

    const to = engine.create('profile')
      .addField('id', { 
        type: 'INTEGER', 
        length: 10, 
        unsigned: true, 
        autoIncrement: true 
      })
      .addField('name', { type: 'varchar', length: 255 })
      //ADD COLUMN "age" INTEGER NOT NULL
      .addField('age', { type: 'integer', length: 3, unsigned: true })
      //ALTER COLUMN "bio" TYPE TEXT
      .addField('bio', { type: 'text' })
      //[same]
      .addField('created', { type: 'datetime', default: 'now()' })
      //ALTER COLUMN "active" SET DEFAULT TRUE
      .addField('active', { type: 'boolean', default: true })
      //[same]
      .addPrimaryKey('id')
      //[same]
      .addUniqueKey('name', 'name');
      //DROP INDEX "active"
    const alter = engine.diff(from, to);
    expect(alter.query()[0].query).to.equal(`ALTER TABLE "profile" `
      + `ADD COLUMN "age" INTEGER NOT NULL, `
      + `ALTER COLUMN "id" TYPE SERIAL, `
      + `ALTER COLUMN "bio" TYPE TEXT, `
      + `ALTER COLUMN "active" TYPE BOOLEAN, `
      + `ALTER COLUMN "active" SET DEFAULT TRUE, `
      + `DROP INDEX "active"`);

    try {
      engine.diff(from, from).query()
    } catch (error) {
      expect(error.message).to.equal('No alterations made.');
    }
  });
});

class MockConnection implements Connection {
  public dialect = Pgsql;

  /**
   * Formats the query to what the database connection understands
   * Formats the values to what the database connection accepts 
   */
  public format(request: QueryObject) {
    let { query, values = [] } = request;
    for (let i = 0; i < values.length; i++) {
      if (!query.includes('?')) {
        throw Exception.for(
          'Query does not match the number of values.'
        );
      }
      //format the query
      query = query.replace('?', `$${i + 1}`);
      //check the value for Date and arrays and objects
      const value = values[i];
      if (value instanceof Date) {
        values[i] = value.toISOString();
      } else if (Array.isArray(value)) {
        values[i] = JSON.stringify(value);
      } else if (value && typeof value === 'object') {
        values[i] = JSON.stringify(value);
      }
    }
    if (query.includes('?')) {
      throw Exception.for(
        'Query does not match the number of values.'
      );
    }
    return { query, values };
  }

  /**
   * Query the database. Should return just the expected 
   * results, because the raw results depends on the 
   * native database connection. Any code that uses this 
   * library should not care about the kind of database.
   */
  public async query<R = unknown>(request: QueryObject) {
    return [];
  }

  /**
   * Runs multiple queries in a transaction
   */
  public async transaction<R = unknown>(callback: Transaction<R>) {
    return [];
  }
}