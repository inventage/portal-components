import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';

import '../portal-card.js';

describe('<portal-card>', () => {
  it('has a default title "I am a glorious title', async () => {
    const el = await fixture(html`<portal-card></portal-card>`);

    expect(el.title).to.equal('I am a glorious title');
  });

  it('can override the title via attribute', async () => {
    const el = await fixture(html`<portal-card title="attribute title"></portal-card>`);

    expect(el.title).to.equal('attribute title');
  });

  it('can override the title via property', async () => {
    const el = await fixture(html`<portal-card .title=${'property title'}></portal-card>`);

    expect(el.title).to.equal('property title');
  });

  it('toggles side on button click', async () => {
    const el = await fixture(html`<portal-card></portal-card>`);
    expect(el.backSide).to.equal(false);

    el.shadowRoot.querySelector('button').click();
    expect(el.backSide).to.equal(true);

    el.shadowRoot.querySelector('button').click();
    expect(el.backSide).to.equal(false);
  });

  it('triggers "side-changed" event when sides change', async () => {
    const changedSpy = sinon.spy();
    const el = await fixture(html`<portal-card @side-changed="${changedSpy}"></portal-card>`);

    el.shadowRoot.querySelector('button').click();
    expect(changedSpy.callCount).to.equal(1);

    el.shadowRoot.querySelector('button').click();
    expect(changedSpy.callCount).to.equal(2);
  });

  it('is displayed by default', async () => {
    const el = await fixture(html`<portal-card></portal-card>`);
    expect(el).to.be.displayed;
  });

  it('is hidden when attribute hidden is true', async () => {
    const el = await fixture(html`<portal-card hidden></portal-card>`);
    expect(el).not.to.be.displayed;
  });

  it('displays default slot elements', async () => {
    const el = await fixture(html`
      <portal-card>
        <p>Hello world…</p>
        <span>Foo, bar!</span>
      </portal-card>
    `);

    // Get default slot as well as all assigned element nodes
    const defaultSlot = el.shadowRoot.querySelector('slot');
    const slotNodes = defaultSlot.assignedNodes().filter(node => node.nodeType === Node.ELEMENT_NODE);

    expect(slotNodes.length).to.equal(2);
    expect(slotNodes[0].tagName).to.equal('P');
    expect(slotNodes[0].textContent).to.equal('Hello world…');
    expect(slotNodes[1].tagName).to.equal('SPAN');
    expect(slotNodes[1].textContent).to.equal('Foo, bar!');
  });

  /**
   * Automated accessibility tests via axe.
   *
   * @see https://open-wc.org/testing/testing-chai-a11y-axe.html
   */
  it('passes the a11y audit', async () => {
    const el = await fixture(html`<portal-card></portal-card>`);
    await expect(el).to.be.accessible();
  });
});
