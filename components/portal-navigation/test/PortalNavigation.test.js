import { html, fixture, expect } from '@open-wc/testing';

import '../portal-navigation.js';
import { PortalNavigation } from '../src/PortalNavigation.js';
import { Configuration } from '../src/Configuration.js';
import { data } from './test-data-json.js';
import { MockEvent } from './MockEvent.js';
import { MockEventListener } from './MockEventListener.js';

describe('<portal-navigation>', () => {
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

  it('doesnt route internally when default item of parent item has different application', async () => {
    // given
    const el = await fixture(html`<portal-navigation currentApplication="app2" internalRouting></portal-navigation>`);
    el.configuration = new Configuration(data);

    // when
    const item = el.configuration.getData(['menus::menu1', `items::parent2`]);
    const internal = el._isInternalRouting(item);

    // then
    expect(internal).to.equal(false);
  });

  it('does route internally when default item of parent item has same application', async () => {
    // given
    const el = await fixture(html`<portal-navigation currentApplication="app1" internalRouting></portal-navigation>`);
    el.configuration = new Configuration(data);

    // when
    const parent = el.configuration.getData(['menus::menu1', `items::parent2`]);
    const internal = el._isInternalRouting(parent);

    // then
    expect(internal).to.equal(true);
  });

  it('does route externally when default item of parent item has other application', async () => {
    // given
    const el = await fixture(html`<portal-navigation currentApplication="app1" internalRouting></portal-navigation>`);
    el.configuration = new Configuration(data);

    // when
    const parent = el.configuration.getData(['menus::menu2', `items::parent3`]);
    const internal = el._isInternalRouting(parent);

    // then
    expect(internal).to.equal(false);
  });

  it('does route externally when default item of parent item has other application, and does not call e.preventDefault()', async () => {
    // given
    const el = await fixture(html`<portal-navigation currentApplication="app1" internalRouting></portal-navigation>`);
    el.configuration = new Configuration(data);

    const e = new MockEvent();

    // when
    const parent = el.configuration.getData(['menus::menu2', `items::parent3`]);
    el._onLink(e, parent);

    // then
    expect(e.count).to.equal(0);
    expect(el.activePath.getMenuId()).to.equal('menu2');
    expect(el.activePath.getFirstLevelItemId()).to.equal('parent3');
    expect(el.activePath.getId(2)).to.equal('item3.1');
  });

  it('does route internally when default item of parent item has same application, and does call e.preventDefault()', async () => {
    // given
    const el = await fixture(html`<portal-navigation currentApplication="app1" internalRouting></portal-navigation>`);
    el.configuration = new Configuration(data);

    const listener = new MockEventListener();
    el.addEventListener(PortalNavigation.events.routeTo, listener.create());

    const e = new MockEvent();

    // when
    const parent = el.configuration.getData(['menus::menu1', `items::parent2`]);
    el._onLink(e, parent);

    // then
    expect(e.count).to.equal(1);
    expect(el.activePath.getMenuId()).to.equal('menu1');
    expect(el.activePath.getFirstLevelItemId()).to.equal('parent2');
    expect(el.activePath.getId(2)).to.equal('item2.2');
    expect(listener.count).to.equal(1);
    expect(listener.e.detail.url).to.equal('/some/path/item2.2');
  });

  it('sets corresponding activePath when activeUrl is set', async () => {
    // given
    const el = await fixture(html`<portal-navigation></portal-navigation>`);
    el.configuration = new Configuration(data);

    // when
    el.activeUrl = '/some/path/item3.2';

    // then
    expect(el.activePath.getMenuId()).to.eq('menu2');
    expect(el.activePath.getFirstLevelItemId()).to.eq('parent3');
    expect(el.activePath.getId(2)).to.eq('item3.2');
  });

  it('does route externally when item overrides globally set internalRouting=true with false.', async () => {
    // given
    const el = await fixture(html`<portal-navigation currentApplication="app2" internalRouting></portal-navigation>`);
    el.configuration = new Configuration(data);

    // when
    const item = el.configuration.getData(['menus::menu2', 'items::parent3', 'items::item3.2']);
    const internal = el._isInternalRouting(item);

    // then
    expect(internal).to.equal(false);
  });

  it('does route externally when item overrides globally set internalRouting=true with false, and does not call e.preventDefault()', async () => {
    // given
    const el = await fixture(html`<portal-navigation currentApplication="app2" internalRouting></portal-navigation>`);
    el.configuration = new Configuration(data);

    const e = new MockEvent();

    // when
    const parent = el.configuration.getData(['menus::menu2', 'items::parent3']);
    const item = el.configuration.getData(['menus::menu2', 'items::parent3', 'items::item3.2']);
    el._onLink(e, item);

    // then
    expect(parent).not.to.be.undefined;
    expect(item).not.to.be.undefined;
    expect(parent.id).to.equal('parent3');
    expect(item.id).to.equal('item3.2');
    expect(e.count).to.equal(0);
  });

  it('does ignore default item when destination is "extern" on parent item clicks, and does call e.preventDefault()', async () => {
    // given
    const el = await fixture(html`<portal-navigation internalRouting></portal-navigation>`);
    el.configuration = new Configuration(data);

    const listener = new MockEventListener();
    el.addEventListener(PortalNavigation.events.routeTo, listener.create());

    const e = new MockEvent();

    // when
    const parent = el.configuration.getData(['menus::menu3', 'items::parent5']);
    el._onLink(e, parent);

    // then
    expect(parent).not.to.be.undefined;
    expect(parent.id).to.equal('parent5');
    expect(e.count).to.equal(1);
    expect(el.activePath.getId(2)).to.be.undefined;
    expect(el.activePath.getFirstLevelItemId()).to.equal('parent5');
    expect(listener.count).to.equal(0);
  });
});
