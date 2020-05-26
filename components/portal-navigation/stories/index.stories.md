```js script
import { html } from '@open-wc/demoing-storybook';
import '../portal-navigation.js';

export default {
  title: 'Components/PortalNavigation',
  component: 'portal-navigation',
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
export const Basic = () => html`<portal-navigation></portal-navigation>`;
```
