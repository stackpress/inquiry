import { describe, it } from 'mocha';
import { expect } from 'chai';

import Alter from '../src/builder/Alter';
import Create from '../src/builder/Create';
import Delete from '../src/builder/Delete';
import Insert from '../src/builder/Insert';
import Select from '../src/builder/Select';
import Update from '../src/builder/Update';
import Mysql from '../src/dialect/Mysql';

describe('Mysql Dialect Tests', () => {
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
      comment: 'Foobar',
      autoIncrement: true
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

    const query = Mysql.alter(alter);
    expect(query[0].query).to.equal(
      "ALTER TABLE `table` ("
        + "DROP `price`, "
        + "ADD COLUMN `id` INT(11) AUTO_INCREMENT, "
        + "ADD COLUMN `profileId` INT(11) AUTO_INCREMENT, "
        + "ADD COLUMN `name` VARCHAR(255) NOT NULL DEFAULT 'foobar', "
        + "ADD COLUMN `price` FLOAT(11, 2) UNSIGNED NOT NULL DEFAULT 1.1, "
        + "ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT TRUE, "
        + "ADD COLUMN `date` DATETIME NOT NULL DEFAULT NOW(), "
        + "CHANGE COLUMN `name` VARCHAR(255) NOT NULL DEFAULT 'foobar', "
        + "DROP PRIMARY KEY `id`, "
        + "ADD PRIMARY KEY (`id`), "
        + "DROP UNIQUE `name`, "
        + "ADD UNIQUE `name` (`name`), "
        + "DROP INDEX `price`, "
        + "ADD INDEX `price` (`name`), "
        + "DROP FOREIGN KEY `profileId`, "
        + "ADD CONSTRAINT `profileId` FOREIGN KEY (`profileId`) "
        + "REFERENCES `profile`(`id`) "
        + "ON DELETE CASCADE ON UPDATE RESTRICT"
      + ")"
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
      comment: 'Foobar',
      autoIncrement: true
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

    const query = Mysql.create(create);
    expect(query[0].query).to.equal(
      "CREATE TABLE IF NOT EXISTS `table` ("
        + "`id` INT(11) AUTO_INCREMENT, "
        + "`profileId` INT(11) AUTO_INCREMENT, `name` VARCHAR(255) NOT NULL DEFAULT 'foobar', "
        + "`price` FLOAT(11, 2) UNSIGNED NOT NULL DEFAULT 1.1, "
        + "`active` BOOLEAN NOT NULL DEFAULT TRUE, "
        + "`date` DATETIME NOT NULL DEFAULT NOW() , "
        + "PRIMARY KEY (`id`) , "
        + "UNIQUE KEY `name` (`name`) , "
        + "KEY `price` (`name`) , "
        + "CONSTRAINT `profileId` FOREIGN KEY (`profileId`) "
        + "REFERENCES `profile`(`id`) "
        + "ON DELETE CASCADE ON UPDATE RESTRICT"
      + ")"
    );
    expect(query[0].values).to.be.empty;
  });

  it('Should translate delete', async () => {
    const remove = new Delete('table');
    remove.where('id = ?', [ 1 ]);

    const query = Mysql.delete(remove);
    expect(query.query).to.equal(
      "DELETE FROM `table` WHERE id = ?"
    );
    expect(query.values?.[0]).to.equal(1);
  });

  it('Should translate insert', async () => {
    const insert = new Insert('table');
    insert.values([
      { id: 1, name: 'foobar' },
      { id: 2, name: 'barfoo' }
    ]);

    const query = Mysql.insert(insert);
    expect(query.query).to.equal(
      "INSERT INTO `table` (`id`, `name`) VALUES (?, ?), (?, ?)"
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

    const query = Mysql.select(select);
    expect(query.query).to.equal(
      "SELECT * FROM `table` "
      + "INNER JOIN `profile` ON (`profile.id` = `table.profileId`) "
      + "WHERE id = ? "
      + "ORDER BY `id` ASC "
      + "LIMIT 1 OFFSET 1"
    );
    expect(query.values?.[0]).to.equal(1);
  });

  it('Should translate update', async () => {
    const update = new Update('table');
    update.set({ name: 'foobar' });
    update.where('id = ?', [ 1 ]);

    const query = Mysql.update(update);
    expect(query.query).to.equal("UPDATE `table` SET name = ? WHERE id = ?");
    expect(query.values?.[0]).to.equal('foobar');
    expect(query.values?.[1]).to.equal(1);
  });
});