import { html, css, LitElement } from 'lit-element';

export class PortalLanguageSwitcher extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 1rem;
        color: var(--portal-language-switcher-text-color, #000);
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      language: { type: String },
    };
  }

  constructor() {
    super();
    this.title = 'Hai there';
    this.language = 'de';
  }

  __switchLanguage() {
    this.language = this.language === 'de' ? 'en' : 'de';
  }

  render() {
    return html`
      <h2>${this.title} (language: ${this.language})</h2>
      <button @click=${this.__switchLanguage}>switch</button>
    `;
  }
}
