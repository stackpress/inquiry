import sqlite from 'better-sqlite3';
import connect from '@stackpress/inquire-sqlite3';

async function main() {
  //this is the raw resource, anything you want
  const resource = sqlite(':memory:');
  //this maps the resource to the engine
  const engine = connect(resource);

  const create = engine.create('profile')
    .addField('id', { type: 'int', autoIncrement: true })
    .addField('name', { type: 'string', length: 255 })
    .addField('price', { type: 'float', length: [ 10, 2 ], unsigned: true })
    .addField('created', { type: 'date', default: 'now()' })
    .addPrimaryKey('id')
    .addUniqueKey('name', 'name');
  console.log(create.query());
  console.log(await create);

  const insert = engine
    .insert('profile')
    .values({ id: '1', name: 'John Doe' })
    .returning('*');
  console.log(insert.query());
  console.log(JSON.stringify(await insert, null, 2));

  const select = engine.select('*').from('profile');
  console.log(select.query());
  console.log(JSON.stringify(await select, null, 2));

  const update = engine
    .update('profile')
    .set({ name: 'Jane Doe' })
    .where('id = ?', [ '1' ]);
  console.log(update.query());
  console.log(JSON.stringify(await update, null, 2));
  console.log(JSON.stringify(await select, null, 2));

  const remove = engine
    .delete('profile')
    .where('id = ?', [ '1' ]);
  console.log(remove.query());
  console.log(JSON.stringify(await remove, null, 2));
  console.log(JSON.stringify(await select, null, 2));
}

main().catch(console.error);