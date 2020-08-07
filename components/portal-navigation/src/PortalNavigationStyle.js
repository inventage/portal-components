import { css } from 'lit-element';

export const portalNavigationStyle = css`
  :host {
    font-family: Helvetica, sans-serif;
    font-size: 1.25rem;
  }

  .portal-navigation-container {
    margin: 0;
  }

  .portal-navigation-header {
    display: flex;
    background: #e8edf5;
    padding-top: 0.5rem;
  }

  .portal-navigation-logout {
    display: flex;
  }

  .portal-navigation-logout .first-level {
    margin: auto 0;
  }

  .first-level {
    display: flex;
  }

  .portal-navigation-slot-left {
    margin: 0 0 0 auto;
  }

  .portal-navigation-group-main-menus {
    background: #e8edf5;
    padding: 0.5rem 0;
    margin-bottom: 0.5rem;
    justify-content: flex-end;
  }

  .portal-navigation-content {
    display: flex;
    justify-content: flex-end;
  }

  .link {
    text-decoration: none;
    font-size: 1rem;
    margin: 0.25rem 0.5rem;
    display: flex;
    align-items: center;
    color: darkslategray;
  }

  .link.-selected {
    color: #4287f5;
  }

  .dropdown-link {
    cursor: pointer;
  }

  .dropdown {
    display: none;

    background-color: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
    margin: 0;
    min-width: 260px;
    position: absolute;
    right: 20px;
    top: calc(100% + 6px);
    z-index: 99;
    padding: 0.5rem 0;

    @supports (filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.5))) {
      box-shadow: none;
      filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.5));
    }
  }

  .dropdown::before {
    background-color: #fff;
    box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.25);
    content: '';
    height: 12px;
    position: absolute;
    right: 8px;
    top: -6px;
    transform: rotate(45deg);
    width: 12px;

    @supports (filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.5))) {
      box-shadow: none;
    }
  }

  .dropdown .first-level.-selected > link,
  .dropdown .first-level:hover > link,
  .dropdown .first-level:focus > link {
    box-shadow: inset 4px 0 currentColor;
  }

  .dropdown .first-level > .link {
    padding: 0.25rem 0.5rem;
  }

  .dropdown.-showDropdown {
    display: block;
  }

  .portal-navigation-tree-container .link {
    text-transform: none;
  }

  .portal-navigation-icon {
    margin-right: 0.25rem;
  }

  .badge:not(:empty) {
    background-color: #4287f5;
    border-radius: 1em;
    font-size: 1rem;
    padding: 2px 8px 0px 8px;
    text-align: center;
    color: white;
    font-family: Helvetica, sans-serif;
    transform: translate(5%, -30%);
  }

  .badge.-decorator:not(:empty) {
    transform: translate(-1rem, 0.35rem);
    margin-right: -0.5rem;
  }

  .portal-navigation-header-toggle {
    display: none;
    margin-left: auto;
    margin-right: 0.5rem;
  }

  .portal-navigation-tree-container {
    display: none;
  }

  .portal-navigation-tree-menu {
    display: flex;
    padding: 0.5rem 0.5rem 0.5rem 0;
    border-bottom: solid 1px #e8edf5;
    cursor: pointer;
  }

  .portal-navigation-tree-menu-items {
  }

  .portal-navigation-tree-menu-items .link:first-child {
    margin-top: 0.5rem;
  }

  .portal-navigation-tree-menu-items .link:last-child {
    margin-bottom: 1rem;
  }

  .portal-navigation-tree-menu-items .link {
    font-size: 0.8rem;
    padding: 0.25rem 0;
  }

  .portal-navigation-tree-menu .button {
    margin-left: auto;
    margin-right: 0.5rem;
  }

  .portal-navigation-group {
    display: flex;
    position: relative;
  }

  @media screen and (max-width: 800px) {
    .portal-navigation-header-toggle,
    .portal-navigation-tree-container {
      display: block;
    }
    .portal-navigation-slot-left,
    .portal-navigation-group-meta,
    .portal-navigation-group-profile,
    .portal-navigation-logout,
    .portal-navigation-slot-right,
    .portal-navigation-group-main-menus,
    .portal-navigation-current {
      display: none;
    }
    .portal-navigation-header {
      padding-bottom: 0.5rem;
    }
  }
`;
