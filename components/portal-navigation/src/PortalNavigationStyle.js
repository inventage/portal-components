import { css } from 'lit-element';

export const portalNavigationStyle = css`
  --nav-menu-gutter: 0.5rem;

  :host {
    display: flex;
  }

  .nav-menu-container {
    background: #d3ff00;
    margin: 0;
  }

  .nav-menu-header {
    display: flex;
  }

  .nav-menu-slot-left {
    margin: 0 0 0 auto;
  }

  .nav-menu-content {
    display: flex;
    justify-content: flex-end;
  }

  .link {
    text-decoration: none;
    font-size: 1.5rem;
    margin: 0.25rem 0.5rem;
  }

  .link.-selected {
    color: red;
  }
`;
