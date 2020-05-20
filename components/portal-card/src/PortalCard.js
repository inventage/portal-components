import { css, html, LitElement } from 'lit-element';

/**
 * A test component to display what a component can consist of, how it is documented and how to properly test it.
 *
 * Useful links:
 *
 * @see https://github.com/runem/web-component-analyzer#-how-to-document-your-components-using-jsdoc
 * @see https://open-wc.org/demoing-storybook
 * @see https://open-wc.org/demoing-storybook/demo/custom-elements.json
 * @see https://github.com/open-wc/open-wc/tree/master/packages/demoing-storybook/demo
 *
 * @cssprop {Length} --portal-card-width - Width
 * @cssprop {Color} --portal-card-text-color - Text Color
 * @cssprop {Length} --portal-card-padding - Padding
 * @cssprop {Color} --portal-card-border-color - Border Color
 * @cssprop {Length} --portal-card-border-width - Border Width
 *
 * @slot - This is an unnamed slot (the default slot)
 *
 * @fires side-changed - Event fired when the card changes sides.
 */
export class PortalCard extends LitElement {
  static get styles() {
    return css`
      :host {
        --portal-card-width: 200px;
        --portal-card-text-color: #000;
        --portal-card-padding: 1rem;
        --portal-card-border-color: #000;
        --portal-card-border-width: 1px;

        display: block;
        width: var(--portal-card-width);
        padding: var(--portal-card-padding);
        color: var(--portal-card-text-color);
        border: var(--portal-card-border-width) solid var(--portal-card-border-color);
        transform-style: preserve-3d;
        transition: all 0.8s ease;
      }

      :host[hidden] {
        display: none;
      }

      :host([back-side]) {
        transform: rotateY(180deg);
      }

      :host > .front,
      :host > .back {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-flow: column;
        backface-visibility: hidden;
        overflow: hidden;
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
      }

      :host > .back {
        text-align: center;
        transform: rotateY(180deg);
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      backSide: { type: Boolean, reflect: true, attribute: 'back-side' },
    };
  }

  constructor() {
    super();
    this.title = 'I am a glorious title';
    this.backSide = false;
  }

  _requestUpdate(name, oldValue) {
    super._requestUpdate(name, oldValue);

    if (name === 'backSide') {
      this.dispatchEvent(new Event('side-changed'));
    }
  }

  toggle() {
    this.backSide = !this.backSide;
  }

  render() {
    return html`
      <div class="front">
        <span class="title">${this.title}</span>
        <span class="content">
          <slot></slot>
        </span>
      </div>
      <div class="back">
        <span class="title">${this.title}</span>
      </div>
    `;
  }
}
