import { expect } from '@open-wc/testing/index';

import { Configuration } from '../src/Configuration.js';
import { data } from './test-data-json.js';

describe('Configuration', () => {
  it('getGroup returns group with menus', () => {
    // given
    const configuration = new Configuration(['group1', 'group2']);
    configuration.setConfigData(data);

    // when
    const result = configuration.getGroup('group1');

    // then
    expect(result.menus.length).to.equal(2);
    expect(result.menus[0].id).to.equal('menu1');
    expect(result.menus[1].id).to.equal('menu2');
  });

  it('getPathFromUrl returns first item matching url', () => {
    // given
    const configuration = new Configuration(['group1', 'group2']);
    configuration.setConfigData(data);

    // when
    const result = configuration.getPathFromUrl('/some/path/item2.2', ['group1']);

    // then
    expect(result.groupId).to.equal('group1');
    expect(result.menuId).to.equal('menu2');
    expect(result.itemId).to.equal('item2.2');
  });

  it('setConfigData should set generate ids', () => {
    // given
    const configuration = new Configuration(['group1', 'group2']);

    // when
    configuration.setConfigData(data);

    // then
    const group1 = configuration.getGroup('group1');
    expect(group1.id).to.equal('group1');
  });

  it('findFirstNodePath returns first node path matching criteria', () => {
    // given
    const configuration = new Configuration(['group1', 'group2']);
    configuration.setConfigData(data);

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

  it('getData returns nested menus by path', () => {
    // given
    const configuration = new Configuration(['group1', 'group2']);
    configuration.setConfigData(data);

    // when
    const result = configuration.getData(['groups', 'group2', `menus::menu4`]);

    // then
    expect(result.id).to.equal('menu4');
    expect(result.link).to.equal('/some/path/menu4');
  });

  it('findFirstPath returns first menu matching id', () => {
    // given
    const configuration = new Configuration(['group1', 'group2']);
    configuration.setConfigData(data);

    // when
    const result = configuration.findFirstPath(element => element.id === 'menu2', ['group1']);

    // then
    expect(result.groupId).to.equal('group1');
    expect(result.menuId).to.equal('menu2');
    expect(result.itemId).to.equal(undefined);
  });

  it('findFirstPathTo returns first item matching id', () => {
    // given
    const configuration = new Configuration(['group1', 'group2']);
    configuration.setConfigData(data);

    // when
    const result = configuration.findFirstPath(element => element.id === 'item2.2', ['group1']);

    // then
    expect(result.groupId).to.equal('group1');
    expect(result.menuId).to.equal('menu2');
    expect(result.itemId).to.equal('item2.2');
  });
});
