import { aTimeout, expect, fixture, html, oneEvent, waitUntil, elementUpdated } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import sinon from 'sinon';

import '../portal-navigation';
import { PortalNavigation } from '../src/PortalNavigation';
import { Configuration, ConfigurationData, MenuItem, MenuLabel } from '../src/Configuration';
import { data } from './test-data-json';
import { MockEvent } from './MockEvent';
import { MockEventListener } from './MockEventListener';

/**
 * @deprecated Use test-data.json instead
 */
const configurationData = data as ConfigurationData;

const TEST_DATA_JSON_PATH = '/components/portal-navigation/test/test-data.json';

/**
 * Helper function that waits until the portal navigation children have been rendered.
 *
 * @param el
 * @param selector
 * @see https://open-wc.org/docs/testing/helpers/#waituntil
 */
const childrenRendered = async (el: HTMLElement, selector = '[part="item-parent2"]') => {
  await waitUntil(() => !!el.shadowRoot?.querySelector(selector), 'Element did not render children');
};

beforeEach(async () => {
  await setViewport({ width: 1200, height: 800 });
});

/**
 * @see https://open-wc.org/testing/testing-helpers.html
 */
describe('<portal-navigation>', () => {
  describe('Display', () => {
    it('is empty by default', async () => {
      const el: PortalNavigation = await fixture(html` <portal-navigation></portal-navigation>`);
      expect(el.shadowRoot!.innerHTML).to.equal('<!----><!---->');
    });

    it('is displayed by default', async () => {
      const el: PortalNavigation = await fixture(html` <portal-navigation src="${TEST_DATA_JSON_PATH}"></portal-navigation>`);
      expect(el).to.be.displayed;
    });
    //
    it('is hidden when attribute hidden is true', async () => {
      const el: PortalNavigation = await fixture(html` <portal-navigation src="${TEST_DATA_JSON_PATH}" hidden></portal-navigation>`);
      expect(el).not.to.be.displayed;
    });

    it('passes the a11y audit', async () => {
      const el: PortalNavigation = await fixture(html` <portal-navigation src="${TEST_DATA_JSON_PATH}"></portal-navigation>`);
      // await navigationRendered(el);
      await expect(el).to.be.accessible();
    });
  });

  it('returns sorted array of known menu ids', () => {
    expect(PortalNavigation.menuIdsOrdered).to.deep.equal(['main', 'settings', 'meta', 'profile', 'logout']);
  });

  it('sets corresponding activePath when activeUrl is set', async () => {
    const el: PortalNavigation = await fixture(html` <portal-navigation src="${TEST_DATA_JSON_PATH}"></portal-navigation>`);

    el.activeUrl = '/some/path/item3.2';
    await childrenRendered(el, '[part="item-item3.2"]');

    expect(el.getActivePath().getMenuId()).to.eq('meta');
    expect(el.getActivePath().getFirstLevelItemId()).to.eq('parent3');
    expect(el.getActivePath().getId(2)).to.eq('item3.2');
  });

  describe('Routing', () => {
    it.skip('sets activeUrl from current window location', async () => {
      // Cannot implement this yet since we cannot mock window.location in tests
    });

    it('doesnt route internally when default item of parent item has different application', async () => {
      const el: PortalNavigation = await fixture(html`<portal-navigation src="${TEST_DATA_JSON_PATH}" currentApplication="app2" internalRouting></portal-navigation>`);
      await childrenRendered(el);

      // Menu item from app1, should navigate externally
      const menuItem = <HTMLAnchorElement>el.shadowRoot!.querySelector('[part="item-parent2"]');

      // If the event does not get prevented in the component, we would navigate away from the page…
      let externalNavigationOccurred = false;
      menuItem.addEventListener('click', (e: Event) => {
        e.preventDefault();
        externalNavigationOccurred = true;
      });

      // Click menu item here
      setTimeout(() => menuItem.click());
      await aTimeout(1); // Needed, otherwise the click event hasn't occurred yet…

      expect(externalNavigationOccurred).to.be.true;
    });

    it.skip('does route internally when default item of parent item has same application', async () => {
      const el: PortalNavigation = await fixture(html`<portal-navigation src="${TEST_DATA_JSON_PATH}" currentApplication="app1" internalRouting></portal-navigation>`);
      await childrenRendered(el);

      const item = <HTMLAnchorElement>el.shadowRoot!.querySelector('[part="item-parent2"]');
      item.addEventListener('click', (e: Event) => {
        console.log('clicked…', e);
      });
      setTimeout(() => item.click());
      await aTimeout(1);
      const { detail } = await oneEvent(el, 'portal-navigation.routeTo');

      expect(detail.url).to.equal('/some/path/item2.1');
    });

    it('does route externally when default item of parent item has other application', async () => {
      // given
      const el: PortalNavigation = await fixture(html`<portal-navigation currentApplication="app1" internalRouting></portal-navigation>`);
      el.setConfiguration(new Configuration(configurationData));
      await elementUpdated(el);

      // when
      const parent = el.getConfiguration().getData(['menus::menu2', 'items::parent3']);
      const internal = el.isInternalRouting(<MenuItem>parent);

      // then
      expect(internal).to.equal(false);
    });

    it.skip('does route externally when default item of parent item has other application', async () => {
      const el: PortalNavigation = await fixture(html`<portal-navigation src="${TEST_DATA_JSON_PATH}" currentApplication="app1" internalRouting></portal-navigation>`);
      await childrenRendered(el, '[part="parent3"]');

      const e = new MockEvent();

      // when
      const parent = el.getConfiguration().getData(['menus::meta', 'items::parent3']);
      el._onLink(<Event>(e as unknown), <MenuItem>parent);

      // then
      expect(e.count).to.equal(0);
      expect(el.getActivePath().getMenuId()).to.equal('meta');
      expect(el.getActivePath().getFirstLevelItemId()).to.equal('parent3');
      expect(el.getActivePath().getId(2)).to.equal('item3.1');
    });

    it('does route internally when default item of parent item has same application', async () => {
      const eventSpy = sinon.spy();
      const el: PortalNavigation = await fixture(html`<portal-navigation src="${TEST_DATA_JSON_PATH}" currentApplication="app1" internalRouting @portal-navigation.routeTo="${eventSpy as EventListener}"></portal-navigation>`);
      await childrenRendered(el);

      // @see https://open-wc.org/docs/testing/helpers/#testing-events
      setTimeout(() => (<HTMLAnchorElement>el.shadowRoot!.querySelector('[part="item-parent2"]')).click());
      const { detail } = await oneEvent(el, 'portal-navigation.routeTo');

      expect(eventSpy.callCount).to.equal(1);
      expect(detail.url).to.equal('/some/path/item2.2');
      expect(el.getActivePath().getMenuId()).to.equal('main');
      expect(el.getActivePath().getFirstLevelItemId()).to.equal('parent2');
      expect(el.getActivePath().getId(2)).to.equal('item2.2');
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

    it('dispatches the "routeTo" event', async () => {
      const el: PortalNavigation = await fixture(html`<portal-navigation src="${TEST_DATA_JSON_PATH}" internalrouting currentapplication="app2"></portal-navigation>`);
      await childrenRendered(el, '[part="item-parent3"]');

      // @see https://open-wc.org/docs/testing/helpers/#testing-events
      setTimeout(() => (<HTMLAnchorElement>el.shadowRoot!.querySelector('[part="item-parent3"]')).click());
      const { detail } = await oneEvent(el, 'portal-navigation.routeTo');

      expect(detail.url).to.equal('/some/path/item3.1');
      expect(detail.label).to.deep.equal({
        de: 'Item 3.1_de',
        en: 'Item 3.1_en',
      });
    });
  });

  it('dispatches the "configured" event', async () => {
    const eventSpy = sinon.spy();
    const el: PortalNavigation = await fixture(html`<portal-navigation src="${TEST_DATA_JSON_PATH}" @portal-navigation.configured="${eventSpy as EventListener}"></portal-navigation>`);
    await oneEvent(el, 'portal-navigation.configured');
    expect(eventSpy.callCount).to.equal(1);
  });

  it('each item has a `part` attribute corresponding to its id', async () => {
    const el: PortalNavigation = await fixture(html` <portal-navigation src="${TEST_DATA_JSON_PATH}" internalrouting currentapplication="app1"></portal-navigation>`);
    await childrenRendered(el);

    // Set parent2 as "active" item (should default to its child…)
    const clickMenuItem = () => (<HTMLAnchorElement>el.shadowRoot!.querySelector('[part="item-parent2"]')!).click();
    setTimeout(clickMenuItem);
    await aTimeout(10); // Not needed, only here so the TS compiler does not complain about an unused import…

    // Assets part attributes
    expect(el.shadowRoot!.querySelector('[part="item-parent1"]'), 'part="item-parent1" should be present').not.to.equal(null);
    expect(el.shadowRoot!.querySelector('[part="item-parent2"]'), 'part="item-parent2" should be present').not.to.equal(null);
    expect(el.shadowRoot!.querySelector('[part="item-item2.1"]'), 'part="item-item2.1" should be present').not.to.equal(null);
    expect(el.shadowRoot!.querySelector('[part="item-item2.2"]'), 'part="item-item2.2" should be present').not.to.equal(null);
  });

  it('sets badge for a given menu item', async () => {
    const badgeLabel: MenuLabel = { en: 'new', de: 'neu' };
    const el: PortalNavigation = await fixture(
      html` <portal-navigation
        src="${TEST_DATA_JSON_PATH}"
        @portal-navigation.configured="${() => {
          document.dispatchEvent(
            new CustomEvent(PortalNavigation.events.setBadgeValue, {
              detail: {
                id: 'parent2',
                value: badgeLabel,
              },
            }),
          );
        }}"
      ></portal-navigation>`,
    );
    await childrenRendered(el);

    expect(el.getTemporaryBadgeValues().get('parent2')).equals(badgeLabel);
    expect(el.shadowRoot!.querySelector('[part="badge-parent2"]')).not.to.equal(null);
  });

  it('dispatches the "setLanguage" event', async () => {
    const eventSpy = sinon.spy();
    const el: PortalNavigation = await fixture(html` <portal-navigation language="de" @portal-navigation.setLanguage="${eventSpy as EventListener}"></portal-navigation>`);

    // Should trow an event initially…
    expect(eventSpy.callCount).to.equal(1);

    el.language = 'en';
    const { detail } = await oneEvent(el, 'portal-navigation.setLanguage');

    // After changing the language again, the callCount should be increased once more…
    expect(eventSpy.callCount).to.equal(2);
    expect(detail).to.equal('en');
  });
});
