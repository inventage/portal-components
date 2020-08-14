import { expect } from '@open-wc/testing';

import { Configuration } from '../src/Configuration.js';
import { data } from './test-data-json.js';

describe('Configuration', () => {
  it('getGroupIds returns all groupIds found in groups property', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.getGroupIds();

    // then
    expect(result.length).to.equal(3);
    expect(result[0]).to.equal('group1');
    expect(result[1]).to.equal('group2');
    expect(result[2]).to.equal('group3');
  });

  it('getGroup returns group with items', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.getGroup('group1');

    // then
    expect(result.items.length).to.equal(2);
    expect(result.items[0].id).to.equal('menu1');
    expect(result.items[1].id).to.equal('menu2');
  });

  it('getPathFromUrl returns first item matching url', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.getPathFromUrl('/some/path/item2.2');

    // then
    expect(result.groupId).to.equal('group1');
    expect(result.menuId).to.equal('menu2');
    expect(result.itemId).to.equal('item2.2');
  });

  it('getPathFromUrl returns first item matching url, and tries to match without trailing slash as a fallback', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.getPathFromUrl('/some/path/item2.2/');

    // then
    expect(result.groupId).to.equal('group1');
    expect(result.menuId).to.equal('menu2');
    expect(result.itemId).to.equal('item2.2');
  });

  it('getPathFromUrl returns first item matching url, and tries to match subpath as a fallback', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.getPathFromUrl('/some/path/item2.2/unknown-subitem');

    // then
    expect(result.groupId).to.equal('group1');
    expect(result.menuId).to.equal('menu2');
    expect(result.itemId).to.equal('item2.2');
  });

  it('should generate missing ids on creation', () => {
    // when
    const configuration = new Configuration(data);

    // then
    const group1 = configuration.getGroup('group1');
    expect(group1.id).to.equal('group1');
  });

  it('should not generate ids on invalid data', () => {
    [undefined, null, 0].forEach(configData => {
      const configuration = new Configuration(configData);

      expect(configuration.getGroup('group1')).to.equal(undefined);
      expect(configuration.getGroup('group2')).to.equal(undefined);
    });
  });

  it('findFirstNodePath returns first node path matching criteria', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.findFirstNodePath(
      element => {
        return element.id === 'item2.2';
      },
      ['group1'],
    );

    // then
    expect(result.group.id).to.equal('group1');
    expect(result.menu.id).to.equal('menu2');
    expect(result.item.id).to.equal('item2.2');
  });

  it('getData returns nested first level items by path', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.getData(['groups', 'group2', `items::menu4`]);

    // then
    expect(result.id).to.equal('menu4');
    expect(result.url).to.equal('/some/path/menu4');
  });

  it('findFirstPath returns first menu matching id', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.findFirstPath(element => element.id === 'menu2');

    // then
    expect(result.groupId).to.equal('group1');
    expect(result.menuId).to.equal('menu2');
    expect(result.itemId).to.equal(undefined);
  });

  it('findFirstPathTo returns first item matching id', () => {
    // given
    const configuration = new Configuration(data);

    // when
    const result = configuration.findFirstPath(element => element.id === 'item2.2');

    // then
    expect(result.groupId).to.equal('group1');
    expect(result.menuId).to.equal('menu2');
    expect(result.itemId).to.equal('item2.2');
  });
});
