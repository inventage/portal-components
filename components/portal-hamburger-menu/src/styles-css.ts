/**
 * DO NOT EDIT THIS FILE DIRECTLY.
 *
 * It is generated automatically from a given .css file inside the build-styles.sh script.
 */
import { css } from 'lit-element';

export const styles = css`
.hamburger {
  padding: var(--hamburger-padding-y, 10px) var(--hamburger-padding-x, 3px);
  display: inline-block;
  cursor: pointer;
  outline: 0;

  transition-property: opacity;
  transition-duration: var(--hamburger-hover-transition-duration, 0.15s);
  transition-timing-function: var(--hamburger-hover-transition-timing-function, linear);

  font: inherit;
  color: inherit;
  text-transform: none;
  background-color: transparent;
  border: 0;
  margin: 0;
  overflow: visible;
  line-height: 0;
}

.hamburger:hover {
  opacity: var(--hamburger-hover-opacity, 1);
}

.hamburger-box {
  width: var(--hamburger-layer-width, 26px);
  height: calc(var(--hamburger-layer-height, 2px) * 3 + var(--hamburger-layer-spacing, 4px) * 2);
  display: inline-block;
  position: relative;
}

.hamburger-inner {
  display: block;
  top: 50%;
  margin-top: calc(var(--hamburger-layer-height, 2px) / -2);
}

.hamburger-inner,
.hamburger-inner::before,
.hamburger-inner::after {
  width: var(--hamburger-layer-width, 26px);
  height: var(--hamburger-layer-height, 2px);
  background-color: var(--hamburger-layer-color, black);
  border-radius: var(--hamburger-layer-border-radius, 0);
  position: absolute;
  transition-property: transform;
  transition-duration: 0.15s;
  transition-timing-function: ease;
}

.hamburger-inner::before,
.hamburger-inner::after {
  content: '';
  display: block;
}

.hamburger-inner::before {
  top: calc((var(--hamburger-layer-spacing, 4px) + var(--hamburger-layer-height, 2px)) * -1);
}

.hamburger-inner::after {
  bottom: calc((var(--hamburger-layer-spacing, 4px) + var(--hamburger-layer-height, 2px)) * -1);
}

.hamburger--spin .hamburger-inner {
  transition-duration: 0.22s;
  transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--spin .hamburger-inner::before {
  transition: top 0.1s 0.25s ease-in, opacity 0.1s ease-in;
}

.hamburger--spin .hamburger-inner::after {
  transition: bottom 0.1s 0.25s ease-in, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger.-toggled .hamburger-inner {
  transform: rotate(225deg);
  transition-delay: 0.12s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.hamburger.-toggled .hamburger-inner::before {
  top: 0;
  opacity: 0;
  transition: top 0.1s ease-out, opacity 0.1s 0.12s ease-out;
}

.hamburger.-toggled .hamburger-inner::after {
  bottom: 0;
  transform: rotate(-90deg);
  transition: bottom 0.1s ease-out, transform 0.22s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1);
}
`;