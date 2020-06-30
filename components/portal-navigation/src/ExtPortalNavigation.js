import { html } from 'lit-html';
import { PortalNavigation } from './PortalNavigation.js';

export class ExtPortalNavigation extends PortalNavigation {

  static get cookieId() {
    return 'portal-language';
  }

  detectCurrentLanguage() {
    // Cookie
    const cookieLang = /* Cookie.get(this.constructor.cookieId); */ undefined;
    if (cookieLang) {
      this.lang = cookieLang;
    }

    super.detectCurrentLanguage();
  }
}

customElements.define('ext-portal-navigation', ExtPortalNavigation);
