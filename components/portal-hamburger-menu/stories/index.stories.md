```js script
import { html } from '@open-wc/demoing-storybook';
import '../portal-hamburger-menu.js';

export default {
  title: 'Components/Hamburger Menu',
  component: 'portal-hamburger-menu',
  options: { selectedPanel: 'storybookjs/knobs/panel' },
};
```

# Hamburger Menu

A simple hamburger menu component.

## API

<sb-props of="portal-hamburger-menu"></sb-props>

## Examples

### Basic

```js preview-story
export const Basic = () => html`<portal-hamburger-menu></portal-hamburger-menu>`;
```

### Toggled

```js preview-story
export const Toggled = () => html`<portal-hamburger-menu .toggled="${true}"></portal-hamburger-menu>`;
```

### `state-changed` Event

Open your console. You should see a log statement each time you toggle the hamburger state.

```js preview-story
export const StateChanged = () => html`<portal-hamburger-menu @state-changed="${e => console.log('state-changed', e)}"></portal-hamburger-menu>`;
```
