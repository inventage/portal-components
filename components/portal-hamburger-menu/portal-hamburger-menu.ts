import { PortalHamburgerMenu } from './src/PortalHamburgerMenu';

customElements.define('portal-hamburger-menu', PortalHamburgerMenu);

declare global {
  interface HTMLElementTagNameMap {
    'portal-hamburger-menu': PortalHamburgerMenu;
  }
}
