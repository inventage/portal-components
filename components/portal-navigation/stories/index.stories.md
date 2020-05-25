```js script
import { html } from '@open-wc/demoing-storybook';
import '../portal-navigation.js';

export default {
  title: 'Components/PortalNavigation',
  component: 'portal-navigation',
  options: { selectedPanel: 'storybookjs/knobs/panel' },
};
```

# PortalNavigation

A component implementing an opinionated (but generic and hence configurable) navigation pattern.

## Features:

- a
- b
- ...

## How to use

```html
<script type="module">
  import '@inventage/portal-components/components/portal-card/portal-card.js';
</script>

<portal-navigation></portal-navigation>
```

```js preview-story
export const Simple = () => html`<portal-navigation></portal-navigation>`;
```
