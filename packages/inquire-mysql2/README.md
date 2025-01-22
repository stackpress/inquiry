# 💬 Inquire - MySQL2

MySQL2 connection for the Inquire library.

## Install

```bash
$ npm i @stackpress/inquire-mysql2
```

## Usage

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