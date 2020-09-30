import { css, html, LitElement, property } from 'lit-element';
import { baseStyles } from '../../helpers/baseStyles';
import { PropertyDeclaration } from 'lit-element/lib/updating-element';

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
 * @cssprop {Length} --portal-card-height - Height
 * @cssprop {Color} --portal-card-text-color - Text Color
 * @cssprop {Length} --portal-card-padding - Padding
 * @cssprop {String} --portal-card-border - Border
 * @cssprop {String} --portal-card-border-radius - Border Radius
 * @cssprop {Length} --portal-card-margin - Margin
 *
 * @slot - This is an unnamed slot (the default slot)
 *
 * @fires 'side-changed' - Event fired when the card changes sides.
 */
export class PortalCard extends LitElement {

  @property()
  title = 'I am a glorious title';

  @property({
    type: Boolean,
    attribute: 'back-side',
    reflect: true
  })
  backSide = false;

  static get styles() {
    return [
      baseStyles,
      css`
        :host {
          --portal-card-width: 200px;
          --portal-card-height: 200px;
          --portal-card-text-color: #000;
          --portal-card-padding: 1rem;
          --portal-card-border: 1px solid rgba(0, 0, 0, 0.1);
          --portal-card-border-radius: 0.5rem;
          --portal-card-margin: 1rem;

          margin: var(--portal-card-margin);
          width: var(--portal-card-width);
          min-height: var(--portal-card-height);
          padding: var(--portal-card-padding);
          color: var(--portal-card-text-color);
          border: var(--portal-card-border);
          border-radius: var(--portal-card-border-radius);
          box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.15);
          transform-style: preserve-3d;
          transition: all 0.5s ease-in-out;
          font-family: sans-serif;
        }

        :host([back-side]) {
          transform: rotateY(180deg);
        }

        .front,
        .back {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          display: flex;
          flex-flow: column;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
          border-radius: var(--portal-card-border-radius);
        }

        .back {
          text-align: right;
          transform: rotateY(180deg);
        }

        .footer {
          display: flex;
          padding: 10px;
        }

        .footer.-reverse {
          text-align: left;
        }

        .side {
          font-weight: bold;
          flex-grow: 1;
        }

        .content {
          padding: 10px;
          flex-grow: 1;
        }

        .title {
          padding: 10px;
          background: #004996;
          color: white;
        }
      `,
    ];
  }

  requestUpdateInternal(name?: PropertyKey, oldValue?: unknown, options?: PropertyDeclaration) {
    super.requestUpdateInternal(name, oldValue, options);

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
        <div class="footer">
          <div class="side">A</div>
          <button @click=${this.toggle}>→</button>
        </div>
      </div>
      <div class="back">
        <span class="title">${this.title}</span>
        <span class="content"></span>
        <div class="footer -reverse">
          <div class="side">B</div>
          <button @click="${this.toggle}">→</button>
        </div>
      </div>
    `;
  }
}
