```js script
import { html } from '@open-wc/demoing-storybook';
import '../portal-language-switcher.js';

export default {
  title: 'Components/PortalLanguageSwitcher',
  component: 'portal-language-switcher',
  options: { selectedPanel: 'storybookjs/knobs/panel' },
};
```

# PortalLanguageSwitcher

A component for switching language…

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
import 'portal-language-switcher/portal-language-switcher.js';
```

```js preview-story
export const Simple = () => html` <portal-language-switcher></portal-language-switcher>`;
```

## Variations

### Custom Title

```js preview-story
export const CustomTitle = () => html` <portal-language-switcher title="Hello World"></portal-language-switcher> `;
```

### Custom Language

```js preview-story
export const CustomLanguage = () => html` <portal-language-switcher language="fr"></portal-language-switcher> `;
```
