import { PortalNavigation } from './PortalNavigation.js';

export class ExtPortalNavigation extends PortalNavigation {
  static get cookieId() {
    return 'portal-language';
  }

  _detectCurrentLanguage() {
    // Cookie
    const cookieLang = /* Cookie.get(this.constructor.cookieId); */ undefined;
    if (cookieLang) {
      this.lang = cookieLang;
      // eslint-disable-next-line no-console
      console.log(`Using cookie language: ${this.lang}`);
      return;
    }

    // html lang="en"
    const documentLang = (document.documentElement.lang || '').slice(0, 2);
    if (documentLang) {
      this.lang = documentLang;
      // eslint-disable-next-line no-console
      console.log(`Using document language: ${this.lang}`);
      return;
    }

    // Window.navigator.language (Browser language)
    const browserLang = (navigator.language || '').slice(0, 2);
    if (browserLang) {
      this.lang = browserLang;
      // eslint-disable-next-line no-console
      console.log(`Using browser language: ${this.lang}`);
      return;
    }

    // Fallback language
    this.lang = PortalNavigation.defaults.language;
    // eslint-disable-next-line no-console
    console.log(`Using default language: ${this.lang}`);
  }

  // _isSupportedLanguage(lang) {
  //   const languages = this._getData('languages', []);
  //   if (languages && languages.length > 0) {
  //     return languages.find(({ id }) => id === lang) !== undefined;
  //   }
  //   return true;
  // }
}

customElements.define('ext-portal-navigation', ExtPortalNavigation);
