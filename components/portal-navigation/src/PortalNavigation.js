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

  static get groupIds() {
    return {
      main: 'main',
      meta: 'meta',
      profile: 'profile',
      logout: 'logout',
    };
  }

  static get groupIdsOrdered() {
    return Object.values(PortalNavigation.groupIds);
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
      activePath: { attribute: false }, // {groupId,menuId,itemId} - identifying the active item

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
    this.activePath = undefined;
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
   * Hides any active dropdowns when a click occurs outside of the dropdown or its group.
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

    // If the event path contains either the dropdown itself or its menu group, let's bail…
    const elementGroup = activeDropdownElement.closest('.portal-navigation-group');
    if (e.composedPath().includes(activeDropdownElement) || e.composedPath().includes(elementGroup)) {
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
    const newPath = this.__configuration.getPathFromUrl(this.activeUrl);
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
   * Set a badge value for a specific key. Groups will automatically look up badge values by their groupId. Items will
   * first check for badge values by using their id and then by using their url.
   *
   * @param {string} key - groupId or itemId or url
   * @param {*} value - the badge value (could be a l11n label object)
   */
  setBadgeValue(key, value) {
    // TODO: write to Store instead of temporary map
    this.temporaryBadgeValues.set(key, value);
    // @ts-ignore
    this._requestUpdate();
  }

  getBadgeValue(id, url) {
    // TODO: read from Store instead of temporary map
    let value = this.temporaryBadgeValues.get(id);
    if (!value) {
      value = this.temporaryBadgeValues.get(url);
    }
    if (value && typeof value === 'object' && value.constructor === Object) {
      return this._getLabel(value);
    }
    return value;
  }

  __toggleDropdown(e, groupId) {
    this.activeDropdown = this.activeDropdown ? undefined : groupId;
  }

  render() {
    return html`<div class="portal-navigation-container">
      <header class="portal-navigation-header">
        <div class="portal-navigation-logo"><slot name="logo"></slot></div>
        <div class="portal-navigation-slot-left"><slot name="left"></slot></div>
        <div class="portal-navigation-group-meta portal-navigation-group">
          ${this.__createGroupTemplate(PortalNavigation.groupIds.meta)}
        </div>
        <div class="portal-navigation-group-profile portal-navigation-group">
          ${this.__createGroupTemplate(PortalNavigation.groupIds.profile)}
        </div>
        <div class="portal-navigation-logout portal-navigation-group">
          ${this.__createGroupTemplate(PortalNavigation.groupIds.logout)}
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

      <main class="portal-navigation-group-main">
        <div class="portal-navigation-group-main-menus portal-navigation-group">
          <div class="portal-navigation-content">${this.__createGroupTemplate(PortalNavigation.groupIds.main)}</div>
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

  __createGroupTemplate(groupId) {
    const group = this.__configuration.getGroup(groupId);

    if (!group || !group.items || group.items.length <= 0) {
      return html``;
    }

    if (group && group.dropdown) {
      const badge = this.getBadgeValue(group.id);
      const label = this._getLabel(group);
      return html`<div class="first-level">
          <span
            class="${classMap({
              link: true,
              'dropdown-link': true,
              [PortalNavigation.classes.selected]: this._isActive(groupId),
            })}"
            @click="${e => this.__toggleDropdown(e, groupId)}"
            >${this.__createLinkTemplate(label, group.icon, badge)}</span
          >
        </div>
        <div class="dropdown ${classMap({ '-show': this.activeDropdown === groupId })}">
          ${group.items.map(item => this.__createFirstLevelItemTemplate(groupId, item))}
        </div>`;
    }
    return html`${group.items.map(item => this.__createFirstLevelItemTemplate(groupId, item))}`;
  }

  __createFirstLevelItemTemplate(groupId, item, isTreeMode = false) {
    const { id, icon, items } = item;
    const isMenu = items && items.length > 0;
    const badge = this.getBadgeValue(id);
    const label = this._getLabel(item);
    const active = this._isActive(id);

    let refItem = item;
    if (isMenu) {
      refItem = this.__getDefaultItemOf(item) || item;
    }

    const { url, destination } = refItem;

    return html`<div class="first-level">
        <a
          href="${url}"
          class="${classMap({
            link: true,
            'portal-navigation-tree-menu': isTreeMode,
            [PortalNavigation.classes.selected]: active,
          })}"
          target="${destination === 'extern' && !isMenu ? '_blank' : '_self'}"
          @click="${e => this.__onLink(e, groupId, item)}"
          >${this.__createLinkTemplate(label, icon, badge)}${isTreeMode && isMenu
            ? html`<span class="button"></span>`
            : html``}</a
        >
      </div>
      ${isTreeMode && active && isMenu
        ? html`<div class="portal-navigation-tree-menu-items">
            ${item.items.map(childItem => this.__createSecondLevelItemTemplate(groupId, item, childItem))}
          </div>`
        : html``}`;
  }

  __createCurrentItemsTemplate() {
    if (!this.activePath || !this.activePath.menuId) {
      return html``;
    }

    const { groupId, menuId } = this.activePath;
    const activeMenu = this.__configuration.getData(['groups', groupId, `items::${menuId}`]);

    if (activeMenu && activeMenu.items && activeMenu.items.length > 0) {
      return html`<div class="portal-navigation-current">
        <div class="portal-navigation-content">
          ${activeMenu.items.map(item => this.__createSecondLevelItemTemplate(groupId, activeMenu, item))}
        </div>
      </div>`;
    }
    return html``;
  }

  __createSecondLevelItemTemplate(groupId, menu, item) {
    const { id, icon, url, destination } = item;
    const badge = this.getBadgeValue(id, url);
    const label = this._getLabel(item);
    const active = this._isActive(id);

    return html`<a
      href="${url}"
      class="${classMap({ link: true, [PortalNavigation.classes.selected]: active })}"
      @click="${e => this.__onLink(e, groupId, menu, item)}"
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
    PortalNavigation.groupIdsOrdered.forEach(groupId => {
      const group = this.__configuration.getGroup(groupId);
      if (group && group.items && group.items.length > 0) {
        templates.push(group.items.map(item => this.__createFirstLevelItemTemplate(groupId, item, true)));
      }
    });
    return templates;
  }

  // ids of menu and items and names of groups must all be unique.
  _isActive(id) {
    return (
      this.activePath &&
      (id === this.activePath.groupId || id === this.activePath.menuId || id === this.activePath.itemId)
    );
  }

  __onLink(e, groupId, menu, item = undefined) {
    if (item) {
      if (this.__isInternalRouting(item)) {
        e.preventDefault();
        this.__internalLinkSelected(groupId, menu, item);
        return undefined;
      }
      return undefined;
    }

    const hasItems = menu.items && menu.items.length > 0;
    const isInternal = this.__isInternalRouting(menu);
    if (hasItems) {
      // if the default item of the menu is external we don't want to honor this flag when clicking on a menu
      if (isInternal || this.__getDefaultItemOf(menu).destination === 'extern') {
        e.preventDefault();
      }
      this.__setCurrentItems(groupId, menu);
      return undefined;
    }

    if (isInternal) {
      e.preventDefault();
      this.__internalLinkSelected(groupId, menu);
      return undefined;
    }

    return undefined;
  }

  __setCurrentItems(groupId, menu) {
    const item = this.__getDefaultItemOf(menu);

    const ignoreDefaultItem = item.destination === 'extern';

    this.activeDropdown = undefined;
    this.activePath = { groupId, menuId: menu.id, itemId: item && !ignoreDefaultItem ? item.id : undefined };

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

  __internalLinkSelected(groupId, menu, item) {
    const url = item ? item.url : menu.url;

    this.activeDropdown = undefined;
    this.activePath = { groupId, menuId: menu.id, itemId: item ? item.id : undefined };

    this.dispatchEvent(
      new CustomEvent(PortalNavigation.events.routeTo, {
        detail: {
          url,
          label: item ? item.label : menu.label,
        },
        bubbles: true,
      }),
    );
  }

  // eslint-disable-next-line class-methods-use-this
  __getDefaultItemOf(menu) {
    const { defaultItem, items } = menu;

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
