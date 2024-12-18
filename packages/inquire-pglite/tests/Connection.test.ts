import { describe, it } from 'mocha';
import { expect } from 'chai';

//modules
import path from 'path';
import { PGlite } from '@electric-sql/pglite';
//stackpress
import Engine from '@stackpress/inquire/dist/Engine';
//local
import Connection from '../src/Connection';

describe('PGConnection Tests', () => {
  it('Should connect', async () => {
    //this is the raw resource
    const resource = new PGlite(path.join(__dirname, 'database'));
    //this is the connection
    const connection = new Connection(resource);
    //this is the engine
    const engine = new Engine(connection);

    const a1 = await engine.create('profile')
      .addField('id', { type: 'int', autoIncrement: true })
      .addField('name', { type: 'string', length: 255 })
      .addField('price', { type: 'float', length: [ 10, 2 ], unsigned: true })
      .addField('created', { type: 'date', default: 'now()' })
      .addPrimaryKey('id')
      .addUniqueKey('name', 'name');
    expect(a1).to.be.empty;
    const a2 = await engine.alter('profile')
      .addField('age', { type: 'int', unsigned: true })
      .removeField('price')
      .changeField('created', { type: 'datetime', default: 'now()' });
    expect(a2).to.be.empty;
    const a3 = await engine.insert('profile').values([
      { name: 'John Doe', age: 30 },
      { name: 'Jane Doe', age: 25 }
    ]);
    expect(a3).to.be.empty;
    const a4 = await engine.update('profile')
      .set({ age: 31 })
      .where('name = ?', [ 'Jane Doe' ]);
    expect(a4).to.be.empty;
    const a5 = await engine.delete('profile')
      .where('name = ?', [ 'John Doe' ]);
    expect(a5).to.be.empty;
    const a6 = await engine.select<{
      id: number,
      name: string,
      created: Date,
      age: number
    }>('*').from('profile');
    expect(a6[0].id).to.equal(2);
    expect(a6[0].name).to.equal('Jane Doe');
    expect(a6[0].age).to.equal(31);
    expect(a6[0].created).to.be.instanceOf(Date);
    resource.close();
  }).timeout(20000);
});