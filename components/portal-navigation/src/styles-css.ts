/**
 * DO NOT EDIT THIS FILE DIRECTLY.
 *
 * It is generated automatically from a given .css file inside the build-styles.sh script.
 */
import { css } from 'lit-element';

export const styles = css`
:host {
  font-family: var(--portal-navigation-font-family, sans-serif);
  box-sizing: border-box;
  color: var(--portal-navigation-color-primary, #555);
}

:host *,
:host *:before,
:host *:after {
  box-sizing: inherit;
}

/*
 * Max-width, centered containers
*/
.container-max-width {
  max-width: var(--portal-navigation-max-width, 1200px);
  margin: 0 auto;
}

/**
 * Meta bar styles
 */
.meta-bar {
  background: var(--portal-navigation-color-meta-bar-background, rgba(66, 135, 245, 0.2));
}

.meta-bar > .inner {
  display: flex;
}

.meta-bar:empty {
  border: 1px solid red;
}

.meta-bar:empty,
.meta-bar > .inner:empty {
  display: none;
}

.slot-meta-left:empty {
  display: none;
}

/**
 * Navigation header
 */
.navigation-header {
  background: var(--portal-navigation-color-header-background, rgba(66, 135, 245, 0.1));
}

.navigation-header > .inner {
  display: flex;
}

.menu-main {
  background: var(--portal-navigation-color-header-background, rgba(66, 135, 245, 0.1));
}

/*.portal-navigation-menu-main > .inner {*/
/*  padding: var(--portal-navigation-vertical-base, 0.5rem) var(--portal-navigation-horizontal-base, 1rem);*/
/*}*/

.menu-logout-meta,
.slot-left {
  margin: 0 0 0 auto;
}

.menu-main-items {
  justify-content: flex-end;
}

.navigation-content {
  display: flex;
  justify-content: flex-end;
}

.link {
  text-decoration: none;
  font-size: var(--portal-navigation-font-size, 1.25rem);
  margin: 0.25rem 0;
  display: flex;
  align-items: center;
  color: var(--portal-navigation-color-link, var(--portal-navigation-color-primary));
}

.link.-selected {
  color: var(--portal-navigation-color-selected, var(--portal-navigation-color-secondary, rgb(66, 136, 245)));
}

.link:hover {
  color: var(--portal-navigation-color-hover, var(--portal-navigation-color-secondary, rgb(66, 136, 245)));
}

.menu > .link:not(:last-of-type) {
  margin-right: var(--portal-navigation-horizontal-base, 1rem);
}

.navigation-content > .link:not(:last-child) {
  margin-right: var(--portal-navigation-horizontal-base, 1rem);
}

.dropdown-link {
  cursor: pointer;
}

.dropdown {
  display: none;

  background-color: var(--portal-navigation-color-dropdown-background, white);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
  margin: 0;
  min-width: 260px;
  position: absolute;
  right: 20px;
  top: calc(100% + 6px);
  z-index: 99;
}

.dropdown::before {
  background-color: var(--portal-navigation-color-dropdown-background, white);
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
  color: var(--portal-navigation-color-link-dropdown, var(--portal-navigation-color-primary));
  padding: calc(0.75 * var(--portal-navigation-vertical-base, 0.5rem)) var(--portal-navigation-horizontal-base, 1rem);
}

.dropdown > .link:hover {
  color: var(--portal-navigation-color-hover-dropdown, var(--portal-navigation-color-hover));
}

.dropdown.-show {
  display: block;
}

.tree-container .link {
  text-transform: none;
  padding-left: var(--portal-navigation-horizontal-base, 1rem);
  padding-right: var(--portal-navigation-horizontal-base, 1rem);
}

.badge:not(:empty) {
  background-color: var(--portal-navigation-color-badge-background, var(--portal-navigation-color-secondary, rgb(66, 136, 245)));
  border-radius: 1em;
  font-size: var(--portal-navigation-font-size-badge, 1rem);
  padding: 2px 8px 0 8px;
  text-align: center;
  color: var(--portal-navigation-color-badge, white);
  font-family: Helvetica, sans-serif;
  transform: translate(5%, -30%);
}

.navigation-icon {
  margin-right: 0.25rem;
}

.navigation-icon + .badge:not(:empty) {
  transform: translate(-1rem, 0.35rem);
  margin-right: -0.5rem;
}

.header-toggle {
  display: none;
  margin-left: auto;
}

.tree-container {
  display: none;
}

.tree-parent {
  padding: var(--portal-navigation-vertical-base, 0.5rem) 0;
  border-bottom: solid 1px var(--portal-navigation-color-border, rgba(44, 62, 80, 0.1));
  width: 100%;
}

.tree-parent .button {
  margin-left: auto;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-chevron-down' width='24' height='24' viewBox='0 0 24 24' stroke-width='1.5' stroke='%232c3e50' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath stroke='none' d='M0 0h24v24H0z'/%3E%3Cpolyline points='6 9 12 15 18 9' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  width: 1.5rem;
  height: 1.5rem;
}

.tree-parent.-selected .button {
  transform: rotate(180deg);
  transition: transform 0.5s;
}

.tree-items .link:first-child {
  margin-top: var(--portal-navigation-vertical-base, 0.5rem);
}

.tree-items .link:last-child {
  margin-bottom: 1rem;
}

.tree-items .link {
  font-size: var(--portal-navigation-font-size-tree-second-level, 1rem);
  padding: 0.25rem var(--portal-navigation-horizontal-base, 1rem);
}

.menu {
  display: flex;
  position: relative;
}

.slot-left,
.slot-right,
.slot-logo {
  display: flex;
}

.menu-meta,
.menu-profile {
  margin-right: 2rem;
}

.navigation-current {
  padding: var(--portal-navigation-vertical-base, 0.5rem) var(--portal-navigation-horizontal-base, 1rem);
}

.navigation-current > .navigation-content > .link {
  color: var(--portal-navigation-color-link-current, var(--portal-navigation-color-link));
}

.navigation-current > .navigation-content > .link:hover {
  color: var(--portal-navigation-color-hover-current, var(--portal-navigation-color-hover));
}

/**
 * Not-mobile styles
 */
.container:not(.-mobile) .slot-header-mobile {
  display: none;
}

/**
 * Mobile breakpoint styles
 */
.container.-mobile {
  display: flex;
  flex-direction: column;
}

.container.-mobile .link {
  color: var(--portal-navigation-color-link-breakpoint, var(--portal-navigation-color-link));
}

.container.-mobile .navigation-header {
  order: 1;
}

.container.-mobile .meta-bar {
  order: 2;
}

.container.-mobile .meta-bar.hidden {
  display: none;
}

.container.-mobile .menu-main {
  order: 3;
}

.container.-mobile .header-toggle,
.container.-mobile .tree-container {
  display: block;
}

.container.-mobile .slot-header-mobile {
  display: flex;
}

.container.-mobile .slot-left,
.container.-mobile .menu-meta,
.container.-mobile .menu-profile,
.container.-mobile .menu-logout,
.container.-mobile .slot-right,
.container.-mobile .menu-main-items,
.container.-mobile .navigation-current {
  display: none;
}

.container.-mobile .navigation-header {
  padding: var(--portal-navigation-vertical-base, 0.5rem) calc(var(--portal-navigation-horizontal-base, 1rem) - var(--hamburger-padding-x, 3px)) var(--portal-navigation-vertical-base, 0.5rem) var(--portal-navigation-horizontal-base, 1rem);
}
`;