import { expect } from '@open-wc/testing';

import { Configuration } from '../src/Configuration.js';
import { data } from './test-data-json.js';

describe('Configuration', () => {
  it('getMenus returns all menus', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.getMenus();

    // then
    expect(result.length).to.equal(3);
  });

  it('getMenu returns menu with items', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.getMenu('menu1');

    // then
    expect(result.items.length).to.equal(2);
    expect(result.items[0].id).to.equal('parent1');
    expect(result.items[1].id).to.equal('parent2');
  });

  it('getIdPathForUrl returns first item matching url', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.getIdPathForUrl('/some/path/item2.2');

    // then
    expect(result.getMenuId()).to.equal('menu1');
    expect(result.getFirstLevelItemId()).to.equal('parent2');
    expect(result.getId(2)).to.equal('item2.2');
  });

  it('getIdPathForUrl returns first item matching url, and tries to match without trailing slash as a fallback', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.getIdPathForUrl('/some/path/item2.2/');

    // then
    expect(result.getMenuId()).to.equal('menu1');
    expect(result.getFirstLevelItemId()).to.equal('parent2');
    expect(result.getId(2)).to.equal('item2.2');
  });

  it('getIdPathForUrl returns first item matching url, and tries to match subpath as a fallback', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.getIdPathForUrl('/some/path/item2.2/unknown-subitem');

    // then
    expect(result.getMenuId()).to.equal('menu1');
    expect(result.getFirstLevelItemId()).to.equal('parent2');
    expect(result.getId(2)).to.equal('item2.2');
  });

  it('should generate missing ids on creation', () => {
    // when
    const configuration = new Configuration(data);

    // then
    const item = configuration.getObjectPathForSelection(object => object.url === '/some/path/generatedId');
    expect(item.getLastItem().id).to.not.be.undefined;
  });

  it('should not generate ids on invalid data', () => {
    [undefined, null, 0].forEach(configData => {
      const configuration = new Configuration(configData);

      expect(configuration.getMenu('menu1')).to.be.undefined;
      expect(configuration.getMenu('menu2')).to.be.undefined;
    });
  });

  it('findFirstNodePath returns first node path matching criteria', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.getObjectPathForSelection(object => object.id === 'item2.2');

    // then
    expect(result.getObject(0).id).to.equal('menu1');
    expect(result.getObject(1).id).to.equal('parent2');
    expect(result.getObject(2).id).to.equal('item2.2');
  });

  it('getData returns nested first level items by path', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.getData(['menus::menu2', `items::parent4`]);

    // then
    expect(result.id).to.equal('parent4');
    expect(result.url).to.equal('/some/path/parent4');
  });

  it('getIdPathForSelection returns first parent item matching id', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.getIdPathForSelection(element => element.id === 'parent2');

    // then
    expect(result.getMenuId()).to.equal('menu1');
    expect(result.getFirstLevelItemId()).to.equal('parent2');
    expect(result.getId(2)).to.be.undefined;
  });

  it('getIdPathForSelection returns first item matching id', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.getIdPathForSelection(element => element.id === 'item2.2');

    // then
    expect(result.getMenuId()).to.equal('menu1');
    expect(result.getFirstLevelItemId()).to.equal('parent2');
    expect(result.getId(2)).to.equal('item2.2');
  });
});
