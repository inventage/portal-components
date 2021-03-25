# Navigation

A component implementing an opinionated (but generic and hence configurable) navigation pattern.

## Examples

### Basic

```js preview-story
export const Basic = () => html` <portal-navigation src="./data/data.json" internalRouting currentApplication="ebanking" @portal-navigation.configured="${dispatchBadgeEvents}">
  <span slot="logo" style="font-size: 0.75rem; display: flex; align-items: center;">Logo slot</span>
  <span slot="left" style="font-size: 0.75rem; display: flex; align-items: center;">Left slot</span>
  <span slot="right" style="font-size: 0.75rem; display: flex; align-items: center;">Right slot</span>
</portal-navigation>`;
```

### Settings

```js preview-story
export const Settings = () => html` <style>
    portal-navigation {
      --portal-navigation-main-justify-content: flex-start;
      --portal-navigation-current-justify-content: flex-start;
    }

    portal-navigation.settings::part(slot-header-mobile) {
      margin-left: auto;
    }

    portal-navigation.settings::part(hamburger-menu) {
      margin-left: 0;
    }

    @media screen and (max-width: 1100px) {
      portal-navigation.settings::part(label-34) {
        display: none;
      }
    }
  </style>
  <portal-navigation
    src="./data/data-settings.json"
    logoutMenuInMetaBar
    logoutMenuInMobileHeader
    internalRouting
    mobileBreakpoint="1100"
    language="de"
    currentApplication="ebanking"
    @portal-navigation.configured="${dispatchBadgeEvents}"
    class="settings"
  >
    <span slot="logo" style="font-size: 0.75rem; display: flex; align-items: center;">Logo slot</span>
    <span slot="meta-left" style="font-size: 0.75rem; display: flex; align-items: center;">Meta Left slot</span>
    <span slot="header-mobile" style="font-size: 0.75rem; display: flex; align-items: center;">Header Mobile slot</span>
    <span slot="tree-bottom" style="font-size: 0.75rem; display: flex; align-items: center;">Tree Bottom slot</span>
  </portal-navigation>`;
```

### Empty

```js preview-story
export const Empty = () => html` <portal-navigation></portal-navigation>`;
```

### Test

```js preview-story
export const Test = () => html` <portal-navigation src="./data/test-data.json" @portal-navigation.configured="${dispatchBadgeEventsTest}"></portal-navigation>`;
```

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

const dispatchBadgeEventsTest = () => {
  document.dispatchEvent(
    new CustomEvent(PortalNavigation.events.setBadgeValue, {
      detail: {
        id: 'meta',
        value: 9,
      },
    }),
  );

  document.dispatchEvent(
    new CustomEvent(PortalNavigation.events.setBadgeValue, {
      detail: {
        id: 'parent2',
        value: { en: 'new', de: 'neu' },
      },
    }),
  );
};
```
