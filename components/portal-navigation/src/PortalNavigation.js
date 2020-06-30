/**
 * @typedef { import("lit-element").CSSResult } CSSResult
 * @typedef { import("lit-element").CSSResultArray } CSSResultArray
 */
import { html, LitElement } from 'lit-element';
import { baseStyles } from '../../helpers/baseStyles.js';
import { portalNavigationStyle } from './PortalNavigationStyle.js';

export class PortalNavigation extends LitElement {
  /**
   * @returns {CSSResult|CSSResultArray}
   */
  static get styles() {
    return [baseStyles, portalNavigationStyle];
  }

  static get defaults() {
    return {
      language: 'en',
    };
  }

  static get events() {
    const ns = 'portal';

    return {
      // routeTo: `${ns}.routeTo`,
      setLanguage: `${ns}.setLanguage`,
      // setUnreadMessageCount: `${ns}.setUnreadMessageCount`,
      // setCurrentUser: `${ns}.setCurrentUser`,
      // setActiveItem: `${ns}.setActiveItem`,
      // navigationSync: `${ns}.navigationSync`
    };
  }

  static get properties() {
    return {
      src: { type: String },
      lang: { type: String }
    };
  }

  get src() {
    return this._src;
  }

  set src(src) {
    if (src) {
      this._src = src;
    }
  }

  get lang() {
    return this._lang;
  }

  set lang(lang) {
    if (lang === this._lang || !this._isSupportedLanguage(lang)) {
      return;
    }

    this._lang = lang;

    this.dispatchEvent(
      new CustomEvent(PortalNavigation.events.setLanguage, {
        detail: this._lang,
        bubbles: true
      })
    );
  }

  connectedCallback() {
    console.log("Connected");

    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this._connected = true;

    // this._detectCurrentUser()
    this.detectCurrentLanguage();

    if (this.src) {
      this.fetchRemoteData();
    }
  }

  fetchRemoteData() {
    this._remoteData = {};

    console.log(`Fetching data from ${this.src}`);
    fetch(this.src).then(response => {
      return response.json();
    }).then(data => {
      console.log('Data received:', data);
      try {
        this._remoteData = JSON.parse(data);
      } catch (e) {
        console.warn(e);
      }
    });
  }

  detectCurrentLanguage() {
    // html lang="en"
    const documentLang = (document.documentElement.lang || '').slice(0, 2);
    if (documentLang) {
      this.lang = documentLang;
      return;
    }

    // Window.navigator.language (Browser language)
    const browserLang = (navigator.language || '').slice(0, 2)
    if (browserLang) {
      this.lang = browserLang;
      return;
    }

    // Fallback language
    this.lang = PortalNavigation.defaults.language;
  }

  _isSupportedLanguage(lang) {
    const languages = this._getData('languages', []);
    if (languages && languages.length > 0) {
      return languages.find(({ id }) => id === lang) !== undefined;
    }
    return true;
  }

  _getData(key, fallback) {
    if (!this._remoteData) {
      return fallback;
    }

    if (key in this._remoteData) {
      return this._remoteData[key];
    }

    return fallback;
  }

  _getLabel(element) {
    // TODO: must return the label for the current language (this.lang)
    // TODO: if this language is not supported use the first language from the languages array in remote
    // TODO: if languages is not defined, used the first label in the array of the item
    return ''
  }

  render() {
    console.debug(`Rendering with language set to “${this.lang}”.`);

    return html`
    <div class="nav-menu-container">
        <header class="nav-menu-header">
            <div class="nav-menu-content">
                logo-slot:<slot name="logo"></slot>

                <button class="nav-menu-header-toggle hamburger" type="button" aria-label="Toggle navigation">
                <span class="hamburger-box">
                    <span class="hamburger-inner"></span>
                </span>
                </button>
            </div>
        </header>

        <main class="nav-menu-groups">
            <section class="nav-slot-left">left-slot:<slot name="left"></slot></section>
            <section class="nav-menu-meta-group">meta</section>
            <section class="nav-menu-profile-group">profile</section>
            <section class="nav-menu-logout">logout</section>
            <section class="nav-slot-right">right-slot:<slot name="right"></slot></section>
            <section class="nav-menu-main-group">
                <div class="nav-menu-content">lvl1-content</div>
            </section>
            <section class="nav-menu-current">
                <div class="nav-menu-content">lvl2-content</div>
            </section>
        </main>
    </div>`;
  }

}
