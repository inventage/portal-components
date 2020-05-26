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

This component heavily borrows from the Open Web Components [demo card](https://open-wc.org/demoing-storybook/?path=/docs/demo-card-docs--simple) implementation and storybook documentation.

## Example

```js preview-story
export const Basic = () => html`<portal-card></portal-card>`;
```
