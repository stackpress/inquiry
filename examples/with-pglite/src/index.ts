import { PGlite } from '@electric-sql/pglite';
import connect from '@stackpress/inquire-pglite';

async function main() {
  //this is the raw resource, anything you want
  const resource = new PGlite('./build/database');
  //this maps the resource to the engine
  const engine = connect(resource);

  const create = engine.create('profile')
    .addField('id', { type: 'VARCHAR', length: 255 })
    .addField('name', { type: 'VARCHAR', length: 255 })
    .addPrimaryKey('id');
  console.log(create.query());
  console.log(await create);

  const insert = engine
    .insert('profile')
    .values({ id: '1', name: 'John Doe' });
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