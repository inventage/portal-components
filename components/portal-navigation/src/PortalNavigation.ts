import { CSSResultArray, html, internalProperty, LitElement, property, TemplateResult } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { baseStyles } from '../../../common/baseStyles';
import { styles } from './styles-css';
import { Configuration, MenuItem, MenuLabel } from './Configuration';
import { ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements';
import { PortalHamburgerMenu } from '../../portal-hamburger-menu';
import { IdPath } from './IdPath';
import { PropertyValues } from 'lit-element/lib/updating-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import { nothing } from 'lit-html';
import { Nothing } from '../../../common/utils';

/**
 * A listing of key menu ids that are handled specifically by the portal navigation component.
 */
const NavigationMenus = {
  /**
   * The 'main' menu's items will be displayed in the second row.
   */
  main: 'main',

  /**
   * The 'settings' menu's items will be displayed next to the 'main' menu's items (to the right).
   */
  settings: 'settings',

  /**
   * The 'meta' menu's items will be displayed in the top row on the left of 'profile' menu.
   */
  meta: 'meta',

  /**
   * The 'profile' menu's items will be displayed in the top row on the left of 'logout' menu.
   */
  profile: 'profile',

  /**
   * The 'logout' menu's items will be displayed in the top row on the very right.
   */
  logout: 'logout',
} as const;

type NavigationMenus = typeof NavigationMenus;
type NavigationMenuNames = keyof typeof NavigationMenus;

const NavigationEventNamespace = 'portal-navigation';

const NavigationEvents = {
  routeTo: `${NavigationEventNamespace}.routeTo`,
  setLanguage: `${NavigationEventNamespace}.setLanguage`,
  setBadgeValue: `${NavigationEventNamespace}.setBadgeValue`,
  configured: `${NavigationEventNamespace}.configured`,
  breakpointChanged: `${NavigationEventNamespace}.breakpointChanged`,
} as const;

type NavigationEvents = typeof NavigationEvents;

const NavigationCssClasses = {
  selected: 'selected',
} as const;

type NavigationCssClasses = typeof NavigationCssClasses;

/**
 * A component implementing an opinionated (but generic and hence configurable) navigation pattern.
 *
 * @fires 'portal-navigation.routeTo' - Event fired when an item with a url is clicked and the routing is done internally.
 * @fires 'portal-navigation.setLanguage' - Event fired when the 'lang' property changes.
 * @fires 'portal-navigation.configured' - Event fired when the configuration has been successfully loaded.
 * @fires 'portal-navigation.breakpointChanged' - Event fired when the mobile breakpoint media query state changes.
 *
 * @listens 'portal-navigation.setBadgeValue' - Listens to event that change the badge value of an item or menu and sets that value accordingly.
 *
 * @cssprop {color} [--portal-navigation-color-primary=#555]
 * @cssprop {color} [--portal-navigation-color-secondary=rgb(66, 136, 245)]
 * @cssprop {color} [--portal-navigation-color-link=var(--portal-navigation-color-primary)]
 * @cssprop {color} [--portal-navigation-color-link-breakpoint=var(--portal-navigation-color-primary)]
 * @cssprop {color} [--portal-navigation-color-link-dropdown=var(--portal-navigation-color-primary)]
 * @cssprop {color} [--portal-navigation-color-link-current=var(--portal-navigation-color-link)]
 * @cssprop {color} [--portal-navigation-color-selected=var(--portal-navigation-color-secondary)]
 * @cssprop {color} [--portal-navigation-color-hover=var(--portal-navigation-color-secondary)]
 * @cssprop {color} [--portal-navigation-color-hover-dropdown=var(--portal-navigation-color-hover)]
 * @cssprop {color} [--portal-navigation-color-hover-current=var(--portal-navigation-color-hover)]
 * @cssprop {color} [--portal-navigation-color-badge=white]
 * @cssprop {color} [--portal-navigation-color-badge-background=var(--portal-navigation-color-secondary)]
 * @cssprop {color} [--portal-navigation-color-dropdown-background=white]
 * @cssprop {color} [--portal-navigation-color-border=rgba(44, 62, 80, 0.1)]
 * @cssprop {color} [--portal-navigation-color-header-background=rgba(66, 135, 245, 0.1)]
 * @cssprop {color} [--portal-navigation-color-meta-bar-background=rgba(66, 135, 245, 0.2)]
 *
 * @cssprop {length} [--portal-navigation-font-size=1.25rem]
 * @cssprop {length} [--portal-navigation-font-size-badge=1rem]
 * @cssprop {length} [--portal-navigation-font-size-tree-second-level=1rem]
 *
 * @cssprop {length} [--portal-navigation-horizontal-base=1rem]
 * @cssprop {length} [--portal-navigation-vertical-base=0.5rem]
 *
 * @cssprop {length} [--portal-navigation-max-width=1200px]
 *
 * @cssprop [--portal-navigation-font-family=sans-serif]
 *
 * @csspart hamburger-menu - The hamburger menu element (shown in mobile breakpoint)
 * @csspart slot-header-mobile - Slot element wrapper between the hamburger menu element and the logo slot
 * @csspart menu-main-items - Element wrapper for the main menu items (1st level)
 *
 * @slot logo - The slot for the logo
 * @slot right - The right slot
 * @slot left - The left slot
 * @slot meta-left - The left slot inside the meta bar
 * @slot meta-right - The right slot inside the meta bar
 * @slot header-mobile - The slot rendered in the top bar in the mobile breakpoint
 * @slot tree-bottom - The slot rendered at the bottom of the menu tree (mobile breakpoint)
 *
 * TODO: kebab-cased attributes
 */
export class PortalNavigation extends ScopedElementsMixin(LitElement) {
  /**
   * Location from where to fetch configuration data file.
   */
  @property()
  src?: string;

  /**
   * The current language. e.g. 'en' or 'de'.
   */
  @property()
  language = 'en';

  /**
   * You can use this to set the active path via the url of an item.
   */
  @property()
  activeUrl?: string;

  /**
   * The current application. Items change their routing behavior based on whether their application property matches this property or not.
   */
  @property()
  currentApplication?: string;

  /**
   * True if items, by default, should route internally. Items may override this default in their own configuration. Default is false.
   */
  @property({ type: Boolean })
  internalRouting = false;

  /**
   * Controls whether the logout menu will be displayed in the meta bar.
   */
  @property({ type: Boolean })
  logoutMenuInMetaBar = false;

  /**
   * Controls whether the logout menu will be displayed in the mobile header bar (in mobile breakpoint).
   */
  @property({ type: Boolean })
  logoutMenuInMobileHeader = false;

  /**
   * Viewport width at which navigation switches from/to the mobile breakpoint.
   */
  @property({ type: Number })
  mobileBreakpoint = 800;

  /**
   * The current path of "active" items. e.g. if an item in level 2 is clicked it's parent item and the corresponding menu would be considered "active"
   *
   * @private
   */
  @internalProperty()
  private activePath = new IdPath();

  @internalProperty()
  private hamburgerMenuExpanded = false;

  @internalProperty()
  private activeDropdown?: string;

  @internalProperty()
  private isMobileBreakpoint = false;

  private temporaryBadgeValues = new Map();

  private configuration = new Configuration();

  static get scopedElements(): ScopedElementsMap {
    return {
      'portal-hamburger-menu': PortalHamburgerMenu,
    };
  }

  static get styles(): CSSResultArray {
    return [baseStyles, styles];
  }

  /**
   * A listing of key menu ids that are handled specifically by the portal navigation component.
   */
  static get menuIds(): NavigationMenus {
    return NavigationMenus;
  }

  /**
   * A specifically handled menu ids in the order they will be displayed in the hamburger menu.
   */
  static get menuIdsOrdered(): NavigationMenuNames[] {
    return Object.values(PortalNavigation.menuIds);
  }

  /**
   * A listing of events this components fires or listens to.
   */
  static get events(): NavigationEvents {
    return NavigationEvents;
  }

  /**
   * A listing of css classes that are frequently used in a generic manner.
   */
  static get classes(): NavigationCssClasses {
    return NavigationCssClasses;
  }

  constructor() {
    super();

    // Make sure global (document / window) listeners are bound to `this`, otherwise we cannot properly remove them
    // @see https://open-wc.org/faq/events.html#on-elements-outside-of-your-element
    this.__setBadgeValueEventListener = this.__setBadgeValueEventListener.bind(this);
    this.__globalClickListener = this.__globalClickListener.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback && super.connectedCallback();

    if (this.src) {
      this.__fetchRemoteData();
    }

    const parsedUrl = new URL(window.location.href);
    if (parsedUrl && parsedUrl.pathname && parsedUrl.pathname !== '/') {
      const { pathname } = parsedUrl;
      this.activeUrl = pathname;
    }

    // Register global listeners
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.addEventListener(PortalNavigation.events.setBadgeValue, this.__setBadgeValueEventListener);
    document.addEventListener('click', this.__globalClickListener);
  }

  disconnectedCallback(): void {
    // Remove existing global listeners
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.removeEventListener(PortalNavigation.events.setBadgeValue, this.__setBadgeValueEventListener);
    document.removeEventListener('click', this.__globalClickListener);

    super.disconnectedCallback && super.disconnectedCallback();
  }

  updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (changedProperties.has('language')) {
      this.dispatchEvent(new CustomEvent(PortalNavigation.events.setLanguage, { detail: this.language, bubbles: true }));
    }

    if (changedProperties.has('mobileBreakpoint')) {
      const mql = window.matchMedia(`screen and (max-width: ${this.mobileBreakpoint}px)`);
      this.isMobileBreakpoint = mql.matches;
      this.dispatchEvent(new CustomEvent(PortalNavigation.events.breakpointChanged, { detail: this.isMobileBreakpoint }));
      mql.addEventListener('change', e => {
        this.isMobileBreakpoint = e.matches;
        this.dispatchEvent(new CustomEvent(PortalNavigation.events.breakpointChanged, { detail: this.isMobileBreakpoint }));
      });
    }

    if (changedProperties.has('activeUrl')) {
      this.__updateActivePathFromUrl();
    }
  }

  render(): TemplateResult | Nothing {
    if (!this.src) {
      return nothing;
    }

    return html` <div class="container ${classMap({ '-mobile': this.isMobileBreakpoint, '-mobile-header-logout': this.logoutMenuInMobileHeader })}">
      <div class="meta-bar ${classMap({ hidden: !this.hamburgerMenuExpanded })}">
        <div class="container-max-width inner">
          <div class="slot-meta-left"><slot name="meta-left"></slot></div>
          ${this.logoutMenuInMetaBar && !(this.isMobileBreakpoint && this.logoutMenuInMobileHeader) ? html`<div class="menu-logout menu-logout-meta menu">${this._createMenuTemplate(PortalNavigation.menuIds.logout)}</div>` : nothing}
          <div class="slot-meta-right"><slot name="meta-right"></slot></div>
        </div>
      </div>
      <header class="navigation-header">
        <div class="container-max-width inner">
          <div class="slot-logo"><slot name="logo"></slot></div>
          <div class="slot-left"><slot name="left"></slot></div>
          <div class="slot-header-mobile" part="slot-header-mobile"><slot name="header-mobile"></slot></div>
          <div class="menu-meta menu">${this._createMenuTemplate(PortalNavigation.menuIds.meta)}</div>
          <div class="menu-profile menu">${this._createMenuTemplate(PortalNavigation.menuIds.profile)}</div>
          ${!this.logoutMenuInMetaBar || (this.isMobileBreakpoint && this.logoutMenuInMobileHeader) ? html`<div class="menu-logout menu">${this._createMenuTemplate(PortalNavigation.menuIds.logout)}</div>` : nothing}
          <div class="slot-right"><slot name="right"></slot></div>
          <!-- Hamburger Menu Tree Elements -->
          <portal-hamburger-menu
            class="header-toggle"
            part="hamburger-menu"
            .toggled="${this.hamburgerMenuExpanded}"
            @state-changed="${(e: CustomEvent) => {
              this.hamburgerMenuExpanded = e.detail;
            }}"
          ></portal-hamburger-menu>
        </div>
      </header>

      <main class="menu-main">
        <div class="container-max-width inner">
          <div class="menu-main-items menu" part="menu-main-items">
            <div class="navigation-content">${this._createMenuTemplate(PortalNavigation.menuIds.main)} ${this._createMenuTemplate(PortalNavigation.menuIds.settings)}</div>
          </div>
          ${this._createCurrentItemsTemplate()}
          <!-- Hamburger Menu Tree Elements -->
          ${this.hamburgerMenuExpanded
            ? html` <div class="tree-container">
                ${this._createTreeTemplate()}
                <div class="slot-tree-bottom"><slot name="tree-bottom"></slot></div>
              </div>`
            : nothing}
        </div>
      </main>
    </div>`;
  }

  /**
   * Hides any active dropdowns when a click occurs outside of the dropdown or its menu.
   */
  private __globalClickListener(e: Event) {
    if (!this.activeDropdown || !e.composed) {
      return;
    }

    // At this point, there should be an open dropdown
    const activeDropdownElement = this.shadowRoot && this.shadowRoot.querySelector('.dropdown.-show');
    if (!activeDropdownElement) {
      return;
    }

    // If the event path contains either the dropdown itself or its menu, let's bail…
    const elementMenu = activeDropdownElement.closest('.menu');
    if (e.composedPath().includes(activeDropdownElement) || e.composedPath().includes(elementMenu!)) {
      return;
    }

    // Click was outside of target elements, let's hide the currently active dropdown
    this.activeDropdown = undefined;
  }

  /**
   * Fetches the configuration data from the source provided by 'src' and initializes the configuration.
   */
  private __fetchRemoteData() {
    if (!this.src) {
      return;
    }

    (async () => {
      try {
        const oldConfiguration = this.configuration;
        const response = await fetch(this.src!);
        const data = await response.json();

        this.configuration = new Configuration(data);
        this.dispatchEvent(new CustomEvent(PortalNavigation.events.configured, { detail: this.configuration }));
        this.__updateActivePathFromUrl();
        this.requestUpdateInternal('configuration', oldConfiguration);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('An error occurred when fetching remote data…', e);
      }
    })();
  }

  /**
   * Updates the active path from the current 'activeUrl'.
   */
  private __updateActivePathFromUrl() {
    const newPath = this.configuration.getIdPathForUrl(this.activeUrl);
    if (!newPath) {
      return;
    }

    this.activePath = newPath;
  }

  /**
   * Listener function that processes a setBadgeValue event.
   */
  private __setBadgeValueEventListener(e: CustomEvent) {
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
  setBadgeValue(key: string, value: unknown): void {
    // TODO: write to Store instead of temporary map
    this.temporaryBadgeValues.set(key, value);
    this.requestUpdateInternal();
  }

  /**
   * Checks for a badge for the given id. The url is only checked if no badge value was found for the id.
   *
   * @param id - a menuId or itemId
   * @param url - a url of an item
   *
   * @returns the badge value associated with the id or url or undefined if none exists.
   */
  getBadgeValue(id: string, url?: string): string | undefined {
    // TODO: read from Store instead of temporary map
    let value = this.temporaryBadgeValues.get(id);
    if (!value && url) {
      value = this.temporaryBadgeValues.get(url);
    }

    if (value && typeof value === 'object' && value.constructor === Object) {
      return this.__getLabel(value);
    }

    return value;
  }

  private __toggleDropdown(menuId: string): void {
    this.activeDropdown = this.activeDropdown ? undefined : menuId;
  }

  /**
   * Creates the html template for a given menu id. This is basically providing a container which the menu's
   * items as first-level citizens in it or a dropdown link if the menu should be configured as a dropdown.
   *
   * @param menuId the menu id for which to build a menu html template.
   */
  private _createMenuTemplate(menuId: string): TemplateResult | Nothing {
    const menu = this.configuration.getMenu(menuId);
    if (!menu || !menu.items || menu.items.length <= 0) {
      return nothing;
    }

    if (menu && menu.dropdown) {
      const badge = this.getBadgeValue(menu.id!);
      const label = this.__getLabel(menu);
      return html` <span
          part="menu-${menuId}"
          class="${classMap({
            link: true,
            'dropdown-link': true,
            [PortalNavigation.classes.selected]: this.activePath.contains(menuId),
          })}"
          @click="${() => this.__toggleDropdown(menuId)}"
          >${PortalNavigation._createLinkTemplate(menuId, label, menu.icon, badge)}</span
        >
        <div class="dropdown ${classMap({ '-show': this.activeDropdown === menuId })}">${menu.items.map(item => this._createFirstLevelItemTemplate(item))}</div>`;
    }

    return html`${menu.items.map(item => this._createFirstLevelItemTemplate(item))}`;
  }

  /**
   * Creates the html template for items residing at first-level. These can be items with or without children.
   *
   * @param item the item to be rendered.
   * @param isTreeMode whether this template should be provided for tree mode (hamburger menu) or default display purposes.
   */
  private _createFirstLevelItemTemplate(item: MenuItem, isTreeMode = false): TemplateResult {
    const { id, icon, items } = item;
    const hasItems = items && items.length > 0;
    const badge = this.getBadgeValue(id!);
    const label = this.__getLabel(item);
    const active = this.activePath.contains(id!);

    let refItem = item;
    if (hasItems) {
      refItem = this.__getDefaultItemOf(item) || item;
    }

    const { url, destination } = refItem;

    return html` <a
        href="${ifDefined(url)}"
        part="item-${ifDefined(id)}"
        class="${classMap({
          link: true,
          'tree-parent': isTreeMode,
          [NavigationCssClasses.selected]: active,
        })}"
        target="${destination === 'extern' && !hasItems ? '_blank' : '_self'}"
        @click="${(e: Event) => this._onLink(e, item)}"
        >${PortalNavigation._createLinkTemplate(id!, label, icon, badge)}${isTreeMode && hasItems ? html`<span class="button"></span>` : nothing}</a
      >
      ${isTreeMode && active && hasItems ? html` <div class="tree-items">${item.items!.map(childItem => this._createSecondLevelItemTemplate(childItem))}</div>` : nothing}`;
  }

  /**
   * Creates the html template for the third row (second-level), which displays only if the active path
   * has a first-level item selection and that item has child items.
   */
  private _createCurrentItemsTemplate(): TemplateResult | Nothing {
    const parentItemId = this.activePath.getFirstLevelItemId();
    if (!parentItemId) {
      return nothing;
    }

    const menuId = this.activePath.getMenuId();
    const activeParentItem = this.configuration.getData([`menus::${menuId}`, `items::${parentItemId}`]);
    const hasCurrentItems = activeParentItem && !Array.isArray(activeParentItem) && activeParentItem.items && activeParentItem.items.length > 0;

    if (!hasCurrentItems) {
      return nothing;
    }

    return html` <div class="navigation-current">
      <div class="navigation-content" part="menu-main-current">${(activeParentItem as MenuItem).items!.map(item => this._createSecondLevelItemTemplate(item))}</div>
    </div>`;
  }

  /**
   * Creates the html template for second-level items, which can either be in the third row (current items)
   * or second-level in tree mode (hamburger menu).
   *
   * @param item the item for which to create a html template.
   */
  private _createSecondLevelItemTemplate(item: MenuItem): TemplateResult {
    const { id, icon, url, destination } = item;
    const badge = this.getBadgeValue(id!, url);
    const label = this.__getLabel(item);
    const active = this.activePath.contains(id!);

    return html`<a
      href="${ifDefined(url)}"
      part="item-${ifDefined(id)}"
      class="${classMap({
        link: true,
        [NavigationCssClasses.selected]: active,
      })}"
      @click="${(e: Event) => this._onLink(e, item)}"
      target="${destination === 'extern' ? '_blank' : '_self'}"
      >${PortalNavigation._createLinkTemplate(id!, label, icon, badge)}</a
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
   */
  private static _createLinkTemplate(id: string, label?: string, icon?: string, badge?: string): TemplateResult[] {
    const result = [];
    if (icon) {
      result.push(html`<img src="${icon}" alt="" part="${`icon-${id}`}" class="navigation-icon" />`);
      if (badge) {
        result.push(html`<span part="${`badge-${id}`}" class="badge">${badge}</span>`);
      }
    }

    if (label) {
      result.push(html`<span part="${`label-${id}`}">${label}</span>`);
      if (!icon && badge) {
        result.push(html`<span part="${`badge-${id}`}" class="badge">${badge}</span>`);
      }
    }

    return result;
  }

  /**
   * Creates the html template for tree mode (hamburger menu).
   * You may override this to customize the order and elements of the tree structure for the hamburger menu.
   */
  private _createTreeTemplate(): TemplateResult[] {
    const templates: TemplateResult[] = [];

    // Remove logout menu from tree template if it should be displayed in mobile header
    const menus = PortalNavigation.menuIdsOrdered.filter(menu => !(menu === NavigationMenus.logout && this.logoutMenuInMobileHeader));

    menus.forEach(menuId => {
      const menu = this.configuration.getMenu(menuId);
      const hasItems = menu && menu.items && menu.items.length > 0;
      if (menu && hasItems) {
        templates.push(...menu.items!.map(item => this._createFirstLevelItemTemplate(item, true)));
      }
    });

    return templates;
  }

  /**
   * Callback that controls the behavior when clicking on any link (except links to open a dropdown).
   *
   * @param e - the click event.
   * @param item - the item being clicked.
   *
   * TODO: Make this method protected / private, and we also need to adopt the tests…
   */
  _onLink(e: Event, item: MenuItem): void {
    if (!item) {
      return;
    }

    const hasItems = item.items && item.items.length > 0;
    const internalRouting = this.isInternalRouting(item);

    if (!hasItems) {
      if (internalRouting) {
        e.preventDefault();
        this.__internalLinkSelected(item.id);
        return;
      }

      return;
    }

    // if the default item is external we don't want to honor this flag when clicking on a parent item
    if (internalRouting || this.__getDefaultItemOf(item)!.destination === 'extern') {
      e.preventDefault();
    }

    this.__internalLinkSelected(item.id);

    return;
  }

  /**
   * Checks whether an item should be routed internally or not.
   *
   * @param item the item to check.
   * @returns true if the item is internal.
   *
   * TODO: Make this method protected / private, and we also need to adopt the tests…
   */
  isInternalRouting(item?: MenuItem): boolean {
    let refItem: MenuItem | undefined = item;
    if (item && item.items && item.items.length > 0) {
      refItem = this.__getDefaultItemOf(item);
    }

    // Allow global `internalRouting` to be overridden by the item specific `internalRouting` property
    const itemInternalRouting = refItem && 'internalRouting' in refItem ? refItem.internalRouting : this.internalRouting;

    // Bail if we're not routing internally…
    if (!itemInternalRouting) {
      return false;
    }

    // The current application does not matter, we route internally…
    if (!this.currentApplication) {
      return true;
    }

    // Current application was set, but item is not application specific…
    if (refItem && !('application' in refItem)) {
      // We check whether the current application is in the list of `internalRoutingApplications`
      return 'internalRoutingApplications' in refItem && Array.prototype.includes.call(refItem.internalRoutingApplications, this.currentApplication);
    }

    return !!refItem && refItem.application === this.currentApplication;
  }

  /**
   * Handles the behavior of an internal link being selected. Basically updates the active path.
   *
   * @param itemId the item being selected.
   */
  private __internalLinkSelected(itemId?: string): void {
    const objectPath = this.configuration.getObjectPathForSelection(object => object.id === itemId);
    const selectedItem = objectPath.getLastItem();
    const hasItems = selectedItem && selectedItem.items && selectedItem.items.length > 0;

    this.activeDropdown = undefined;

    let refItem = selectedItem;
    let dispatchEvent = true;
    if (hasItems) {
      refItem = this.__getDefaultItemOf(selectedItem!);
      dispatchEvent = !!refItem && refItem.destination !== 'extern';
      this.activePath = objectPath.toIdPath().concat(dispatchEvent ? refItem!.id : undefined);
    } else {
      this.activePath = objectPath.toIdPath();
    }

    if (dispatchEvent) {
      this.dispatchEvent(
        new CustomEvent(PortalNavigation.events.routeTo, {
          detail: {
            url: refItem!.url,
            label: refItem!.label,
          },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  /**
   * Returns the default item of a given item or the first child item if no default item is defined or undefined if
   * no child items exist.
   *
   * @param item the item whose default item should be found.
   * @returns the default item of the given item or undefined if no child items exist.
   */
  private __getDefaultItemOf(item: MenuItem): MenuItem | undefined {
    const { defaultItem, items } = item;

    // there are no items to choose from
    if (!Array.isArray(items) || items.length < 1) {
      return;
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
   */
  private __getLabel(labelProvider: string | MenuItem | MenuLabel): string {
    let labelObj: string | MenuItem | MenuLabel | undefined = labelProvider;
    if ('label' in <never>labelProvider) {
      labelObj = (labelProvider as MenuItem).label;
    }

    if (typeof labelObj === 'string') {
      return labelObj;
    }

    if (!labelObj || !this.language) {
      return '';
    }

    if (this.language in labelObj) {
      return (labelObj as MenuLabel)[this.language];
    }

    return '';
  }

  /**
   * Returns the internal configuration property.
   */
  getConfiguration(): Configuration {
    return this.configuration;
  }

  /**
   * Returns the internal activePath property.
   */
  getActivePath(): IdPath {
    return this.activePath;
  }

  /**
   * Returns the internal temporary badge values property.
   */
  getTemporaryBadgeValues(): Map<unknown, unknown> {
    return this.temporaryBadgeValues;
  }
}
