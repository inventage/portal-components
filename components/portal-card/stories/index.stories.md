```js script
import { html } from '@open-wc/demoing-storybook';
import '../portal-card.js';

export default {
  title: 'Components/Card',
  component: 'portal-navigation',
  options: { selectedPanel: 'storybookjs/knobs/panel' },
};
```

# Card

A test component to display what a component can consist of, how it is documented and how to properly test it.

## Features:

- a
- b
- ...

```js
import 'portal-card/portal-card.js';
```

```js preview-story
export const Simple = () => html` <portal-card></portal-card> `;
```

## Variations

###### Custom Title

```js preview-story
export const CustomTitle = () => html` <portal-card title="Hello World"></portal-card> `;
```
