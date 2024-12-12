import { describe, it } from 'mocha';
import { expect } from 'chai';

import Select from '../src/builder/Select';

describe('Select Builder Tests', () => {
  it('Should build select', async () => {
    const select = new Select('*');
    select.from('table');
    select.join('inner', 'profile', 'profile.id', 'table.profileId');
    select.where('id = ?', [ 1 ]);
    select.order('id', 'asc');
    select.limit(1);
    select.offset(1);
    
    const build = select.build();
    expect(build.columns[0]).to.equal('*');
    expect(build.table?.[0]).to.equal('table');
    expect(build.relations[0].type).to.equal('inner');
    expect(build.relations[0].table).to.equal('profile');
    expect(build.relations[0].from).to.equal('profile.id');
    expect(build.relations[0].to).to.equal('table.profileId');
    expect(build.relations[0].as).to.equal('profile');
    expect(build.filters[0][0]).to.equal('id = ?');
    expect(build.filters[0][1][0]).to.equal(1);
    expect(build.sort[0][0]).to.equal('id');
    expect(build.sort[0][1]).to.equal('asc');
    expect(build.limit).to.equal(1);
    expect(build.offset).to.equal(1);
  });
});