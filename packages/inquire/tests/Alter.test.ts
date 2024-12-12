import { describe, it } from 'mocha';
import { expect } from 'chai';

import Alter from '../src/builder/Alter';

describe('Alter Builder Tests', () => {
  it('Should build alter', async () => {
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
      default: 'true',
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
    const build = alter.build();

    expect(build.fields.add.name.type).to.equal('string');
    expect(build.fields.update.name.type).to.equal('string');
    expect(build.fields.remove[0]).to.equal('price');

    expect(build.keys.add.price[0]).to.equal('name');
    expect(build.keys.remove[0]).to.equal('price');

    expect(build.unique.add.name[0]).to.equal('name');
    expect(build.unique.remove[0]).to.equal('name');

    expect(build.primary.add[0]).to.equal('id');
    expect(build.primary.remove[0]).to.equal('id');

    expect(build.foreign.add.profileId.local).to.equal('profileId');
    expect(build.foreign.remove[0]).to.equal('profileId');
  });
});