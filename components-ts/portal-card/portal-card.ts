import { PortalCard } from './src/PortalCard';

customElements.define('portal-card', PortalCard);

declare global {
  interface HTMLElementTagNameMap {
    'portal-card': PortalCard;
  }
}
