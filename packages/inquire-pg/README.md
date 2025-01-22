# 💬 Inquire - PG

PG connection for the Inquire library.

## Install

```bash
$ npm i @stackpress/inquire-pg
```

## Usage

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