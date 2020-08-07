import { html, fixture, expect } from '@open-wc/testing';

import '../portal-navigation.js';

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
