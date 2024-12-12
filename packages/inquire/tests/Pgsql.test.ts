import { describe, it } from 'mocha';
import { expect } from 'chai';

import Alter from '../src/builder/Alter';
import Create from '../src/builder/Create';
import Delete from '../src/builder/Delete';
import Insert from '../src/builder/Insert';
import Select from '../src/builder/Select';
import Update from '../src/builder/Update';
import Pgsql from '../src/dialect/Pgsql';

describe('Pgsql Dialect Tests', () => {
  it('Should translate alter', async () => {
    const alter = new Alter('table');
    alter.addField('id', { 
      type: 'integer',
      length: 11,
      nullable: false,
      comment: 'Foobar',
      autoIncrement: true
    });
    alter.addField('profileId', { 
      type: 'integer',
      length: 11,
      nullable: false,
      comment: 'Foobar'
    });
    alter.addField('name', { 
      type: 'string',
      length: 255,
      default: 'foobar',
      nullable: true,
      comment: 'Foobar'
    });
    alter.addField('price', { 
      type: 'float',
      length: [ 11, 2 ],
      default: 1.1,
      nullable: true,
      unsigned: true,
      comment: 'Foobar'
    });
    alter.addField('active', { 
      type: 'boolean',
      default: true,
      nullable: true,
      comment: 'Foobar'
    });
    alter.addField('date', { 
      type: 'datetime',
      default: 'now()',
      nullable: true,
      comment: 'Foobar'
    });
    alter.addKey('price', 'name');
    alter.addUniqueKey('name', 'name');
    alter.addPrimaryKey('id');
    alter.addForeignKey('profileId', { 
      local: 'profileId',
      foreign: 'id',
      table: 'profile',
      delete: 'CASCADE',
      update: 'RESTRICT'
    });
    alter.removeField('price');
    alter.removeKey('price');
    alter.removeUniqueKey('name');
    alter.removePrimaryKey('id');
    alter.removeForeignKey('profileId');
    alter.changeField('name', {
      type: 'string',
      length: 255,
      default: 'foobar',
      nullable: true,
      comment: 'Foobar'
    });

    const query = Pgsql.alter(alter);
    expect(query[0].query).to.equal(
      'ALTER TABLE "table" '
        + 'DROP COLUMN "price", '
        + 'ADD COLUMN "id" SERIAL NOT NULL, '
        + 'ADD COLUMN "profileId" INTEGER NOT NULL, '
        + 'ADD COLUMN "name" VARCHAR(255) DEFAULT \'foobar\', '
        + 'ADD COLUMN "price" DECIMAL(11, 2) DEFAULT 1.1, '
        + 'ADD COLUMN "active" BOOLEAN DEFAULT TRUE, '
        + 'ADD COLUMN "date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, '
        + 'ALTER COLUMN "name" TYPE VARCHAR(255), '
        + 'ALTER COLUMN "name" SET DEFAULT \'foobar\', '
        + 'DROP CONSTRAINT "id", '
        + 'ADD PRIMARY KEY ("id"), '
        + 'DROP UNIQUE "name", '
        + 'ADD UNIQUE "name" ("name"), '
        + 'DROP INDEX "price", '
        + 'ADD INDEX "price" ("name"), '
        + 'DROP CONSTRAINT "profileId", '
        + 'ADD CONSTRAINT "profileId" FOREIGN KEY ("profileId") '
        + 'REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE RESTRICT'
    );
    expect(query[0].values).to.be.empty;
  });

  it('Should translate create', async () => {
    const create = new Create('table');
    create.addField('id', { 
      type: 'integer',
      length: 11,
      nullable: false,
      comment: 'Foobar',
      autoIncrement: true
    });
    create.addField('profileId', { 
      type: 'integer',
      length: 11,
      nullable: false,
      comment: 'Foobar'
    });
    create.addField('name', { 
      type: 'string',
      length: 255,
      default: 'foobar',
      nullable: true,
      comment: 'Foobar'
    });
    create.addField('price', { 
      type: 'float',
      length: [ 11, 2 ],
      default: 1.1,
      nullable: true,
      unsigned: true,
      comment: 'Foobar'
    });
    create.addField('active', { 
      type: 'boolean',
      default: true,
      nullable: true,
      comment: 'Foobar'
    });
    create.addField('date', { 
      type: 'datetime',
      default: 'now()',
      nullable: true,
      comment: 'Foobar'
    });
    create.addKey('price', 'name');
    create.addUniqueKey('name', 'name');
    create.addPrimaryKey('id');
    create.addForeignKey('profileId', { 
      local: 'profileId',
      foreign: 'id',
      table: 'profile',
      delete: 'CASCADE',
      update: 'RESTRICT'
    });

    const query = Pgsql.create(create);
    expect(query[0].query).to.equal(
      'CREATE TABLE IF NOT EXISTS "table" ('
      + '"id" SERIAL NOT NULL, '
      + '"profileId" INTEGER NOT NULL, '
      + '"name" VARCHAR(255) DEFAULT \'foobar\', '
      + '"price" DECIMAL(11, 2) DEFAULT 1.1, '
      + '"active" BOOLEAN DEFAULT TRUE, '
      + '"date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP , '
      + 'PRIMARY KEY ("id") , UNIQUE ("name") , '
      + 'CONSTRAINT "profileId" FOREIGN KEY ("profileId") '
      + 'REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE RESTRICT)'
    );
    expect(query[0].values).to.be.empty;
    expect(query[1].query).to.equal(
      'CREATE INDEX "price" ON "table"("name")'
    );
    expect(query[1].values).to.be.empty;
  });

  it('Should translate delete', async () => {
    const remove = new Delete('table');
    remove.where('id = ?', [ 1 ]);

    const query = Pgsql.delete(remove);
    expect(query.query).to.equal(
      'DELETE FROM "table" WHERE id = ?'
    );
    expect(query.values?.[0]).to.equal(1);
  });

  it('Should translate insert', async () => {
    const insert = new Insert('table');
    insert.values([
      { id: 1, name: 'foobar' },
      { id: 2, name: 'barfoo' }
    ]);

    const query = Pgsql.insert(insert);
    expect(query.query).to.equal(
      'INSERT INTO "table" ("id", "name") VALUES (?, ?), (?, ?)'
    );
    expect(query.values?.[0]).to.equal(1);
    expect(query.values?.[1]).to.equal('foobar');
    expect(query.values?.[2]).to.equal(2);
    expect(query.values?.[3]).to.equal('barfoo');
  });

  it('Should translate select', async () => {
    const select = new Select('*');
    select.from('table');
    select.join('inner', 'profile', 'profile.id', 'table.profileId');
    select.where('id = ?', [ 1 ]);
    select.order('id', 'asc');
    select.limit(1);
    select.offset(1);

    const query = Pgsql.select(select);
    expect(query.query).to.equal(
      'SELECT * FROM "table" '
      + 'INNER JOIN "profile" ON ("profile.id" = "table.profileId") '
      + 'WHERE id = ? '
      + 'ORDER BY "id" ASC '
      + 'LIMIT 1 OFFSET 1'
    );
    expect(query.values?.[0]).to.equal(1);
  });

  it('Should translate update', async () => {
    const update = new Update('table');
    update.set({ name: 'foobar' });
    update.where('id = ?', [ 1 ]);

    const query = Pgsql.update(update);
    expect(query.query).to.equal('UPDATE "table" SET name = ? WHERE id = ?');
    expect(query.values?.[0]).to.equal('foobar');
    expect(query.values?.[1]).to.equal(1);
  });
});