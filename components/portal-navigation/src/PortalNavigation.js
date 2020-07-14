/**
 * @typedef { import("lit-element").CSSResult } CSSResult
 * @typedef { import("lit-element").CSSResultArray } CSSResultArray
 */
import { html, LitElement } from 'lit-element';
import { baseStyles } from '../../helpers/baseStyles.js';
import { portalNavigationStyle } from './PortalNavigationStyle.js';

// @ts-ignore
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

  static get groups() {
    return {
      main: 'main',
      profile: 'profile',
      meta: 'meta',
      logout: 'logout',
      all: ['main', 'profile', 'meta', 'logout'],
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
    };
  }

  static get classes() {
    return {
      selected: '-selected',
      // showDropdown: '-show',
      // open: '-open',
      // empty: '-empty',
    };
  }

  static get properties() {
    return {
      src: { type: String }, // location from where to fetch the configuration (data.json)
      lang: { type: String }, // 'de' or 'en' - current language
      activePath: { attribute: false }, // {group,menuId,itemId} - identifying the active item
      activeUrl: { type: String },
      currentApplication: { type: String },
      internalRouting: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.src = undefined;
    this.lang = PortalNavigation.defaults.language;
    this.activePath = undefined;
    this.activeUrl = undefined;
    this.currentApplication = undefined;
    this.internalRouting = false;
  }

  connectedCallback() {
    console.log('Connected');

    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this.__connected = true;

    // this._detectCurrentUser()

    if (this.src) {
      this._fetchRemoteData();
    }
  }

  _fetchRemoteData() {
    this.__remoteData = {};

    console.log(`Fetching data from ${this.src}`);
    fetch(this.src)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log('Data received:', data);
        try {
          this.__remoteData = data; // JSON.parse(data);
          this.__updateActivePathFromUrl();
          this.requestUpdate();
        } catch (e) {
          console.warn(e);
        }
      });
  }

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
    super._requestUpdate(name, oldValue);

    if (name === 'lang') {
      this.dispatchEvent(new CustomEvent(PortalNavigation.events.setLanguage, { detail: this.lang, bubbles: true }));
    }
    if (name === 'activeUrl' && oldValue !== this.activeUrl) {
      this.__updateActivePathFromUrl();
    }

    // TODO: throw event for activeItem
  }

  __updateActivePathFromUrl() {
    console.log(`Updating activePath from activeUrl: ${this.activeUrl}`);
    const newPath = this.__getActivePathFromUrl(this.activeUrl);
    if (newPath) {
      console.log(`activePath set to: ${JSON.stringify(newPath)}`);
      this.activePath = newPath;
    }
  }

  __getActivePathFromUrl(url) {
    if (!this.__remoteData) {
      return undefined;
    }

    if (url) {
      for (let g = 0; g < PortalNavigation.groups.all.length; g += 1) {
        const group = PortalNavigation.groups.all[g];
        const menus = this._getData(`groups.${group}`, this.__remoteData, []);
        if (menus && menus.length > 0) {
          for (let m = 0; m < menus.length; m += 1) {
            const menu = menus[m];
            if (menu && menu.link === url) {
              return { group, menuId: menu.id, itemId: undefined };
            }
            const { items } = menu;
            if (items && items.length > 0) {
              for (let i = 0; i < menus.length; i += 1) {
                const item = items[i];
                if (item && item.link === url) {
                  return { group, menuId: menu.id, itemId: item.id };
                }
              }
            }
          }
        }
      }
    } else {
      this.activePath = undefined;
    }
    return undefined;
  }

  render() {
    console.debug(`Rendering with language set to “${this.lang}”.`);

    return html` <div class="nav-menu-container">
      <header class="nav-menu-header">
        <div class="nav-menu-logo"><slot name="nav-menu-slot-logo"></slot></div>
        <div class="nav-menu-slot-left"><slot name="left"></slot></div>
        <div class="nav-menu-meta-group nav-menu-group">
          ${this.__createGroupTemplate(PortalNavigation.groups.meta)}
        </div>
        <div class="nav-menu-profile-group nav-menu-group">
          ${this.__createGroupTemplate(PortalNavigation.groups.profile)}
        </div>
        <div class="nav-menu-logout nav-menu-group">${this.__createGroupTemplate(PortalNavigation.groups.logout)}</div>
        <div class="nav-menu-slot-right"><slot name="right"></slot></div>
      </header>

      <main class="nav-menu-main-group">
        <div class="nav-menu-main-group-menus nav-menu-group">
          <div class="nav-menu-content">${this.__createGroupTemplate(PortalNavigation.groups.main)}</div>
        </div>
        ${this.__createCurrentItemsTemplate()}
      </main>
    </div>`;
  }

  __createCurrentItemsTemplate() {
    if (!this.activePath) {
      return html``;
    }

    const { group, menuId } = this.activePath;
    const activeMenu = this._getData(`groups.${group}:${menuId}`, this.__remoteData, []);

    if (activeMenu && activeMenu.items && activeMenu.items.length > 0) {
      return html`<div class="nav-menu-current">
        <div class="nav-menu-content">
          ${activeMenu.items.map(item => this.__createMenuItemTemplate(group, activeMenu, item))}
        </div>
      </div>`;
    }
    return html``;
  }

  __createGroupTemplate(group) {
    const menus = this._getData(`groups.${group}`, this.__remoteData, []);

    // console.log(`${group} -->`, menus);

    // TODO: proper drop down hidden status

    if (group === 'profile') {
      return html`${this.__createUserTemplate()}${menus.length > 0
        ? html`<div class="dropdown" hidden>${menus.map(menu => this.__createMenuTemplate(group, menu))}</div>`
        : html``}`;
    }

    return html`${menus.map(menu => this.__createMenuTemplate(group, menu))}`;
  }

  // eslint-disable-next-line class-methods-use-this
  __createUserTemplate() {
    // <div class="<%= classes(ife(awaitingUserInformation, 'indicator-loading')) %>">
    //   <span class="indicator"></span>
    //   <span class="link label"><%= currentUser.userName %></span>
    // </div>
    return html``;
  }

  __createMenuTemplate(group, menu) {
    // console.log(menu);
    // TODO: add badge feature
    const { link, labels, items } = menu;

    const menuClasses = ['link'];
    if (menu.id && this.activePath && menu.id === this.activePath.menuId) {
      menuClasses.push(PortalNavigation.classes.selected);
    }

    // TODO: handle case of internalRouting===true (no items) (e.g. logout)

    return html`<div class="first-level">
      ${items && items.length > 0
        ? html`<a
            href="${link}"
            class="${menuClasses.join(' ')}"
            @click="${e => this.__createRevealSecondLevelClickHandler(e, group, menu)}"
            >${this._getLabel(labels)}</a
          >`
        : html`<a
            href="${link}"
            class="${menuClasses.join(' ')}"
            target="${menu.destination === 'extern' ? '_blank' : '_self'}"
            >${this._getLabel(labels)}</a
          >`}
    </div>`;
  }

  __createMenuItemTemplate(group, menu, item) {
    const itemClasses = ['link'];
    if (item.id && this.activePath && item.id === this.activePath.itemId) {
      itemClasses.push(PortalNavigation.classes.selected);
    }

    if (this.__isInternalRouting(item)) {
      return html`<a
        href="${item.link}"
        class="${itemClasses.join(' ')}"
        @click="${e => this.__createInternalLinkClickHandler(e, group, menu, item)}"
        >${this._getLabel(item.labels)}</a
      >`;
    }
    return html`<a
      href="${item.link}"
      class="${itemClasses.join(' ')}"
      target="${item.destination === 'extern' ? '_blank' : '_self'}"
      >${this._getLabel(item.labels)}</a
    >`;
  }

  __createRevealSecondLevelClickHandler(e, group, menu) {
    e.preventDefault();

    console.log(`Set second level to items of: ${this._getLabel(menu.labels)}`);

    const item = this.__getDefaultItemOf(menu);

    this.activePath = { group, menuId: menu.id, itemId: item ? item.id : undefined };
  }

  __createInternalLinkClickHandler(e, group, menu, item) {
    e.preventDefault();

    console.log(`Internal link selected: ${this._getLabel(item.labels)}`);

    this.activePath = { group, menuId: menu.id, itemId: item.id };
  }

  // eslint-disable-next-line class-methods-use-this
  __getDefaultItemOf(menu) {
    const { defaultItem, items } = menu;

    if (Array.isArray(items) === false || items.length < 1 || typeof defaultItem !== 'string') {
      return null;
    }

    // If default item wasn't found, take the first one
    return items.find(item => item.id === defaultItem) || items[0];
  }

  __isInternalRouting(item) {
    // Allow global `_internalRouting` to override the item specific `internalRouting` property
    const itemInternalRouting = 'internalRouting' in item ? item.internalRouting : this.internalRouting;

    // Bail if we're not routing internally…
    if (!itemInternalRouting) {
      return false;
    }

    // The current application does not matter, we route internally…
    if (!this.currentApplication) {
      return true;
    }

    // Current application was set, but item is not application specific…
    if (!('application' in item)) {
      // We check whether the current application is in the list of `internalRoutingApplications`
      return (
        'internalRoutingApplications' in item &&
        Array.prototype.includes.call(item.internalRoutingApplications, this.currentApplication)
      );
    }

    return item.application === this.currentApplication;
  }

  _getData(key, data = this.__remoteData, fallback) {
    if (!data) {
      return fallback;
    }

    const parts = key.split('.');
    const prop = parts[0];

    const propParts = prop.split(':');

    // console.log(`prop: ${propParts[0]}, index: ${propParts.length > 1 ? propParts[1] : '<none>'}`);

    let obj;
    if (propParts[0] in data) {
      obj = data[propParts[0]];
    } else {
      return fallback;
    }

    if (parts.length === 1) {
      if (propParts.length === 1) {
        return obj;
      }
      const filtered = obj.filter(item => item.id === propParts[1]);
      if (filtered.length > 0) {
        return filtered[0];
      }
      return undefined;
    }

    const subKey = parts.slice(1, parts.length).join('.');
    return this._getData(subKey, obj, fallback);
  }

  _getLabel(labels) {
    if (!this.lang) {
      return '(noLang)';
    }

    if (this.lang in labels) {
      return labels[this.lang];
    }

    return '(noLabel)';

    // TODO: must return the label for the current language (this.lang)
    // TODO: if this language is not supported use the first language from the languages array in remote
    // TODO: if languages is not defined, used the first label in the array of the item
  }
}
