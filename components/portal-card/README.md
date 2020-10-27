# Card

A test component to display what a component can consist of, how it is documented and how to properly test it.

This component heavily borrows from the Open Web Components [demo card](https://open-wc.org/demoing-storybook/?path=/docs/demo-card-docs--simple) implementation and storybook documentation.

## API

<sb-props of="portal-navigation"></sb-props>

```js script
import { html, withKnobs, withWebComponentsKnobs, text } from '@open-wc/demoing-storybook';

import '../../dist/components/portal-card/portal-card.js';

export default {
  title: 'Components/Card',
  component: 'portal-card',
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: { options: { selectedPanel: 'storybookjs/knobs/panel' } },
};
```

## Examples

### Basic

```js preview-story
export const Basic = () => html`<portal-card></portal-card>`;
```

### Custom Title

```js preview-story
export const CustomTitle = () => html`<portal-card title="Harry Potter"></portal-card>`;
```

## Own light dom

```js preview-story
export const ContentSlot = () => html`
  <portal-card>
    <p>${text('First paragraph', 'Some text', 'Properties')}</p>
    <p>${text('Second paragraph', 'Some more text', 'Properties')}</p>
  </portal-card>
`;
```
