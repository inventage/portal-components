import { css, html, LitElement } from 'lit-element';

/**
 * A test component to display what a component can consist of, how it is documented and how to properly test it.
 *
 * @cssprop {Length} --portal-card-width - Width
 * @cssprop {Color} --portal-card-text-color - Text Color
 * @cssprop {Length} --portal-card-padding - Padding
 * @cssprop {Color} --portal-card-border-color - Border Color
 * @cssprop {Length} --portal-card-border-width - Border Width
 *
 * Useful links:
 *
 * @see https://github.com/runem/web-component-analyzer#-how-to-document-your-components-using-jsdoc
 * @see https://github.com/open-wc/open-wc/tree/master/packages/demoing-storybook/demo
 * @see https://open-wc.org/demoing-storybook/demo/custom-elements.json
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
      }

      :host[hidden] {
        display: none;
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
    };
  }

  constructor() {
    super();
    this.title = 'I am a glorious title';
  }

  render() {
    return html`
      <div class="card">
        <span class="title">${this.title}</span>
        <span class="content">
          <slot></slot>
        </span>
      </div>
    `;
  }
}
