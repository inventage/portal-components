import { css } from 'lit-element';

export const portalNavigationStyle = css`
  :host {
    font-family: Helvetica, sans-serif;
    font-size: 1.25rem;
  }

  .nav-menu-container {
    margin: 0;
  }

  .nav-menu-header {
    display: flex;
    background: #e8edf5;
    padding-top: 0.5rem;
  }

  .nav-menu-logout {
    display: flex;
  }

  .nav-menu-logout .first-level {
    margin: auto 0;
  }

  .nav-menu-slot-left {
    margin: 0 0 0 auto;
  }

  .nav-menu-main-group-menus {
    background: #e8edf5;
    padding: 0.5rem 0;
    margin-bottom: 0.5rem;
  }

  .nav-menu-content {
    display: flex;
    justify-content: flex-end;
  }

  .link {
    text-decoration: none;
    font-size: 1rem;
    margin: 0.25rem 0.5rem;
    display: flex;
    align-items: center;
    text-transform: uppercase;
    color: darkslategray;
    font-weight: bold;
  }

  .link.-selected {
    color: #4287f5;
  }

  .nav-menu-icon {
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
    transform: translate(-40%, 40%);
  }

  @media screen and (max-width: 800px) {
    .link {
      font-size: 0.5rem;
    }
  }
`;
