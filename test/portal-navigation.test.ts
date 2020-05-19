import { html, fixture, expect } from '@open-wc/testing';

import {PortalNavigation} from '../src/PortalNavigation.js';
import '../portal-navigation.js';

describe('PortalNavigation', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el: PortalNavigation = await fixture(html`
      <portal-navigation></portal-navigation>
    `);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el: PortalNavigation = await fixture(html`
      <portal-navigation></portal-navigation>
    `);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el: PortalNavigation = await fixture(html`
      <portal-navigation title="attribute title"></portal-navigation>
    `);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el: PortalNavigation = await fixture(html`
      <portal-navigation></portal-navigation>
    `);

    await expect(el).shadowDom.to.be.accessible();
  });
});
