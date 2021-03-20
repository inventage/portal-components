import { PortalNavigation } from './src/PortalNavigation';

customElements.define('portal-navigation', PortalNavigation);

declare global {
  interface HTMLElementTagNameMap {
    'portal-navigation': PortalNavigation;
  }
}
