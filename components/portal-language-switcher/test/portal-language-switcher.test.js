import { html, fixture, expect } from '@open-wc/testing';

import '../portal-language-switcher.js';

describe('PortalLanguageSwitcher', () => {
  it('has a default title "Hai there" and language de', async () => {
    const el = await fixture(html` <portal-language-switcher></portal-language-switcher> `);

    expect(el.title).to.equal('Hai there');
    expect(el.language).to.equal('de');
  });

  it('switches the language on button click', async () => {
    const el = await fixture(html` <portal-language-switcher></portal-language-switcher> `);
    el.shadowRoot.querySelector('button').click();

    expect(el.language).to.equal('en');

    // Comment out for coverage fail test…
    el.shadowRoot.querySelector('button').click();
    expect(el.language).to.equal('de');
  });

  it('can override the title via attribute', async () => {
    const el = await fixture(html` <portal-language-switcher title="attribute title"></portal-language-switcher> `);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture(html` <portal-language-switcher></portal-language-switcher> `);

    await expect(el).shadowDom.to.be.accessible();
  });
});
