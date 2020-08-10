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

  it('doesnt route internally when default item of menu has different application', async () => {
    // given
    const el = await fixture(
      html`<portal-navigation currentApplication="app2" internalRouting="true"></portal-navigation>`,
    );
    const configuration = new Configuration(['group1', 'group2']);
    configuration.setConfigData(data);
    el.__configuration = configuration;

    // when
    const menu = el.__configuration.getData(['groups', 'group1', `menus::menu2`]);
    const internal = el.__isInternalRouting(menu);

    // then
    expect(internal).to.equal(false);
  });

  it('does route internally when default item of menu has same application', async () => {
    // given
    const el = await fixture(
      html`<portal-navigation currentApplication="app1" internalRouting="true"></portal-navigation>`,
    );
    const configuration = new Configuration(['group1', 'group2']);
    configuration.setConfigData(data);
    el.__configuration = configuration;

    // when
    const menu = el.__configuration.getData(['groups', 'group1', `menus::menu2`]);
    const internal = el.__isInternalRouting(menu);

    // then
    expect(internal).to.equal(true);
  });
});
