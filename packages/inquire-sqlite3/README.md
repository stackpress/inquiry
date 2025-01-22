# 💬 Inquire - SQLite3

Better SQLite3 connection for the Inquire library.

## Install

```bash
$ npm i @stackpress/inquire-sqlite3
```

## Usage

```js
import sqlite from 'better-sqlite3';
import connect from '@stackpress/inquire-sqlite3';

//this is the raw resource, anything you want
const resource = sqlite(':memory:');
//this maps the resource to the engine
const engine = connect(resource);
```