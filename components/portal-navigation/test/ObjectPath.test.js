import { expect } from '@open-wc/testing';
import { ObjectPath } from '../src/ObjectPath.js';
import { data } from './test-data-json.js';

describe('ObjectPath', () => {
  it('getObject returns object of proper level', () => {
    // given
    const menu1 = data.menus[0];
    const parent2 = menu1.items[1];
    const item21 = parent2.items[0];

    // when
    const objectPath = new ObjectPath(menu1, parent2, item21);

    // then
    expect(objectPath.getObject(0).id).to.equal('menu1');
    expect(objectPath.getObject(1).id).to.equal('parent2');
    expect(objectPath.getObject(2).id).to.equal('item2.1');
    expect(objectPath.getLastItem().id).to.equal('item2.1');
  });

  it('toIdPath converts to proper path', () => {
    // given
    const menu1 = data.menus[0];
    const parent2 = menu1.items[1];
    const item21 = parent2.items[0];
    const objectPath = new ObjectPath(menu1, parent2, item21);

    // when
    const idPath = objectPath.toIdPath();

    // then
    expect(idPath.getMenuId()).to.equal('menu1');
    expect(idPath.getFirstLevelItemId()).to.equal('parent2');
    expect(idPath.getId(2)).to.equal('item2.1');
  });
});