import { html, fixture, expect } from '@open-wc/testing';

import '../portal-navigation.js';
import { Configuration } from '../src/Configuration.js';
import { data } from './test-data-json.js';
import { MockEvent } from './MockEvent.js';
import { MockEventListener } from './MockEventListener.js';
import { PortalNavigation } from '../src/PortalNavigation.js';

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

  it('doesnt route internally when default item of menu has different application', async () => {
    // given
    const el = await fixture(html`<portal-navigation currentApplication="app2" internalRouting></portal-navigation>`);
    el.__configuration = new Configuration(data);

    // when
    const menu = el.__configuration.getData(['groups', 'group1', `items::menu2`]);
    const internal = el.__isInternalRouting(menu);

    // then
    expect(internal).to.equal(false);
  });

  it('does route internally when default item of menu has same application', async () => {
    // given
    const el = await fixture(html`<portal-navigation currentApplication="app1" internalRouting></portal-navigation>`);
    el.__configuration = new Configuration(data);

    // when
    const menu = el.__configuration.getData(['groups', 'group1', `items::menu2`]);
    const internal = el.__isInternalRouting(menu);

    // then
    expect(internal).to.equal(true);
  });

  it('does route externally when default item of menu has other application', async () => {
    // given
    const el = await fixture(html`<portal-navigation currentApplication="app1" internalRouting></portal-navigation>`);
    el.__configuration = new Configuration(data);

    // when
    const menu = el.__configuration.getData(['groups', 'group2', `items::menu3`]);
    const internal = el.__isInternalRouting(menu);

    // then
    expect(internal).to.equal(false);
  });

  it('does route externally when default item of menu has other application, and does not call e.preventDefault()', async () => {
    // given
    const el = await fixture(html`<portal-navigation currentApplication="app1" internalRouting></portal-navigation>`);
    el.__configuration = new Configuration(data);

    const e = new MockEvent();

    // when
    const menu = el.__configuration.getData(['groups', 'group2', `items::menu3`]);
    el.__onLink(e, 'group2', menu);

    // then
    expect(e.count).to.equal(0);
    expect(el.activePath.groupId).to.equal('group2');
    expect(el.activePath.menuId).to.equal('menu3');
    expect(el.activePath.itemId).to.equal('item3.1');
  });

  it('does route internally when default item of menu has same application, and does call e.preventDefault()', async () => {
    // given
    const el = await fixture(html`<portal-navigation currentApplication="app1" internalRouting></portal-navigation>`);
    el.__configuration = new Configuration(data);

    const listener = new MockEventListener();
    el.addEventListener(PortalNavigation.events.routeTo, listener.create());

    const e = new MockEvent();

    // when
    const menu = el.__configuration.getData(['groups', 'group1', `items::menu2`]);
    el.__onLink(e, 'group1', menu);

    // then
    expect(e.count).to.equal(1);
    expect(el.activePath.groupId).to.equal('group1');
    expect(el.activePath.menuId).to.equal('menu2');
    expect(el.activePath.itemId).to.equal('item2.2');
    expect(listener.count).to.equal(1);
    expect(listener.e.detail.url).to.equal('/some/path/item2.2');
  });

  it('sets corresponding activePath when activeUrl is set', async () => {
    // given
    const el = await fixture(html`<portal-navigation></portal-navigation>`);
    el.__configuration = new Configuration(data);

    // when
    el.activeUrl = '/some/path/item3.2';

    // then
    expect(el.activePath.groupId).to.eq('group2');
    expect(el.activePath.menuId).to.eq('menu3');
    expect(el.activePath.itemId).to.eq('item3.2');
  });

  it('does route externally when item overrides globally set internalRouting=true with false.', async () => {
    // given
    const el = await fixture(html`<portal-navigation currentApplication="app2" internalRouting></portal-navigation>`);
    el.__configuration = new Configuration(data);

    // when
    const item = el.__configuration.getData(['groups', 'group2', 'items::menu3', 'items::item3.2']);
    const internal = el.__isInternalRouting(item);

    // then
    expect(internal).to.equal(false);
  });

  it('does route externally when item overrides globally set internalRouting=true with false, and does not call e.preventDefault()', async () => {
    // given
    const el = await fixture(html`<portal-navigation currentApplication="app2" internalRouting></portal-navigation>`);
    el.__configuration = new Configuration(data);

    const e = new MockEvent();

    // when
    const menu = el.__configuration.getData(['groups', 'group2', 'items::menu3']);
    const item = el.__configuration.getData(['groups', 'group2', 'items::menu3', 'items::item3.2']);
    el.__onLink(e, 'group2', menu, item);

    // then
    expect(menu).not.to.be.undefined;
    expect(item).not.to.be.undefined;
    expect(menu.id).to.equal('menu3');
    expect(item.id).to.equal('item3.2');
    expect(e.count).to.equal(0);
  });

  it('does ignore default item when destination is "extern" on menu clicks, and does call e.preventDefault()', async () => {
    // given
    const el = await fixture(html`<portal-navigation internalRouting></portal-navigation>`);
    el.__configuration = new Configuration(data);

    const listener = new MockEventListener();
    el.addEventListener(PortalNavigation.events.routeTo, listener.create());

    const e = new MockEvent();

    // when
    const menu = el.__configuration.getData(['groups', 'group3', 'items::menu5']);
    el.__onLink(e, 'group3', menu);

    // then
    expect(menu).not.to.be.undefined;
    expect(menu.id).to.equal('menu5');
    expect(e.count).to.equal(1);
    expect(el.activePath.itemId).to.be.undefined;
    expect(el.activePath.menuId).to.equal('menu5');
    expect(listener.count).to.equal(0);
  });
});
