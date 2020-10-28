import { expect, fixture, html } from '@open-wc/testing';

import '../portal-navigation';
import { PortalNavigation } from '../src/PortalNavigation';
import { Configuration, ConfigurationData, MenuItem, MenuLabel } from '../src/Configuration';
import { data } from './test-data-json';
import { MockEvent } from './MockEvent';
import { MockEventListener } from './MockEventListener';

const configurationData = data as ConfigurationData;

describe('<portal-navigation>', () => {
  // it('is empty by default', async () => {
  //   const el: PortalNavigation = await fixture(html`<portal-navigation></portal-navigation>`);
  //   expect(el.shadowRoot!.innerHTML).to.equal('<!----><!---->');
  // });

  it('is displayed by default', async () => {
    const el: PortalNavigation = await fixture(html`<portal-navigation></portal-navigation>`);
    expect(el).to.be.displayed;
  });

  it('is hidden when attribute hidden is true', async () => {
    const el: PortalNavigation = await fixture(html`<portal-navigation hidden></portal-navigation>`);
    expect(el).not.to.be.displayed;
  });

  it('passes the a11y audit', async () => {
    const el: PortalNavigation = await fixture(html`<portal-navigation></portal-navigation>`);
    await expect(el).to.be.accessible();
  });

  it('doesnt route internally when default item of parent item has different application', async () => {
    // given
    const el: PortalNavigation = await fixture(html`<portal-navigation currentApplication="app2" internalRouting></portal-navigation>`);
    el.setConfiguration(new Configuration(configurationData));

    // when
    const item = el.getConfiguration().getData(['menus::menu1', `items::parent2`]);
    const internal = el.isInternalRouting(<MenuItem>item);

    // then
    expect(internal).to.equal(false);
  });

  it('does route internally when default item of parent item has same application', async () => {
    // given
    const el: PortalNavigation = await fixture(html`<portal-navigation currentApplication="app1" internalRouting></portal-navigation>`);
    el.setConfiguration(new Configuration(configurationData));

    // when
    const parent = el.getConfiguration().getData(['menus::menu1', `items::parent2`]);
    const internal = el.isInternalRouting(<MenuItem>parent);

    // then
    expect(internal).to.equal(true);
  });

  it('does route externally when default item of parent item has other application', async () => {
    // given
    const el: PortalNavigation = await fixture(html`<portal-navigation currentApplication="app1" internalRouting></portal-navigation>`);
    el.setConfiguration(new Configuration(configurationData));

    // when
    const parent = el.getConfiguration().getData(['menus::menu2', `items::parent3`]);
    const internal = el.isInternalRouting(<MenuItem>parent);

    // then
    expect(internal).to.equal(false);
  });

  it('does route externally when default item of parent item has other application, and does not call e.preventDefault()', async () => {
    // given
    const el: PortalNavigation = await fixture(html`<portal-navigation currentApplication="app1" internalRouting></portal-navigation>`);
    el.setConfiguration(new Configuration(configurationData));

    const e = new MockEvent();

    // when
    const parent = el.getConfiguration().getData(['menus::menu2', `items::parent3`]);
    el._onLink(<Event>(e as unknown), <MenuItem>parent);

    // then
    expect(e.count).to.equal(0);
    expect(el.getActivePath().getMenuId()).to.equal('menu2');
    expect(el.getActivePath().getFirstLevelItemId()).to.equal('parent3');
    expect(el.getActivePath().getId(2)).to.equal('item3.1');
  });

  it('does route internally when default item of parent item has same application, and does call e.preventDefault()', async () => {
    // given
    const el: PortalNavigation = await fixture(html`<portal-navigation currentApplication="app1" internalRouting></portal-navigation>`);
    el.setConfiguration(new Configuration(configurationData));

    const listener = new MockEventListener();
    el.addEventListener(PortalNavigation.events.routeTo, listener.create());

    const e = new MockEvent();

    // when
    const parent = el.getConfiguration().getData(['menus::menu1', `items::parent2`]);
    el._onLink(<Event>(e as unknown), <MenuItem>parent);

    // then
    expect(e.count).to.equal(1);
    expect(el.getActivePath().getMenuId()).to.equal('menu1');
    expect(el.getActivePath().getFirstLevelItemId()).to.equal('parent2');
    expect(el.getActivePath().getId(2)).to.equal('item2.2');
    expect(listener.count).to.equal(1);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(listener.e.detail.url).to.equal('/some/path/item2.2');
  });

  it('sets corresponding activePath when activeUrl is set', async () => {
    // given
    const el: PortalNavigation = await fixture(html`<portal-navigation></portal-navigation>`);
    el.setConfiguration(new Configuration(configurationData));

    // when
    el.activeUrl = '/some/path/item3.2';

    // then
    expect(el.getActivePath().getMenuId()).to.eq('menu2');
    expect(el.getActivePath().getFirstLevelItemId()).to.eq('parent3');
    expect(el.getActivePath().getId(2)).to.eq('item3.2');
  });

  it('does route externally when item overrides globally set internalRouting=true with false.', async () => {
    // given
    const el: PortalNavigation = await fixture(html`<portal-navigation currentApplication="app2" internalRouting></portal-navigation>`);
    el.setConfiguration(new Configuration(configurationData));

    // when
    const item = el.getConfiguration().getData(['menus::menu2', 'items::parent3', 'items::item3.2']);
    const internal = el.isInternalRouting(<MenuItem>item);

    // then
    expect(internal).to.equal(false);
  });

  it('does route externally when item overrides globally set internalRouting=true with false, and does not call e.preventDefault()', async () => {
    // given
    const el: PortalNavigation = await fixture(html`<portal-navigation currentApplication="app2" internalRouting></portal-navigation>`);
    el.setConfiguration(new Configuration(configurationData));

    const e = new MockEvent();

    // when
    const parent = <MenuItem>el.getConfiguration().getData(['menus::menu2', 'items::parent3']);
    const item = <MenuItem>el.getConfiguration().getData(['menus::menu2', 'items::parent3', 'items::item3.2']);
    el._onLink(<Event>(e as unknown), item);

    // then
    expect(parent).not.to.be.undefined;
    expect(item).not.to.be.undefined;
    expect(parent.id).to.equal('parent3');
    expect(item.id).to.equal('item3.2');
    expect(e.count).to.equal(0);
  });

  it('does ignore default item when destination is "extern" on parent item clicks, and does call e.preventDefault()', async () => {
    // given
    const el: PortalNavigation = await fixture(html`<portal-navigation internalRouting></portal-navigation>`);
    el.setConfiguration(new Configuration(configurationData));

    const listener = new MockEventListener();
    el.addEventListener(PortalNavigation.events.routeTo, listener.create());

    const e = new MockEvent();

    // when
    const parent = <MenuItem>el.getConfiguration().getData(['menus::menu3', 'items::parent5']);
    el._onLink(<Event>(e as unknown), parent);

    // then
    expect(parent).not.to.be.undefined;
    expect(parent.id).to.equal('parent5');
    expect(e.count).to.equal(1);
    expect(el.getActivePath().getId(2)).to.be.undefined;
    expect(el.getActivePath().getFirstLevelItemId()).to.equal('parent5');
    expect(listener.count).to.equal(0);
  });

  it('sets badge for a given menu item', async () => {
    const el: PortalNavigation = await fixture(html`<portal-navigation></portal-navigation>`);
    el.setConfiguration(new Configuration(configurationData));

    const badgeLabel: MenuLabel = { en: 'new', de: 'neu' };

    document.dispatchEvent(
      new CustomEvent(PortalNavigation.events.setBadgeValue, {
        detail: {
          id: 'parent2',
          value: badgeLabel,
        },
      }),
    );

    expect(el.getTemporaryBadgeValues().get('parent2')).equals(badgeLabel);

    // TODO: Does not work since the component does not seem to be rendered properly…
    // TODO: Adapt tests so we really test how the component works in the browser
    //       - use attributes / public properties properly
    //const badge = el.shadowRoot!.querySelector('[part="parent2-badge"]');
    //console.log(el.shadowRoot!.innerHTML);
    //expect(badge).not.to.equal(null);
  });
});
