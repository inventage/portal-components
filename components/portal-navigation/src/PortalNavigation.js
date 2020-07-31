/**
 * @typedef { import("lit-element").CSSResult } CSSResult
 * @typedef { import("lit-element").CSSResultArray } CSSResultArray
 */
import { html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { baseStyles } from '../../helpers/baseStyles.js';
import { portalNavigationStyle } from './PortalNavigationStyle.js';
import { Configuration } from './Configuration.js';

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

  static get events() {
    const ns = 'portal';

    return {
      // routeTo: `${ns}.routeTo`,
      setLanguage: `${ns}.setLanguage`,
      setBadgeValue: `${ns}.setBadgeValue`,
      // setCurrentUser: `${ns}.setCurrentUser`,
      setActiveItem: `${ns}.setActiveItem`,
    };
  }

  static get classes() {
    return {
      selected: '-selected',
      decorator: '-decorator',
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
      hamburgerMenuExpanded: { type: Boolean, attribute: false },
      activeDropdown: { type: String, attribute: false },
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
    this.temporaryBadgeValues = new Map();
    this.hamburgerMenuExpanded = false;
    this.activeDropdown = undefined;
    this.__configuration = new Configuration();
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

    this.addEventListener(PortalNavigation.events.setBadgeValue, this.__setBadgeValueEventListener);

    document.addEventListener('click', (...args) => this._onGlobalClick(...args));
    // this.shadowRoot.addEventListener('click', (...args) => this._onGlobalClick(...args));

    this.dispatchEvent(
      new CustomEvent(PortalNavigation.events.setBadgeValue, {
        detail: {
          id: 'profile.preferences.userSettings',
          value: { en: 'NEW', de: 'NEU' },
        },
      }),
    );

    this.dispatchEvent(
      new CustomEvent(PortalNavigation.events.setBadgeValue, {
        detail: {
          id: 'meta.messages',
          value: '9',
        },
      }),
    );
  }

  _onGlobalClick(e) {
    const isOutsideOfComponent = e.target !== this;

    if (isOutsideOfComponent) {
      this.activeDropdown = undefined;
    }
  }

  disconnectedCallback() {
    this.removeEventListener(PortalNavigation.events.setBadgeValue, this.__setBadgeValueEventListener);

    this.__connected = false;

    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }

    console.log('Disconnected');
  }

  _fetchRemoteData() {
    this.__configuration.setConfigData({});

    console.log(`Fetching data from ${this.src}`);
    fetch(this.src)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log('Data received:', data);
        try {
          this.__configuration.setConfigData(data);
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
    if (name === 'activePath' && oldValue !== this.activePath) {
      let item;
      if (this.activePath && this.__configuration) {
        item = this.__configuration.getItem(this.activePath);
      }

      this.dispatchEvent(
        new CustomEvent(PortalNavigation.events.setActiveItem, {
          detail: item,
          bubbles: true,
        }),
      );
    }
  }

  __updateActivePathFromUrl() {
    console.log(`Updating activePath from activeUrl: ${this.activeUrl}`);
    const newPath = this.__configuration.getPathFromUrl(this.activeUrl);
    if (newPath) {
      console.log(`activePath set to: ${JSON.stringify(newPath)}`);
      this.activePath = newPath;
    }
  }

  __setBadgeValueEventListener(e) {
    const { detail } = e;
    if (detail) {
      this.setBadgeValue(detail.id, detail.value);
    }
  }

  setBadgeValue(menuOrItemId, value) {
    console.log(`Setting badge of "${menuOrItemId}" to "${value}"`);

    // TODO: write to Store instead of temporary map
    this.temporaryBadgeValues.set(menuOrItemId, value);
    this._requestUpdate();
  }

  getBadgeValue(menuOrItemId) {
    // TODO: read from Store instead of temporary map
    const value = this.temporaryBadgeValues.get(menuOrItemId);
    if (value && typeof value === 'object' && value.constructor === Object) {
      return this._getLabel(value);
    }
    return value;
  }

  render() {
    console.debug(`Rendering with language set to “${this.lang}”.`);

    return html`<div class="nav-menu-container">
      <header class="nav-menu-header">
        <div class="nav-menu-logo"><slot name="nav-menu-slot-logo"></slot></div>
        <div class="nav-menu-slot-left"><slot name="left"></slot></div>
        <div class="nav-menu-meta-group nav-menu-group">
          ${this.__createGroupTemplate(Configuration.groups.meta)}
        </div>
        <div class="nav-menu-profile-group nav-menu-group">
          ${this.__createGroupTemplate(Configuration.groups.profile)}
        </div>
        <div class="nav-menu-logout nav-menu-group">${this.__createGroupTemplate(Configuration.groups.logout)}</div>
        <div class="nav-menu-slot-right"><slot name="right"></slot></div>
        <!-- Hamburger Menu Tree Elements -->
        <button
          class="nav-menu-header-toggle"
          type="button"
          @click="${() => {
            this.hamburgerMenuExpanded = !this.hamburgerMenuExpanded;
          }}"
        >
          Menu
        </button>
      </header>

      <main class="nav-menu-main-group">
        <div class="nav-menu-main-group-menus nav-menu-group">
          <div class="nav-menu-content">${this.__createGroupTemplate(Configuration.groups.main)}</div>
        </div>
        ${this.__createCurrentItemsTemplate()}
        <!-- Hamburger Menu Tree Elements -->
        ${this.hamburgerMenuExpanded
          ? html`<div class="nav-menu-tree-container">
              ${this._createTreeTemplate()}
            </div>`
          : html``}
      </main>
    </div>`;
  }

  __createCurrentItemsTemplate() {
    if (!this.activePath) {
      return html``;
    }

    const { group, menuId } = this.activePath;
    const activeMenu = this.__configuration.getData(`groups.${group}:${menuId}`, []);

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
    const menus = this.__configuration.getData(`groups.${group}`, []);

    if (group === 'profile') {
      const badge = this.getBadgeValue(group);

      const menuClasses = ['link', 'dropdown-link'];
      if (this._isActive(group)) {
        menuClasses.push(PortalNavigation.classes.selected);
      }

      let label = '';
      const user = this.__configuration.getData(`user`, {});
      if (user && user.userName) {
        label = user.userName;
      }

      const icon = '/data/account_circle-24px.svg';
      const hasMenus = menus && menus.length > 0;

      const templates = [];
      templates.push(html`<div class="first-level">
        ${hasMenus
          ? html`<span class="${menuClasses.join(' ')}" @click="${e => this.__openDropdown(e, group)}"
              >${this.__createLinkTemplate(label, icon, badge)}</span
            >`
          : html`<span class="${menuClasses.join(' ')}">${this.__createLinkTemplate(label, icon, badge)}</span>`}
      </div>`);

      if (hasMenus) {
        templates.push(
          html`<div class="${classMap({ dropdown: true, '-showDropdown': this.activeDropdown === group })}">
            ${menus.map(menu => this.__createMenuTemplate(group, menu))}
          </div> `,
        );
      }
      return templates;
    }

    return html`${menus.map(menu => this.__createMenuTemplate(group, menu))}`;
  }

  __openDropdown(e, group) {
    this.activeDropdown = this.activeDropdown ? undefined : group;
  }

  __createMenuTemplate(group, menu) {
    const { link, icon, labels, items } = menu;
    const badge = this.getBadgeValue(menu.id);

    const menuClasses = ['link'];
    if (this._isActive(menu.id)) {
      menuClasses.push(PortalNavigation.classes.selected);
    }

    // TODO: handle case of internalRouting===true (no items) (e.g. logout)

    const label = this._getLabel(labels);

    return html`<div class="first-level">
      ${items && items.length > 0
        ? html`<a
            href="${link}"
            class="${menuClasses.join(' ')}"
            @click="${e => this.__setCurrentItems(e, group, menu)}"
            >${this.__createLinkTemplate(label, icon, badge)}</a
          >`
        : html`<a
            href="${link}"
            class="${menuClasses.join(' ')}"
            target="${menu.destination === 'extern' ? '_blank' : '_self'}"
            >${this.__createLinkTemplate(label, icon, badge)}</a
          >`}
    </div>`;
  }

  __createMenuItemTemplate(group, menu, item) {
    const itemClasses = ['link'];
    if (this._isActive(item.id)) {
      itemClasses.push(PortalNavigation.classes.selected);
    }

    const { icon, labels } = item;
    const badge = this.getBadgeValue(item.id);
    const label = this._getLabel(labels);

    if (this.__isInternalRouting(item)) {
      return html`<a
        href="${item.link}"
        class="${itemClasses.join(' ')}"
        @click="${e => this.__internalLinkClicked(e, group, menu, item)}"
        >${this.__createLinkTemplate(label, icon, badge)}</a
      >`;
    }
    return html`<a
      href="${item.link}"
      class="${itemClasses.join(' ')}"
      target="${item.destination === 'extern' ? '_blank' : '_self'}"
      >${this.__createLinkTemplate(label, icon, badge)}</a
    >`;
  }

  // eslint-disable-next-line class-methods-use-this
  __createLinkTemplate(label, icon, badge) {
    const result = [];
    if (icon) {
      result.push(html`<img src="${icon}" alt="" class="nav-menu-icon" />`);
      if (badge) {
        result.push(html`<span class="badge ${PortalNavigation.classes.decorator}">${badge}</span>`);
      }
    }
    if (label) {
      result.push(html`${label}`);
      if (!icon && badge) {
        result.push(html`<span class="badge">${badge}</span>`);
      }
    }
    return result;
  }

  // Override to customize order and elements of tree structure in hamburger menu
  _createTreeTemplate() {
    const templates = [];
    Configuration.groups.all.forEach(group => {
      templates.push(this.__configuration.getMenus(group).map(menu => this.__createTreeMenuTemplate(group, menu)));
    });
    return templates;
  }

  __createTreeMenuTemplate(group, menu) {
    const isActiveMenu = this._isActive(menu.id);

    const templates = [];
    templates.push(
      html`<div class="nav-menu-tree-menu ${isActiveMenu ? PortalNavigation.classes.selected : ''}">
        ${this.__createMenuTemplate(group, menu)}${menu.items && menu.items.length > 0
          ? html`<span class="${classMap({ button: true, '-selected': isActiveMenu })}"
              ><img
                src="${isActiveMenu ? '/data/keyboard_arrow_up-24px.svg' : '/data/keyboard_arrow_down-24px.svg'}"
                alt=""
                class="icon"
            /></span>`
          : html``}
      </div>`,
    );

    if (isActiveMenu) {
      templates.push(
        html`<div class="nav-menu-tree-menu-items">
          ${menu.items.map(item => this.__createMenuItemTemplate(group, menu, item))}
        </div>`,
      );
    }

    return templates;
  }

  // ids of menu and items and names of groups must all be unique.
  _isActive(id) {
    return (
      this.activePath &&
      (id === this.activePath.group || id === this.activePath.menuId || id === this.activePath.itemId)
    );
  }

  __setCurrentItems(e, group, menu) {
    e.preventDefault();

    console.log(`Set current items to items of: ${this._getLabel(menu.labels)}`);

    const item = this.__getDefaultItemOf(menu);

    this.activeDropdown = undefined;
    this.activePath = { group, menuId: menu.id, itemId: item ? item.id : undefined };
  }

  __internalLinkClicked(e, group, menu, item) {
    e.preventDefault();

    console.log(`Internal link selected: ${this._getLabel(item.labels)}`);

    this.activeDropdown = undefined;
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
    // Allow global `internalRouting` to be overridden by the item specific `internalRouting` property
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
