import { describe, it } from 'mocha';
import { expect } from 'chai';

import Update from '../src/builder/Update';

describe('Update Builder Tests', () => {
  it('Should build update', async () => {
    const update = new Update('table');
    update.set({ name: 'foobar' });
    update.where('id = ?', [ 1 ]);
    const build = update.build();
    expect(build.table).to.equal('table');
    expect(build.data.name).to.equal('foobar');
    expect(build.filters[0][0]).to.equal('id = ?');
    expect(build.filters[0][1][0]).to.equal(1);

    expect(true).to.be.true;
  });
});