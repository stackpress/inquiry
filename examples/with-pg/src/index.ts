import { Client, Pool } from 'pg';
import Engine from '@stackpress/inquire/dist/Engine';
import PGConnection from './Connection';

async function main(usePool = true) {
  //this is the raw resource, anything you want
  const connection = usePool 
    ? await (async () => {
      const pool = new Pool({
        database: 'inquire',
        user: 'postgres'
      });
      return await pool.connect();
    })() 
    : await (async () => {
      const resource = new Client({
        database: 'inquire',
        user: 'postgres'
      });
      await resource.connect();
      return resource;
    })();

  //this maps the resource to the engine
  const db = new PGConnection(connection);
  //this is the final engine that you will use to interact with the database
  const engine = new Engine(db);

  const create = engine.create('profile')
    .addField('id', { type: 'VARCHAR', length: 255 })
    .addField('name', { type: 'VARCHAR', length: 255 })
    .addPrimaryKey('id');
  console.log(create.query);
  console.log(await create);

  const insert = engine
    .insert('profile')
    .values({ id: '1', name: 'John Doe' });
  console.log(insert.query);
  console.log(JSON.stringify(await insert, null, 2));

  const select = engine.select('*').from('profile');
  console.log(select.query);
  console.log(JSON.stringify(await select, null, 2));

  const update = engine
    .update('profile')
    .set({ name: 'Jane Doe' })
    .where('id = ?', [ '1' ]);
  console.log(update.query);
  console.log(JSON.stringify(await update, null, 2));
  console.log(JSON.stringify(await select, null, 2));

  const remove = engine
    .delete('profile')
    .where('id = ?', [ '1' ]);
  console.log(remove.query);
  console.log(JSON.stringify(await remove, null, 2));
  console.log(JSON.stringify(await select, null, 2));

  if (usePool && connection instanceof Client === false) {
    connection.release();
  }

  if (connection instanceof Client) {
    await connection.end();
  }
}

main(true).catch(console.error);