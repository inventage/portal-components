import { html, fixture, expect } from '@open-wc/testing';

import '../portal-card.js';

describe('PortalCard', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture(html` <portal-card></portal-card> `);

    expect(el.title).to.equal('I am a glorious title');
  });

  it('can override the title via attribute', async () => {
    const el = await fixture(html` <portal-card title="attribute title"></portal-card> `);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture(html` <portal-card></portal-card> `);

    await expect(el).shadowDom.to.be.accessible();
  });
});
