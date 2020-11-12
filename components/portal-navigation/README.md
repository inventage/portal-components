# Navigation

A component implementing an opinionated (but generic and hence configurable) navigation pattern.

## API

<sb-props of="portal-navigation"></sb-props>

```js script
import { html, withKnobs, withWebComponentsKnobs } from '@open-wc/demoing-storybook';
import '../../dist/components/portal-navigation/portal-navigation.js';
import { PortalNavigation } from '../../dist/components/portal-navigation/src/PortalNavigation.js';

export default {
  title: 'Components/Portal Navigation',
  component: 'portal-navigation',
  decorators: [withKnobs, withWebComponentsKnobs],
  options: { selectedPanel: 'storybookjs/knobs/panel' },
};

const dispatchBadgeEvents = () => {
  document.dispatchEvent(
    new CustomEvent(PortalNavigation.events.setBadgeValue, {
      detail: {
        id: 'profile.preferences.userSettings',
        value: { en: 'NEW', de: 'NEU' },
      },
    }),
  );

  document.dispatchEvent(
    new CustomEvent(PortalNavigation.events.setBadgeValue, {
      detail: {
        id: 'meta.messages',
        value: 9,
      },
    }),
  );

  document.dispatchEvent(
    new CustomEvent(PortalNavigation.events.setBadgeValue, {
      detail: {
        id: 'main.assetCount',
        value: { en: 'new', de: 'neu' },
      },
    }),
  );

  document.dispatchEvent(
    new CustomEvent(PortalNavigation.events.setBadgeValue, {
      detail: {
        url: '/ebanking/update-notification-preferences',
        value: 34,
      },
    }),
  );
};
```

## Examples

```js preview-story
export const Basic = () => html` <portal-navigation src="./data/data.json" internalRouting currentApplication="ebanking" @portal-navigation.configured="${dispatchBadgeEvents}">
  <span slot="logo" style="font-size: 0.75rem; display: flex; align-items: center;">Logo slot</span>
  <span slot="left" style="font-size: 0.75rem; display: flex; align-items: center;">Left slot</span>
  <span slot="right" style="font-size: 0.75rem; display: flex; align-items: center;">Right slot</span>
</portal-navigation>`;
```