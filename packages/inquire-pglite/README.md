# 💬 Inquire - PGLite

PGLite connection for the Inquire library.

## Install

```bash
$ npm i @stackpress/inquire-pglite
```

## Usage

```js
import { PGlite } from '@electric-sql/pglite';
import connect from '@stackpress/inquire-pglite';

//this is the raw resource, anything you want
const resource = new PGlite('./build/database');
//this maps the resource to the engine
const engine = connect(resource);
```