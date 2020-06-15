import { css } from 'lit-element/lit-element.js';

/**
 * Shared component styles
 *
 * @type {import("lit-element").CSSResult}
 *
 * @link https://lit-element.polymer-project.org/guide/styles#style-the-component-itself
 */
export const baseStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none;
  }
`;
