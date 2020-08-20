/**
 * @typedef { import("lit-element").CSSResult } CSSResult
 * @typedef { import("lit-element").CSSResultArray } CSSResultArray
 */
import { html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { baseStyles } from '../../helpers/baseStyles.js';
import { portalNavigationStyles } from './portalNavigationStyles.js';
import { Configuration } from './Configuration.js';
import '../../portal-hamburger-menu/portal-hamburger-menu.js';
import { IdPath } from './IdPath.js';

/**
 * @prop {IdPath} activePath - the current path of "active" items. e.g. if an item in level 2 is clicked it's parent item and the corresponding menu would be considered "active".
 */
// @ts-ignore
export class PortalNavigation extends LitElement {
  /**
   * @returns {CSSResult|CSSResultArray}
   */
  static get styles() {
    return [baseStyles, portalNavigationStyles];
  }

  static get defaults() {
    return {
      language: 'en',
    };
  }

  static get menuIds() {
    return {
      main: 'main',
      meta: 'meta',
      profile: 'profile',
      logout: 'logout',
    };
  }

  static get menuIdsOrdered() {
    return Object.values(PortalNavigation.menuIds);
  }

  static get events() {
    const ns = 'portal';

    return {
      routeTo: `${ns}.routeTo`,
      setLanguage: `${ns}.setLanguage`,
      setBadgeValue: `${ns}.setBadgeValue`,
    };
  }

  static get classes() {
    return {
      selected: '-selected',
    };
  }

  static get properties() {
    return {
      src: { type: String }, // location from where to fetch the configuration (data.json)
      lang: { type: String }, // 'de' or 'en' - current language
      activeUrl: { type: String },
      currentApplication: { type: String },
      internalRouting: { type: Boolean },

      /**
       * @private
       */
      activePath: { attribute: false }, // {menuId: string, itemIds: [string]} - identifying the active item

      /**
       * @private
       */
      hamburgerMenuExpanded: { type: Boolean, attribute: false },

      /**
       * @private
       */
      activeDropdown: { type: String, attribute: false },
    };
  }

  constructor() {
    super();
    this.src = undefined;
    this.lang = PortalNavigation.defaults.language;
    this.activePath = new IdPath();
    this.activeUrl = undefined;
    this.currentApplication = undefined;
    this.internalRouting = false;
    this.temporaryBadgeValues = new Map();
    this.hamburgerMenuExpanded = false;
    this.activeDropdown = undefined;
    this.__configuration = new Configuration();

    // Make sure global (document / window) listeners are bound to `this`, otherwise we cannot properly remove them
    // @see https://open-wc.org/faq/events.html#on-elements-outside-of-your-element
    this.__setBadgeValueEventListener = this.__setBadgeValueEventListener.bind(this);
    this.__globalClickListener = this.__globalClickListener.bind(this);
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    if (this.src) {
      this._fetchRemoteData();
    }

    const parsedUrl = new URL(window.location.href);
    if (parsedUrl && parsedUrl.pathname && parsedUrl.pathname !== '/') {
      const { pathname } = parsedUrl;
      this.activeUrl = pathname;
    }

    // Register global listeners
    document.addEventListener(PortalNavigation.events.setBadgeValue, this.__setBadgeValueEventListener);
    document.addEventListener('click', this.__globalClickListener);
  }

  /**
   * Hides any active dropdowns when a click occurs outside of the dropdown or its menu.
   *
   * @param e
   * @private
   */
  __globalClickListener(e) {
    if (!this.activeDropdown || !e.composed) {
      return;
    }

    // At this point, there should be an open dropdown
    const activeDropdownElement = this.shadowRoot.querySelector('.dropdown.-show');
    if (!activeDropdownElement) {
      return;
    }

    // If the event path contains either the dropdown itself or its menu, let's bail…
    const elementMenu = activeDropdownElement.closest('.portal-navigation-menu');
    if (e.composedPath().includes(activeDropdownElement) || e.composedPath().includes(elementMenu)) {
      return;
    }

    // Click was outside of target elements, let's hide the currently active dropdown
    this.activeDropdown = undefined;
  }

  disconnectedCallback() {
    // Remove existing global listeners
    document.removeEventListener(PortalNavigation.events.setBadgeValue, this.__setBadgeValueEventListener);
    document.removeEventListener('click', this.__globalClickListener);

    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }

  _fetchRemoteData() {
    this.__configuration = new Configuration();

    fetch(this.src)
      .then(response => {
        return response.json();
      })
      .then(data => {
        try {
          this.__configuration = new Configuration(data);
          this.__updateActivePathFromUrl();
          // @ts-ignore
          this.requestUpdate();
        } catch (e) {
          // eslint-disable-next-line no-console
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

    if (name === 'activeUrl' && oldValue !== this.activeUrl) {
      this.__updateActivePathFromUrl();
    }
  }

  updated(_changedProperties) {
    super.updated(_changedProperties);

    if (_changedProperties.has('lang')) {
      this.dispatchEvent(new CustomEvent(PortalNavigation.events.setLanguage, { detail: this.lang, bubbles: true }));
    }
  }

  __updateActivePathFromUrl() {
    const newPath = this.__configuration.getIdPathForUrl(this.activeUrl);
    if (newPath) {
      this.activePath = newPath;
    }
  }

  __setBadgeValueEventListener(e) {
    const { detail } = e;
    if (detail) {
      this.setBadgeValue(detail.id || detail.url, detail.value);
    }
  }

  /**
   * Set a badge value for a specific key. Menus/items will automatically look up badge values by their id. Items will
   * first check for badge values by using their id and then by using their url.
   *
   * @param {string} key - menuId or itemId or url
   * @param {*} value - the badge value (could be a l11n label object)
   */
  setBadgeValue(key, value) {
    // TODO: write to Store instead of temporary map
    this.temporaryBadgeValues.set(key, value);
    // @ts-ignore
    this._requestUpdate();
  }

  /**
   * Checks for a badge for the given id. The url is only checked if no badge value was found for the id.
   *
   * @param {string} id - a menuId or itemId
   * @param {string} url - a url of an item
   * @returns {string|any} the badge value associated with the id or url or undefined if none exists.
   */
  getBadgeValue(id, url = undefined) {
    // TODO: read from Store instead of temporary map
    let value = this.temporaryBadgeValues.get(id);
    if (!value && url) {
      value = this.temporaryBadgeValues.get(url);
    }
    if (value && typeof value === 'object' && value.constructor === Object) {
      return this._getLabel(value);
    }
    return value;
  }

  __toggleDropdown(e, menuId) {
    this.activeDropdown = this.activeDropdown ? undefined : menuId;
  }

  render() {
    return html`<div class="portal-navigation-container">
      <header class="portal-navigation-header">
        <div class="portal-navigation-logo"><slot name="logo"></slot></div>
        <div class="portal-navigation-slot-left"><slot name="left"></slot></div>
        <div class="portal-navigation-menu-meta portal-navigation-menu">
          ${this.__createMenuTemplate(PortalNavigation.menuIds.meta)}
        </div>
        <div class="portal-navigation-menu-profile portal-navigation-menu">
          ${this.__createMenuTemplate(PortalNavigation.menuIds.profile)}
        </div>
        <div class="portal-navigation-menu-logout portal-navigation-menu">
          ${this.__createMenuTemplate(PortalNavigation.menuIds.logout)}
        </div>
        <div class="portal-navigation-slot-right"><slot name="right"></slot></div>
        <!-- Hamburger Menu Tree Elements -->
        <portal-hamburger-menu
          class="portal-navigation-header-toggle"
          .toggled="${this.hamburgerMenuExpanded}"
          @state-changed="${e => {
            this.hamburgerMenuExpanded = e.detail;
          }}"
        ></portal-hamburger-menu>
      </header>

      <main class="portal-navigation-menu-main">
        <div class="portal-navigation-menu-main-items portal-navigation-menu">
          <div class="portal-navigation-content">${this.__createMenuTemplate(PortalNavigation.menuIds.main)}</div>
        </div>
        ${this.__createCurrentItemsTemplate()}
        <!-- Hamburger Menu Tree Elements -->
        ${this.hamburgerMenuExpanded
          ? html`<div class="portal-navigation-tree-container">
              ${this._createTreeTemplate()}
            </div>`
          : html``}
      </main>
    </div>`;
  }

  __createMenuTemplate(menuId) {
    const menu = this.__configuration.getMenu(menuId);

    if (!menu || !menu.items || menu.items.length <= 0) {
      return html``;
    }

    if (menu && menu.dropdown) {
      const badge = this.getBadgeValue(menu.id);
      const label = this._getLabel(menu);
      return html` <span
          class="${classMap({
            link: true,
            'dropdown-link': true,
            [PortalNavigation.classes.selected]: this.activePath.contains(menuId),
          })}"
          @click="${e => this.__toggleDropdown(e, menuId)}"
          >${this.__createLinkTemplate(label, menu.icon, badge)}</span
        >
        <div class="dropdown ${classMap({ '-show': this.activeDropdown === menuId })}">
          ${menu.items.map(item => this.__createFirstLevelItemTemplate(menuId, item))}
        </div>`;
    }
    return html`${menu.items.map(item => this.__createFirstLevelItemTemplate(menuId, item))}`;
  }

  __createFirstLevelItemTemplate(menuId, item, isTreeMode = false) {
    const { id, icon, items } = item;
    const hasItems = items && items.length > 0;
    const badge = this.getBadgeValue(id);
    const label = this._getLabel(item);
    const active = this.activePath.contains(id);

    let refItem = item;
    if (hasItems) {
      refItem = this.__getDefaultItemOf(item) || item;
    }

    const { url, destination } = refItem;

    return html` <a
        href="${url}"
        class="${classMap({
          link: true,
          'portal-navigation-tree-parent': isTreeMode,
          [PortalNavigation.classes.selected]: active,
        })}"
        target="${destination === 'extern' && !hasItems ? '_blank' : '_self'}"
        @click="${e => this.__onLink(e, menuId, item)}"
        >${this.__createLinkTemplate(label, icon, badge)}${isTreeMode && hasItems
          ? html`<span class="button"></span>`
          : html``}</a
      >
      ${isTreeMode && active && hasItems
        ? html`<div class="portal-navigation-tree-items">
            ${item.items.map(childItem => this.__createSecondLevelItemTemplate(menuId, item, childItem))}
          </div>`
        : html``}`;
  }

  __createCurrentItemsTemplate() {
    const parentItemId = this.activePath.getFirstLevelItemId();
    if (!parentItemId) {
      return html``;
    }

    const menuId = this.activePath.getMenuId();
    const activeParentItem = this.__configuration.getData([`menus::${menuId}`, `items::${parentItemId}`]);
    const hasCurrentItems = activeParentItem && activeParentItem.items && activeParentItem.items.length > 0;

    if (hasCurrentItems) {
      return html`<div class="portal-navigation-current">
        <div class="portal-navigation-content">
          ${activeParentItem.items.map(item => this.__createSecondLevelItemTemplate(menuId, activeParentItem, item))}
        </div>
      </div>`;
    }
    return html``;
  }

  __createSecondLevelItemTemplate(menuId, parentItem, item) {
    const { id, icon, url, destination } = item;
    const badge = this.getBadgeValue(id, url);
    const label = this._getLabel(item);
    const active = this.activePath.contains(id);

    return html`<a
      href="${url}"
      class="${classMap({ link: true, [PortalNavigation.classes.selected]: active })}"
      @click="${e => this.__onLink(e, menuId, parentItem, item)}"
      target="${destination === 'extern' ? '_blank' : '_self'}"
      >${this.__createLinkTemplate(label, icon, badge)}</a
    >`;
  }

  // eslint-disable-next-line class-methods-use-this
  __createLinkTemplate(label, icon, badge) {
    const result = [];
    if (icon) {
      result.push(html`<img src="${icon}" alt="" class="portal-navigation-icon" />`);
      if (badge) {
        result.push(html`<span class="badge">${badge}</span>`);
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
    PortalNavigation.menuIdsOrdered.forEach(menuId => {
      const menu = this.__configuration.getMenu(menuId);
      const hasItems = menu && menu.items && menu.items.length > 0;
      if (hasItems) {
        templates.push(menu.items.map(item => this.__createFirstLevelItemTemplate(menuId, item, true)));
      }
    });
    return templates;
  }

  __onLink(e, menuId, parentItem, item = undefined) {
    if (item) {
      if (this.__isInternalRouting(item)) {
        e.preventDefault();
        this.__internalLinkSelected(item.id);
        return undefined;
      }
      return undefined;
    }

    const hasItems = parentItem.items && parentItem.items.length > 0;
    const isInternal = this.__isInternalRouting(parentItem);
    if (hasItems) {
      // if the default item is external we don't want to honor this flag when clicking on a parent item
      if (isInternal || this.__getDefaultItemOf(parentItem).destination === 'extern') {
        e.preventDefault();
      }
      this.__setCurrentItems(menuId, parentItem);
      return undefined;
    }

    if (isInternal) {
      e.preventDefault();
      this.__internalLinkSelected(parentItem.id);
      return undefined;
    }

    return undefined;
  }

  __setCurrentItems(menuId, parentItem) {
    const item = this.__getDefaultItemOf(parentItem);

    const ignoreDefaultItem = item.destination === 'extern';

    this.activeDropdown = undefined;
    this.activePath = new IdPath(menuId, parentItem.id, item && !ignoreDefaultItem ? item.id : undefined);

    if (item && !ignoreDefaultItem) {
      this.dispatchEvent(
        new CustomEvent(PortalNavigation.events.routeTo, {
          detail: {
            url: item.url,
            label: item.label,
          },
          bubbles: true,
        }),
      );
    }
  }

  __internalLinkSelected(itemId) {
    const objectPath = this.__configuration.getObjectPathForSelection(object => object.id === itemId);

    const selectedItem = objectPath.getLastItem();
    const { url } = selectedItem;

    this.activeDropdown = undefined;
    this.activePath = objectPath.toIdPath();

    this.dispatchEvent(
      new CustomEvent(PortalNavigation.events.routeTo, {
        detail: {
          url,
          label: selectedItem.label,
        },
        bubbles: true,
      }),
    );
  }

  // eslint-disable-next-line class-methods-use-this
  __getDefaultItemOf(parentItem) {
    const { defaultItem, items } = parentItem;

    // there are no items to choose from
    if (Array.isArray(items) === false || items.length < 1) {
      return null;
    }

    // if no defaultItem is defined or it can't be found use the first item.
    return items.find(item => item.id === defaultItem) || items[0];
  }

  __isInternalRouting(item) {
    let refItem = item;
    if (item.items && item.items.length > 0) {
      refItem = this.__getDefaultItemOf(item);
    }

    // Allow global `internalRouting` to be overridden by the item specific `internalRouting` property
    const itemInternalRouting = 'internalRouting' in refItem ? refItem.internalRouting : this.internalRouting;

    // Bail if we're not routing internally…
    if (!itemInternalRouting) {
      return false;
    }

    // The current application does not matter, we route internally…
    if (!this.currentApplication) {
      return true;
    }

    // Current application was set, but item is not application specific…
    if (!('application' in refItem)) {
      // We check whether the current application is in the list of `internalRoutingApplications`
      return (
        'internalRoutingApplications' in refItem &&
        Array.prototype.includes.call(refItem.internalRoutingApplications, this.currentApplication)
      );
    }

    return refItem.application === this.currentApplication;
  }

  _getLabel(labelProvider) {
    let labelObj = labelProvider;
    if ('label' in labelProvider) {
      labelObj = labelProvider.label;
    }

    if (typeof labelObj === 'string') {
      return labelObj;
    }

    if (!labelObj || !this.lang) {
      return '';
    }

    if (this.lang in labelObj) {
      return labelObj[this.lang];
    }

    return '';
  }
}
