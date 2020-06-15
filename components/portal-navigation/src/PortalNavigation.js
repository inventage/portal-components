/**
 * @typedef { import("lit-element").CSSResult } CSSResult
 * @typedef { import("lit-element").CSSResultArray } CSSResultArray
 */
import { LitElement } from 'lit-element';
import { nothing } from 'lit-html';
import { baseStyles } from '../../helpers/baseStyles.js';

export class PortalNavigation extends LitElement {
  /**
   * @returns {CSSResult|CSSResultArray}
   */
  static get styles() {
    return baseStyles;
  }

  render() {
    return nothing;
  }
}
