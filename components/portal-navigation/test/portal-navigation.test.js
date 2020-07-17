import { html, fixture, expect } from '@open-wc/testing';

import '../portal-navigation.js';
import { Configuration } from '../src/Configuration.js';
import { data } from './test-data-json.js';

describe('PortalNavigation', () => {
  // it('is empty by default', async () => {
  //   const el = await fixture(html`<portal-navigation></portal-navigation>`);
  //   expect(el.shadowRoot.innerHTML).to.equal('<!----><!---->');
  // });

  it('is displayed by default', async () => {
    const el = await fixture(html`<portal-navigation></portal-navigation>`);
    expect(el).to.be.displayed;
  });

  it('is hidden when attribute hidden is true', async () => {
    const el = await fixture(html`<portal-navigation hidden></portal-navigation>`);
    expect(el).not.to.be.displayed;
  });

  it('passes the a11y audit', async () => {
    const el = await fixture(html`<portal-navigation></portal-navigation>`);
    await expect(el).to.be.accessible();
  });
});

describe('Configuration', () => {
  it('getData returns all menus of group', () => {
    // given
    const configuration = new Configuration();
    configuration.setConfigData(data);

    // when
    const result = configuration.getData('groups.group1', undefined);

    // then
    expect(result.length).to.equal(2);
    expect(result[0].id).to.equal('menu1');
    expect(result[1].id).to.equal('menu2');
  });

  it('getActiveItemFromUrl returns first item matching url', () => {
    // given
    const configuration = new Configuration();
    configuration.setConfigData(data);

    // when
    const result = configuration.getActivePathFromUrl('/some/path/item2.2', ['group1']);

    // then
    expect(result.group).to.equal('group1');
    expect(result.menuId).to.equal('menu2');
    expect(result.itemId).to.equal('item2.2');
  });
});
