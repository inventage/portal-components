```js script
import { html, withKnobs, withWebComponentsKnobs } from '@open-wc/demoing-storybook';
import '../portal-navigation.js';
import '../src/ExtPortalNavigation.js';
import '../src/CompPortalNavigation.js';

export default {
  title: 'Components/PortalNavigation',
  component: 'portal-navigation',
  decorators: [withKnobs, withWebComponentsKnobs],
  options: { selectedPanel: 'storybookjs/knobs/panel' },
};
```

# Navigation

A component implementing an opinionated (but generic and hence configurable) navigation pattern.

## Features:

- a
- b
- ...

```js preview-story
export const Basic = () => html`<portal-navigation src="/data/data.json"></portal-navigation>`;
export const Extended = () => html`<ext-portal-navigation src="/data/data.json"></ext-portal-navigation>`;
export const Composite = () => html`<comp-portal-navigation></comp-portal-navigation>`;
```
