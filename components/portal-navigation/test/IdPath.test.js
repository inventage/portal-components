import { expect } from '@open-wc/testing';
import { IdPath } from '../src/IdPath.js';

describe('IdPath', () => {
  it('with no ids returns undefined for all queries', () => {
    // when
    const idPath = new IdPath();

    // then
    expect(idPath.ids.length).to.equal(0);
    expect(idPath.getMenuId()).to.be.undefined;
    expect(idPath.getFirstLevelItemId()).to.be.undefined;
    expect(idPath.getId(2)).to.be.undefined;
    expect(idPath.isEmpty()).to.be.true;
  });

  it('undefined ids are ignored and filtered during construction', () => {
    // when
    const idPath = new IdPath('menu', 'parent', undefined);

    // then
    expect(idPath.ids.length).to.equal(2);
    expect(idPath.getMenuId()).to.equal('menu');
    expect(idPath.getFirstLevelItemId()).to.equal('parent');
    expect(idPath.getId(2)).to.be.undefined;
  });

  it('getId returns id of proper level', () => {
    // when
    const idPath = new IdPath('menu', 'parent', 'item');

    // then
    expect(idPath.getMenuId()).to.equal('menu');
    expect(idPath.getFirstLevelItemId()).to.equal('parent');
    expect(idPath.getId(2)).to.equal('item');
    expect(idPath.getId(3)).to.be.undefined;
  });

  it('contains returns true if id is in path', () => {
    // when
    const idPath = new IdPath('menu', 'parent', 'item');

    // then
    expect(idPath.contains('menu')).to.be.true;
    expect(idPath.contains('parent')).to.be.true;
    expect(idPath.contains('item')).to.be.true;
    expect(idPath.contains('other')).to.not.be.true;
  });
});
