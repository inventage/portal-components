import { html, fixture, expect, assert } from '@open-wc/testing';

// noinspection ES6PreferShortImport
import { PortalHamburgerMenu } from '../index.js';
import '../portal-hamburger-menu.js';

describe('<portal-hamburger-menu>', () => {
  describe('Structure', () => {
    it('is defined', () => {
      const el = document.createElement('portal-hamburger-menu');
      assert.instanceOf(el, PortalHamburgerMenu);
    });
  });

  describe('Functionality', () => {
    it('has a default toggled state', async () => {
      const el = await fixture(html`<portal-hamburger-menu></portal-hamburger-menu>`);

      expect(el.toggled).to.equal(false);
    });

    it('can override the "toggled" state via attribute', async () => {
      const el = await fixture(html`<portal-hamburger-menu toggled="1"></portal-hamburger-menu>`);

      expect(el.toggled).to.equal(true);
    });

    it('can override the "toggled" state via property', async () => {
      const el = await fixture(html`<portal-hamburger-menu .toggled="${true}"></portal-hamburger-menu>`);

      expect(el.toggled).to.equal(true);
    });

    it('toggles state on button click', async () => {
      const el = await fixture(html`<portal-hamburger-menu></portal-hamburger-menu>`);
      expect(el.toggled).to.equal(false);

      el.shadowRoot.querySelector('button').click();
      expect(el.toggled).to.equal(true);

      el.shadowRoot.querySelector('button').click();
      expect(el.toggled).to.equal(false);
    });

    it('triggers "state-changed" event when clicked', async () => {
      let counter = 0;
      const el = await fixture(
        html`<portal-hamburger-menu
          @state-changed=${() => {
            counter += 1;
          }}
        ></portal-hamburger-menu>`,
      );

      el.shadowRoot.querySelector('button').click();
      expect(counter).to.equal(1);

      el.shadowRoot.querySelector('button').click();
      expect(counter).to.equal(2);
    });
  });

  describe('Accessibility', () => {
    it('is displayed by default', async () => {
      const el = await fixture(html`<portal-hamburger-menu></portal-hamburger-menu>`);
      expect(el).to.be.displayed;
    });

    it('is hidden when attribute hidden is true', async () => {
      const el = await fixture(html`<portal-hamburger-menu hidden></portal-hamburger-menu>`);
      expect(el).not.to.be.displayed;
    });

    it('passes the a11y audit', async () => {
      const el = await fixture(html`<portal-hamburger-menu></portal-hamburger-menu>`);
      await expect(el).to.be.accessible();
    });
  });
});
