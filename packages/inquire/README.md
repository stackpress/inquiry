# 💬 Inquire

Super lightweight generic typed SQL query builder, SQL dialects and composite engine. Schema builder, but no ORM. Bring your own database library.

 - Node MySQL2
 - Better SQLite3
 - Node PostGres (pg)
 - PGLite
 - CockroachDB
 - NeonDB
 - Vercel Postgres

## Install

```bash
$ npm i @stackpress/inquire
```

## MySQL Connection

```js
import mysql from 'mysql2/promise';
import connect from '@stackpress/inquire-mysql2';

//this is the raw resource, anything you want
const resource = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'inquire',
});
//this maps the resource to the engine
const engine = connect(resource);
```

## PostGreSQL Connection

```js
import { Client, Pool } from 'pg';
import connect from '@stackpress/inquire-pg';

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
const engine = connect(connection);
```

## SQLite Connection

```js
import sqlite from 'better-sqlite3';
import connect from '@stackpress/inquire-sqlite3';

//this is the raw resource, anything you want
const resource = sqlite(':memory:');
//this maps the resource to the engine
const engine = connect(resource);
```

## Usage

```js
const create = engine.create('profile')
  .addField('id', { type: 'INTEGER' })
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

if (usePool && connection instanceof Client === false) {
  connection.release();
}

if (connection instanceof Client) {
  await connection.end();
}
```

See [examples](https://github.com/stackpress/inquire/tree/main/examples)
for other ways to use.