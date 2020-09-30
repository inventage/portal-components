import { css } from 'lit-element';

export const styles = css`
  :host {
    --hamburger-padding-x: 3px;
    --hamburger-padding-y: 10px;
    --hamburger-layer-width: 26px;
    --hamburger-layer-height: 2px;
    --hamburger-layer-spacing: 4px;
    --hamburger-layer-color: black;
    --hamburger-layer-border-radius: 0;
    --hamburger-hover-opacity: 1;
    --hamburger-hover-transition-duration: 0.15s;
    --hamburger-hover-transition-timing-function: linear;
  }

  .hamburger {
    padding: var(--hamburger-padding-y) var(--hamburger-padding-x);
    display: inline-block;
    cursor: pointer;
    outline: 0;

    transition-property: opacity;
    transition-duration: var(--hamburger-hover-transition-duration);
    transition-timing-function: var(--hamburger-hover-transition-timing-function);

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
    opacity: var(--hamburger-hover-opacity);
  }

  .hamburger-box {
    width: var(--hamburger-layer-width);
    height: calc(var(--hamburger-layer-height) * 3 + var(--hamburger-layer-spacing) * 2);
    display: inline-block;
    position: relative;
  }

  .hamburger-inner {
    display: block;
    top: 50%;
    margin-top: calc(var(--hamburger-layer-height) / -2);
  }

  .hamburger-inner,
  .hamburger-inner::before,
  .hamburger-inner::after {
    width: var(--hamburger-layer-width);
    height: var(--hamburger-layer-height);
    background-color: var(--hamburger-layer-color);
    border-radius: var(--hamburger-layer-border-radius);
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
    top: calc((var(--hamburger-layer-spacing) + var(--hamburger-layer-height)) * -1);
  }

  .hamburger-inner::after {
    bottom: calc((var(--hamburger-layer-spacing) + var(--hamburger-layer-height)) * -1);
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
