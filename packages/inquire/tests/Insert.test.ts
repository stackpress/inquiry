import { describe, it } from 'mocha';
import { expect } from 'chai';

import Insert from '../src/builder/Insert';

describe('Insert Builder Tests', () => {
  it('Should build insert', async () => {
    const insert = new Insert('table');
    insert.values([
      { id: 1, name: 'foobar' },
      { id: 2, name: 'barfoo' }
    ]);
    const build = insert.build();
    expect(build.table).to.equal('table');
    expect(build.values[0].id).to.equal(1);
    expect(build.values[0].name).to.equal('foobar');
    expect(build.values[1].id).to.equal(2);
    expect(build.values[1].name).to.equal('barfoo');
  });
});