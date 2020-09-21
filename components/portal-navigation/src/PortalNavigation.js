/**
 * @typedef { import("lit-element").CSSResult } CSSResult
 * @typedef { import("lit-element").CSSResultArray } CSSResultArray
 * @typedef { import("lit-html").TemplateResult } TemplateResult
 */
import { html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { baseStyles } from '../../helpers/baseStyles.js';
import { portalNavigationStyles } from './portalNavigationStyles.js';
import { Configuration } from './Configuration.js';
import '../../portal-hamburger-menu/portal-hamburger-menu.js';
import { IdPath } from './IdPath.js';

/**
 * A component implementing an opinionated (but generic and hence configurable) navigation pattern.
 *
 * @fires 'portal-navigation.routeTo' - Event fired when an item with a url is clicked and the routig is done internally.
 * @fires 'portal-navigation.setLanguage' - Event fired when the 'lang' property changes.
 * @fires 'portal-navigation.configured' - Event fired when the configuration has been successfully loaded.
 *
 * @listens 'portal-navigation.setBadgeValue' - Listens to event that change the badge value of an item or menu and sets that value accordingly.
 *
 * @prop {IdPath} activePath - the current path of "active" items. e.g. if an item in level 2 is clicked it's parent item and the corresponding menu would be considered "active".
 * @prop {string} src - location from where to fetch configuration data file.
 * @prop {string} lang - the current language. e.g. 'en' or 'de'.
 * @prop {string} activeUrl - you can use this to set the active path via the url of an item.
 * @prop {string} currentApplication - the current application. Items change their routing behavior based on whether their application property matches this property or not.
 * @prop {boolean} internalRouting - true if items, by default, should route internally. Items may override this default in their own configuration. Default is false.
 *
 * @cssprop {color} [--portal-navigation-color-primary=#2c3e50]
 * @cssprop {color} [--portal-navigation-color-secondary=rgb(66, 136, 245)]
 * @cssprop {color} [--portal-navigation-color-selected=var(--portal-navigation-color-secondary)]
 * @cssprop {color} [--portal-navigation-color-hover=var(--portal-navigation-color-secondary)]
 * @cssprop {color} [--portal-navigation-color-badge=white]
 * @cssprop {color} [--portal-navigation-color-badge-background=var(--portal-navigation-color-secondary)]
 * @cssprop {color} [--portal-navigation-color-dropdown-background=white]
 * @cssprop {color} [--portal-navigation-color-border=rgba(44, 62, 80, 0.1)]
 * @cssprop {color} [--portal-navigation-color-header-background=rgba(66, 135, 245, 0.1)]
 * @cssprop {length} [--portal-navigation-font-size=1.25rem]
 * @cssprop {length} [--portal-navigation-font-size-badge=1rem]
 * @cssprop {length} [--portal-navigation-font-size-tree-second-level=1rem]
 */
// @ts-ignore
export class PortalNavigation extends LitElement {
  /**
   * @returns {CSSResult[]}
   */
  static get styles() {
    return [baseStyles, portalNavigationStyles];
  }

  /**
   * A listing of any existing default values.
   *
   * @returns {{language: string}}
   */
  static get defaults() {
    return {
      language: 'en',
    };
  }

  /**
   * A listing of key menu ids that are handled specifically by the portal navigation component.
   *
   * @returns {{logout: string, meta: string, profile: string, main: string}}
   */
  static get menuIds() {
    return {
      /**
       * The 'main' menu's items will be displayed in the second row.
       */
      main: 'main',
      /**
       * The 'meta' menu's items will be displayed in the top row on the left of 'profile' menu.
       */
      meta: 'meta',
      /**
       * The 'profile' menu's items will be displayed in the top row on the left of 'logout' menu.
       */
      profile: 'profile',
      /**
       * The 'meta' menu's items will be displayed in the top row on the very right.
       */
      logout: 'logout',
    };
  }

  /**
   * A specifically handled menu ids in the order they will be displayed in the hamburger menu.
   *
   * @returns {string[]}
   */
  static get menuIdsOrdered() {
    return Object.values(PortalNavigation.menuIds);
  }

  /**
   * A listing of events this components fires or listens to.
   *
   * @returns {{routeTo: string, setBadgeValue: string, setLanguage: string, configured: string}}
   */
  static get events() {
    const ns = 'portal-navigation';

    return {
      routeTo: `${ns}.routeTo`,
      setLanguage: `${ns}.setLanguage`,
      setBadgeValue: `${ns}.setBadgeValue`,
      configured: `${ns}.configured`,
    };
  }

  /**
   * A listing of css classes that are frequently used in a generic manner.
   *
   * @returns {{selected: string}}
   */
  static get classes() {
    return {
      selected: '-selected',
    };
  }

  static get properties() {
    return {
      src: { type: String },
      lang: { type: String },
      activeUrl: { type: String },
      currentApplication: { type: String },
      internalRouting: { type: Boolean },

      /**
       * @private
       */
      activePath: { attribute: false },

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
    this.configuration = new Configuration();

    // Make sure global (document / window) listeners are bound to `this`, otherwise we cannot properly remove them
    // @see https://open-wc.org/faq/events.html#on-elements-outside-of-your-element
    this.__setBadgeValueEventListener = this.__setBadgeValueEventListener.bind(this);
    this.__globalClickListener = this.__globalClickListener.bind(this);
  }

  connectedCallback() {
    // @ts-ignore
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    if (this.src) {
      this.__fetchRemoteData();
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

  disconnectedCallback() {
    // Remove existing global listeners
    document.removeEventListener(PortalNavigation.events.setBadgeValue, this.__setBadgeValueEventListener);
    document.removeEventListener('click', this.__globalClickListener);

    // @ts-ignore
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }

  updated(_changedProperties) {
    super.updated(_changedProperties);

    if (_changedProperties.has('lang')) {
      this.dispatchEvent(new CustomEvent(PortalNavigation.events.setLanguage, { detail: this.lang, bubbles: true }));
    }
  }

  requestUpdateInternal(name, oldValue, options) {
    super.requestUpdateInternal(name, oldValue, options);

    if (name === 'activeUrl' && oldValue !== this.activeUrl) {
      this.__updateActivePathFromUrl();
    }
  }

  render() {
    return html`<div class="portal-navigation-container">
      <header class="portal-navigation-header">
        <div class="portal-navigation-slot-logo">${this._createLogoSlotTemplate()}</div>
        <div class="portal-navigation-slot-left">${this._createLeftSlotTemplate()}</div>
        <div class="portal-navigation-menu-meta portal-navigation-menu">${this._createMenuTemplate(PortalNavigation.menuIds.meta)}</div>
        <div class="portal-navigation-menu-profile portal-navigation-menu">${this._createMenuTemplate(PortalNavigation.menuIds.profile)}</div>
        <div class="portal-navigation-menu-logout portal-navigation-menu">${this._createMenuTemplate(PortalNavigation.menuIds.logout)}</div>
        <div class="portal-navigation-slot-right">${this._createRightSlotTemplate()}</div>
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
          <div class="portal-navigation-content">${this._createMenuTemplate(PortalNavigation.menuIds.main)}</div>
        </div>
        ${this._createCurrentItemsTemplate()}
        <!-- Hamburger Menu Tree Elements -->
        ${this.hamburgerMenuExpanded ? html`<div class="portal-navigation-tree-container">${this._createTreeTemplate()}</div>` : html``}
      </main>
    </div>`;
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
    const activeDropdownElement = this.shadowRoot && this.shadowRoot.querySelector('.dropdown.-show');
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

  /**
   * Fetches the configuration data from the source provided by 'src' and initializes the configuration.
   *
   * @private
   */
  __fetchRemoteData() {
    this.configuration = new Configuration();

    fetch(this.src)
      .then(response => {
        return response.json();
      })
      .then(data => {
        try {
          this.configuration = new Configuration(data);
          this.dispatchEvent(new CustomEvent(PortalNavigation.events.configured, { detail: this.configuration, bubbles: true }));
          this.__updateActivePathFromUrl();
          this.requestUpdateInternal();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(e);
        }
      });
  }

  /**
   * Updates the active path from the current 'activeUrl'.
   *
   * @private
   */
  __updateActivePathFromUrl() {
    const newPath = this.configuration.getIdPathForUrl(this.activeUrl);
    if (newPath) {
      this.activePath = newPath;
    }
  }

  /**
   * Listener function that processes a setBadgeValue event.
   *
   * @param e
   * @private
   */
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
    this.requestUpdateInternal();
  }

  /**
   * Checks for a badge for the given id. The url is only checked if no badge value was found for the id.
   *
   * @param {string} id - a menuId or itemId
   * @param {string | undefined} url - a url of an item
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

  /**
   * Override to make use of the slot in extension.
   * @returns {TemplateResult}
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _createLogoSlotTemplate() {
    return html`<slot name="logo"></slot>`;
  }

  /**
   * Override to make use of the slot in extension.
   * @returns {TemplateResult}
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _createLeftSlotTemplate() {
    return html`<slot name="left"></slot>`;
  }

  /**
   * Override to make use of the slot in extension.
   * @returns {TemplateResult}
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _createRightSlotTemplate() {
    return html`<slot name="right"></slot>`;
  }

  /**
   * Creates the html template for a given menu id. This is basically providing a container which the menu's
   * items as first-level citizens in it or a dropdown link if the menu should be configured as a dropdown.
   *
   * @param menuId the menu id for which to build a menu html template.
   * @returns {TemplateResult}
   * @protected
   */
  _createMenuTemplate(menuId) {
    const menu = this.configuration.getMenu(menuId);

    if (!menu || !menu.items || menu.items.length <= 0) {
      return html``;
    }

    if (menu && menu.dropdown) {
      const badge = this.getBadgeValue(menu.id);
      const label = this._getLabel(menu);
      return html` <span
          part="${menuId}"
          class="${classMap({
            link: true,
            'dropdown-link': true,
            [PortalNavigation.classes.selected]: this.activePath.contains(menuId),
          })}"
          @click="${e => this.__toggleDropdown(e, menuId)}"
          >${this._createLinkTemplate(menuId, label, menu.icon, badge)}</span
        >
        <div class="dropdown ${classMap({ '-show': this.activeDropdown === menuId })}">${menu.items.map(item => this._createFirstLevelItemTemplate(menuId, item))}</div>`;
    }
    return html`${menu.items.map(item => this._createFirstLevelItemTemplate(menuId, item))}`;
  }

  /**
   * Creates the html template for items residing at first-level. These can be items with or without children.
   *
   * @param menuId the menuId associated with the given item.
   * @param item the item to be rendered.
   * @param isTreeMode whether this template should be provided for tree mode (hamburger menu) or default display purposes.
   * @returns {TemplateResult}
   * @protected
   */
  _createFirstLevelItemTemplate(menuId, item, isTreeMode = false) {
    const { id, icon, items } = item;
    const hasItems = items && items.length > 0;
    const badge = this.getBadgeValue(id);
    const label = this._getLabel(item);
    const active = this.activePath.contains(id);

    let refItem = item;
    if (hasItems) {
      refItem = this._getDefaultItemOf(item) || item;
    }

    const { url, destination } = refItem;

    return html` <a
        href="${url}"
        part="${refItem.id}"
        class="${classMap({
          link: true,
          'portal-navigation-tree-parent': isTreeMode,
          [PortalNavigation.classes.selected]: active,
        })}"
        target="${destination === 'extern' && !hasItems ? '_blank' : '_self'}"
        @click="${e => this._onLink(e, item)}"
        >${this._createLinkTemplate(refItem.id, label, icon, badge)}${isTreeMode && hasItems ? html`<span class="button"></span>` : html``}</a
      >
      ${isTreeMode && active && hasItems ? html`<div class="portal-navigation-tree-items">${item.items.map(childItem => this._createSecondLevelItemTemplate(menuId, item, childItem))}</div>` : html``}`;
  }

  /**
   * Creates the html template for the third row (second-level), which displays only if the active path
   * has a first-level item selection and that item has child items.
   *
   * @returns {TemplateResult}
   * @protected
   */
  _createCurrentItemsTemplate() {
    const parentItemId = this.activePath.getFirstLevelItemId();
    if (!parentItemId) {
      return html``;
    }

    const menuId = this.activePath.getMenuId();
    const activeParentItem = this.configuration.getData([`menus::${menuId}`, `items::${parentItemId}`]);
    const hasCurrentItems = activeParentItem && activeParentItem.items && activeParentItem.items.length > 0;

    if (hasCurrentItems) {
      return html`<div class="portal-navigation-current">
        <div class="portal-navigation-content">${activeParentItem.items.map(item => this._createSecondLevelItemTemplate(menuId, activeParentItem, item))}</div>
      </div>`;
    }
    return html``;
  }

  /**
   * Creates the html template for second-level items, which can either be in the third row (current items)
   * or second-level in tree mode (hamburger menu).
   *
   * @param menuId the menu item associated with the parent item and item.
   * @param parentItem the parent item of the item.
   * @param item the item for which to create a html template.
   * @returns {TemplateResult}
   * @protected
   */
  _createSecondLevelItemTemplate(menuId, parentItem, item) {
    const { id, icon, url, destination } = item;
    const badge = this.getBadgeValue(id, url);
    const label = this._getLabel(item);
    const active = this.activePath.contains(id);

    return html`<a href="${url}" part="${id}" class="${classMap({ link: true, [PortalNavigation.classes.selected]: active })}" @click="${e => this._onLink(e, item)}" target="${destination === 'extern' ? '_blank' : '_self'}"
      >${this._createLinkTemplate(id, label, icon, badge)}</a
    >`;
  }

  /**
   * Create a simple html template for a link. All menu and item templates use this template to display
   * the label, icon and badge value.
   *
   * @param {string} id - the id of the link (used to create named css classes and parts).
   * @param {string} label - the label to be displayed. Either label or icon must be present (or both).
   * @param {string} icon - the icon to be displayed. Either label or icon must be present (or both).
   * @param {string} badge - the badge value to be displayed. If undefined, no badge will be displayed. If there is an icon,
   * the badge will be associated with the icon. Otherwise it will be associated with the label.
   * @returns {TemplateResult[]}
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _createLinkTemplate(id, label, icon, badge) {
    const result = [];
    if (icon) {
      result.push(html`<img src="${icon}" alt="" part="${`${id}-icon`}" class="portal-navigation-icon" />`);
      if (badge) {
        result.push(html`<span part="${`${id}-badge`}" class="badge">${badge}</span>`);
      }
    }
    if (label) {
      result.push(html`<span part="${`${id}-label`}">${label}</span>`);
      if (!icon && badge) {
        result.push(html`<span part="${`${id}-badge`}" class="badge">${badge}</span>`);
      }
    }
    return result;
  }

  /**
   * Creates the html template for tree mode (hamburger menu).
   * You may override this to customize the order and elements of the tree structure for the hamburger menu.
   *
   * @returns {TemplateResult[]}
   * @protected
   */
  _createTreeTemplate() {
    const templates = [];
    PortalNavigation.menuIdsOrdered.forEach(menuId => {
      const menu = this.configuration.getMenu(menuId);
      const hasItems = menu && menu.items && menu.items.length > 0;
      if (hasItems) {
        templates.push(menu.items.map(item => this._createFirstLevelItemTemplate(menuId, item, true)));
      }
    });
    return templates;
  }

  /**
   * Callback that controls the behavior when clicking on any link (except links to open a dropdown).
   *
   * @param {*} e - the click event.
   * @param {*} item - the item being clicked.
   * @returns {undefined}
   * @protected
   */
  _onLink(e, item) {
    if (!item) {
      return undefined;
    }

    const hasItems = item.items && item.items.length > 0;
    const internalRouting = this._isInternalRouting(item);

    if (!hasItems) {
      if (internalRouting) {
        e.preventDefault();
        this._internalLinkSelected(item.id);
        return undefined;
      }
      return undefined;
    }

    // if the default item is external we don't want to honor this flag when clicking on a parent item
    if (internalRouting || this._getDefaultItemOf(item).destination === 'extern') {
      e.preventDefault();
    }
    this._internalLinkSelected(item.id);
    return undefined;
  }

  /**
   * Checks whether an item should be routed internally or not.
   *
   * @param item the item to check.
   * @returns {boolean} true if the item is internal.
   * @protected
   */
  _isInternalRouting(item) {
    let refItem = item;
    if (item.items && item.items.length > 0) {
      refItem = this._getDefaultItemOf(item);
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
      return 'internalRoutingApplications' in refItem && Array.prototype.includes.call(refItem.internalRoutingApplications, this.currentApplication);
    }

    return refItem.application === this.currentApplication;
  }

  /**
   * Handles the behavior of an internal link being selected. Basically updates the active path.
   *
   * @param itemId the item being selected.
   * @protected
   */
  _internalLinkSelected(itemId) {
    const objectPath = this.configuration.getObjectPathForSelection(object => object.id === itemId);
    const selectedItem = objectPath.getLastItem();
    const hasItems = selectedItem.items && selectedItem.items.length > 0;

    this.activeDropdown = undefined;

    let refItem = selectedItem;
    let dispatchEvent = true;
    if (hasItems) {
      refItem = this._getDefaultItemOf(selectedItem);
      dispatchEvent = refItem && refItem.destination !== 'extern';
      this.activePath = objectPath.toIdPath().concat(dispatchEvent ? refItem.id : undefined);
    } else {
      this.activePath = objectPath.toIdPath();
    }

    if (dispatchEvent) {
      this.dispatchEvent(
        new CustomEvent(PortalNavigation.events.routeTo, {
          detail: {
            url: refItem.url,
            label: refItem.label,
          },
          bubbles: true,
        }),
      );
    }
  }

  /**
   * Returns the default item of a given item or the first child item if no default item is defined or undefined if
   * no child items exist.
   *
   * @param item the item whose default item should be found.
   * @returns {undefined|*} the default item of the given item or undefined if no child items exist.
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _getDefaultItemOf(item) {
    const { defaultItem, items } = item;

    // there are no items to choose from
    if (Array.isArray(items) === false || items.length < 1) {
      return null;
    }

    // if no defaultItem is defined or it can't be found use the first item.
    return items.find(childItem => childItem.id === defaultItem) || items[0];
  }

  /**
   * Returns the proper label for the given labelProvider. A labelProvider is either a simple string (the label itself)
   * or it is an object with country code keys and associated label values: e.g. { 'en': 'Back', 'de': 'Zurück'}
   * It may also be an object with a property 'label' that contains one of the above values.
   *
   * @param labelProvider the raw label (localized labels array) or simple label or an object containing this
   * information within a property 'label'.
   * @returns {string}
   * @protected
   */
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
