import { describe, it } from 'mocha';
import { expect } from 'chai';

import Delete from '../src/builder/Delete';

describe('Delete Builder Tests', () => {
  it('Should build delete', async () => {
    const remove = new Delete('table');
    remove.where('id = ?', [ 1 ]);
    const build = remove.build();
    expect(build.table).to.equal('table');
    expect(build.filters[0][0]).to.equal('id = ?');
    expect(build.filters[0][1][0]).to.equal(1); 
  });
});