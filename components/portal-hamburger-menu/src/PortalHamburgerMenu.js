import { html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { baseStyles } from '../../helpers/baseStyles.js';
import { styles as hamburgerMenuStyles } from './portalHamburgerMenuStyles.js';

/**
 * A simple hamburger menu component.
 *
 * @fires 'state-changed' - Event fired when the hamburger menu state changes.
 *
 * @prop {Boolean} toggled - Reflects the toggled state.
 *
 * @cssprop {Length} [--hamburger-padding-x=3px]
 * @cssprop {Length} [--hamburger-padding-y=10px]
 * @cssprop {Length} [--hamburger-layer-width=26px]
 * @cssprop {Length} [--hamburger-layer-height=2px]
 * @cssprop {Length} [--hamburger-layer-spacing=4px]
 * @cssprop {Color} [--hamburger-layer-color=black]
 * @cssprop {Length} [--hamburger-layer-border-radius=0]
 * @cssprop {Length} [--hamburger-hover-opacity=1]
 * @cssprop {Length} [--hamburger-hover-transition-duration=0.15s]
 * @cssprop {Length} [--hamburger-hover-transition-timing-function=linear]
 */
// @ts-ignore
export class PortalHamburgerMenu extends LitElement {
  static get styles() {
    return [baseStyles, hamburgerMenuStyles];
  }

  static get properties() {
    return {
      toggled: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();

    /**
     * @type {boolean}
     */
    this.toggled = false;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Workaround for listening on property changes…
   *
   * @see https://github.com/Polymer/lit-element/issues/643
   *
   * @param name
   * @param oldValue
   * @private
   */
  _requestUpdate(name, oldValue) {
    // @ts-ignore
    // noinspection JSUnresolvedFunction
    super._requestUpdate(name, oldValue);

    if (name === 'toggled') {
      this.dispatchEvent(new Event('state-changed'));
    }
  }

  toggle() {
    this.toggled = !this.toggled;
  }

  render() {
    return html`
      <button
        aria-label="Hamburger Toggle"
        class="hamburger ${classMap({ '-toggled': this.toggled })}"
        @click="${e => {
          e.preventDefault();
          this.toggle();
        }}"
      >
        <span class="hamburger-box">
          <span class="hamburger-inner"></span>
        </span>
      </button>
    `;
  }
}
