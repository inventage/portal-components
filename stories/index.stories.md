```js script
import { html } from '@open-wc/demoing-storybook';
import '../portal-navigation.js';

export default {
  title: 'PortalNavigation',
  component: 'portal-navigation',
  options: { selectedPanel: "storybookjs/knobs/panel" },
};
```

# PortalNavigation

A component for...

## Features:

- a
- b
- ...

## How to use

### Installation

```bash
yarn add portal-navigation
```

```js
import 'portal-navigation/portal-navigation.js';
```

```js preview-story
export const Simple = () => html`
  <portal-navigation></portal-navigation>
`;
```

## Variations

###### Custom Title

```js preview-story
export const CustomTitle = () => html`
  <portal-navigation title="Hello World"></portal-navigation>
`;
```
