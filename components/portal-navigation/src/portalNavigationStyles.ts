import { css } from 'lit-element';

export const portalNavigationStyles = css`
  :host {
    --portal-navigation-color-primary: #555;
    --portal-navigation-color-secondary: rgb(66, 136, 245);
    --portal-navigation-color-link: var(--portal-navigation-color-primary);
    --portal-navigation-color-selected: var(--portal-navigation-color-secondary);
    --portal-navigation-color-hover: var(--portal-navigation-color-secondary);
    --portal-navigation-color-badge: white;
    --portal-navigation-color-badge-background: var(--portal-navigation-color-secondary);
    --portal-navigation-color-dropdown-background: white;
    --portal-navigation-color-border: rgba(44, 62, 80, 0.1);
    --portal-navigation-color-header-background: rgba(66, 135, 245, 0.1);

    --portal-navigation-font-size: 1.25rem;
    --portal-navigation-font-size-badge: 1rem;
    --portal-navigation-font-size-tree-second-level: 1rem;

    --portal-navigation-horizontal-base: 1rem;
    --portal-navigation-vertical-base: 0.5rem;

    font-family: Helvetica, sans-serif;
    box-sizing: border-box;
  }

  :host *,
  :host *:before,
  :host *:after {
    box-sizing: inherit;
  }

  .portal-navigation-container {
    margin: 0;
    color: var(--portal-navigation-color-primary);
  }

  .portal-navigation-header {
    display: flex;
    background: var(--portal-navigation-color-header-background);
    padding-top: var(--portal-navigation-vertical-base);
    padding-right: var(--portal-navigation-horizontal-base);
    padding-left: var(--portal-navigation-horizontal-base);
  }

  .portal-navigation-slot-left {
    margin: 0 0 0 auto;
  }

  .portal-navigation-menu-main-items {
    background: var(--portal-navigation-color-header-background);
    padding: var(--portal-navigation-vertical-base) var(--portal-navigation-horizontal-base);
    justify-content: flex-end;
  }

  .portal-navigation-content {
    display: flex;
    justify-content: flex-end;
  }

  .link {
    text-decoration: none;
    font-size: var(--portal-navigation-font-size);
    margin: 0.25rem 0;
    display: flex;
    align-items: center;
    color: var(--portal-navigation-color-link);
  }

  .link.-selected {
    color: var(--portal-navigation-color-selected);
  }

  .link:hover {
    color: var(--portal-navigation-color-hover);
  }

  .portal-navigation-menu > .link:not(:last-child) {
    margin-right: var(--portal-navigation-horizontal-base);
  }

  .portal-navigation-content > .link:not(:last-child) {
    margin-right: var(--portal-navigation-horizontal-base);
  }

  .dropdown-link {
    cursor: pointer;
  }

  .dropdown {
    display: none;

    background-color: var(--portal-navigation-color-dropdown-background);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
    margin: 0;
    min-width: 260px;
    position: absolute;
    right: 20px;
    top: calc(100% + 6px);
    z-index: 99;
  }

  .dropdown::before {
    background-color: var(--portal-navigation-color-dropdown-background);
    box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.25);
    content: '';
    height: 12px;
    position: absolute;
    right: 8px;
    top: -6px;
    transform: rotate(45deg);
    width: 12px;
  }

  .dropdown .-selected > link,
  .dropdown:hover > link,
  .dropdown:focus > link {
    box-shadow: inset 4px 0 currentColor;
  }

  .dropdown > .link {
    padding: calc(0.75 * var(--portal-navigation-vertical-base)) var(--portal-navigation-horizontal-base);
  }

  .dropdown.-show {
    display: block;
  }

  .portal-navigation-tree-container .link {
    text-transform: none;
    padding-left: var(--portal-navigation-horizontal-base);
    padding-right: var(--portal-navigation-horizontal-base);
    padding-right: var(--portal-navigation-horizontal-base);
  }

  .badge:not(:empty) {
    background-color: var(--portal-navigation-color-badge-background);
    border-radius: 1em;
    font-size: var(--portal-navigation-font-size-badge);
    padding: 2px 8px 0px 8px;
    text-align: center;
    color: var(--portal-navigation-color-badge);
    font-family: Helvetica, sans-serif;
    transform: translate(5%, -30%);
  }

  .portal-navigation-icon {
    margin-right: 0.25rem;
  }

  .portal-navigation-icon + .badge:not(:empty) {
    transform: translate(-1rem, 0.35rem);
    margin-right: -0.5rem;
  }

  .portal-navigation-header-toggle {
    display: none;
    margin-left: auto;
  }

  .portal-navigation-tree-container {
    display: none;
  }

  .portal-navigation-tree-parent {
    padding: var(--portal-navigation-vertical-base) 0;
    border-bottom: solid 1px var(--portal-navigation-color-border);
    width: 100%;
  }

  .portal-navigation-tree-parent .button {
    margin-left: auto;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-chevron-down' width='24' height='24' viewBox='0 0 24 24' stroke-width='1.5' stroke='%232c3e50' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath stroke='none' d='M0 0h24v24H0z'/%3E%3Cpolyline points='6 9 12 15 18 9' /%3E%3C/svg%3E");
    background-repeat: no-repeat;
    width: 1.5rem;
    height: 1.5rem;
  }

  .portal-navigation-tree-parent.-selected .button {
    transform: rotate(180deg);
    transition: transform 0.5s;
  }

  .portal-navigation-tree-items .link:first-child {
    margin-top: var(--portal-navigation-vertical-base);
  }

  .portal-navigation-tree-items .link:last-child {
    margin-bottom: 1rem;
  }

  .portal-navigation-tree-items .link {
    font-size: var(--portal-navigation-font-size-tree-second-level);
    padding: 0.25rem var(--portal-navigation-horizontal-base);
  }

  .portal-navigation-menu {
    display: flex;
    position: relative;
  }

  .portal-navigation-slot-left,
  .portal-navigation-slot-right,
  .portal-navigation-slot-logo {
    display: flex;
  }

  .portal-navigation-menu-meta,
  .portal-navigation-menu-profile {
    margin-right: 2rem;
  }

  .portal-navigation-current {
    padding: var(--portal-navigation-vertical-base) var(--portal-navigation-horizontal-base);
  }

  @media screen and (max-width: 800px) {
    .portal-navigation-header-toggle,
    .portal-navigation-tree-container {
      display: block;
    }

    .portal-navigation-slot-left,
    .portal-navigation-menu-meta,
    .portal-navigation-menu-profile,
    .portal-navigation-menu-logout,
    .portal-navigation-slot-right,
    .portal-navigation-menu-main-items,
    .portal-navigation-current {
      display: none;
    }

    .portal-navigation-header {
      padding-bottom: var(--portal-navigation-vertical-base);
    }
  }
`;
