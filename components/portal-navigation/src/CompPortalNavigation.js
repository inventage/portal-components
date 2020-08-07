import { html, LitElement } from 'lit-element';
import './ExtPortalNavigation.js';
import { classMap } from 'lit-html/directives/class-map.js';

export class CompPortalNavigation extends LitElement {
  static get defaults() {
    return {
      environment: null,
      // requestTimeout: 2000,
      // resizeTimeout: 250
    };
  }

  static get properties() {
    return {
      languages: { attribute: false }, // array of string, e.g. ['en', 'de']
    };
  }

  constructor() {
    super();
    this.languages = [];
  }

  get currentEnvironment() {
    return this._currentEnvironment || CompPortalNavigation.defaults.environment;
  }

  set currentEnvironment(environment) {
    if (environment) {
      this._currentEnvironment = environment;
    }
  }

  render() {
    return html`<ext-portal-navigation src="/data/data.json">
      <div slot="logo">
        <svg class="portal-navigation-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 567 187">
          <path
            d="M339.8 76.6c-2.9-4.4-5.2-6.1-9.9-6.1-4.5 0-6.8 1.7-9.8 6L282 133.6h11.6l11.9-18.7 40.3-.1 12.5 18.7 19.9-.1c-.1-.1-31.8-46.8-38.4-56.8zm-30.7 33.2l16.6-26.2 16.7 26.1-33.3.1zm-33.6-.3c-7.2-7.2-22.5-8-23.8-8 4.8 0 14.3-3 18.3-7.1 1.9-1.9 3.1-4.2 3.1-7.4 0-2.8-1.3-4.8-3-6.6-6-6-22.4-7.8-31.4-7.8l-29.2.1c-5.3 0-8.8 2.8-8.7 8.5l.2 52.4 42.1-.1c7.7 0 21-.9 28.5-5.5 4.2-2.6 7.1-5.7 7.1-10.8 0-3-.9-5.5-3.2-7.7zm-56.4-26.7c0-4.2 2.5-5.2 5.1-5.5 1.2-.2 4.7-.2 7.7-.2 7.5 0 23.5.7 23.5 10.8 0 2.6-1 4.6-2.5 6.1-4.8 4.7-15.1 5.5-20.6 5.5h-13.2V82.8zm16.1 46.1c-3.3 0-12.7.3-14.9-2-1.4-1.4-1.1-3.7-1.1-6.9l-.1-15.8 13.7-.1c8.1 0 18.6-.7 24.8 5.4 1.9 1.8 3.1 4.3 3.1 7 .2 11-17.9 12.4-25.5 12.4zm221-8.7l-48.3-48.4-14.5.1c-6.1 0-8.8 4.8-8.8 8.2l.2 52.5h10.7l-.2-50.8 51 50.6 20.6-.1-.2-60.6h-10.5v48.5zM565 132.3l-43.8-33.7 38.6-27-15.8.1-38.6 28.3-.1-28.2h-10.1c-8.7 0-8.2 8.6-8.2 8.6l.2 52.1 18.3-.1-.1-30.5 37.1 30.3 22.5.1z"
            fill="#b4af82"
          />
          <path
            d="M147.4 75.9c6.4 0 12.9 1.6 15.8 4.5 2 2.1 3.4 4.9 3.4 8.6 0 3.1-1.3 5.3-3.1 7.1-5.5 5.6-17.7 5.4-22.5 5.4h-7.4l-.1-20.7c0-3 2.2-4.7 6.1-4.7 3.2 0 4.8-.2 7.8-.2"
            fill="#00376e"
          />
          <path
            d="M157.4 162.9c-12.4 12.4-35.4 23-63.9 23.1-10.1 0-27.8-2-38.9-7.5-17.7-8.7-34.5-23-44.4-39.8C2.6 125.5-.3 110.8 0 96c.7-25.3 5.9-44.5 25.6-65.6C47.5 7.1 79.3.1 98.9 0c18-.1 35.4 4.7 51.7 17.5 22 17.3 33.5 43.4 35 70.1-.3-3.2-1.6-5.9-3.6-7.9-8.4-8.3-27.1-8.3-36-8.2l-49 .2L63.3 122 29.5 71.8l-19.3.1 39.1 57c3.4 4.7 6 6.1 10.2 6.1 4.5 0 6.7-1.7 10.2-6l36.1-53.2h3.3c6.4 0 6.2 3.1 6.2 6.8l.2 50.4 18.6-.1-.1-27.2h9.3c9.2 0 30.3.6 38.8-8 2.3-2.3 3.7-5.2 3.7-8.9.1 1.5.1 3 .1 4.5 0 27.7-9.2 50.4-28.5 69.6z"
            fill="#00376e"
          />
        </svg>
        ${this._getEnvironmentTemplate()}
      </div>
      <div slot="left">
        <a href="/" class="website">website-link</a>
        <section class="portal-navigation-language-group">
          languages: ${this._getLanguageTemplate()}
        </section>
      </div>
    </ext-portal-navigation>`;
  }

  _getEnvironmentTemplate() {
    const classes = ['portal-navigation-environment'];

    if (this.currentEnvironment) {
      classes.push(`-${this.currentEnvironment}`);
    }

    return html`<span class="${classes.join(' ')}"></span>`;
  }

  _getLanguageTemplate() {
    return this.languages.map(
      language =>
        html`<a
          href="${`set-lang-to-${language.id}`}"
          class="${classMap({ link: true, '-selected': language === this.lang })}"
          title="${language.label}"
          @click="${e => {
            e.preventDefault();
            this.__setLanguage(language.id);
          }}"
          >${language.id}</a
        >`,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  __setLanguage(languageId) {
    // eslint-disable-next-line no-console
    console.log(`Language set ${languageId} (Language chooser)`);

    // if (this._internalRouting === false) {
    //   return;
    // }
    //
    // const {lang} = $link.dataset;
    // const request = new XMLHttpRequest();
    // const selectedClass = this.constructor.classes.selected;
    //
    // [...this._$language.querySelectorAll(`.${selectedClass}`)].forEach(
    //   $el => $el.classList.remove(selectedClass)
    // );
    //
    // $link.classList.add(selectedClass);
    //
    // // On load, abort, error or timeout we update the language…
    // ['loadend', 'timeout'].forEach(event => request.addEventListener(event, () => (this.lang = lang)));
    //
    // request.open('POST', this.constructor.api.language.replace(':language', lang), true);
    //
    // // In Internet Explorer, the timeout property may be set only after calling the open() method
    // // and before calling the send() method.
    // // @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout
    // request.timeout = this.constructor.defaults.requestTimeout;
    //
    // request.send();
    //
    // e.preventDefault();
  }
}

customElements.define('comp-portal-navigation', CompPortalNavigation);
