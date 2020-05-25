import { addDecorator, addParameters, setCustomElements, withA11y } from '@open-wc/demoing-storybook';
import { sortEachDepth } from '@lion/helpers';

function run() {
  // const customElements = await (await fetch(new URL('../custom-elements.json', import.meta.url))).json();
  // setCustomElements(customElements);
  // setCustomElements({});

  // Using async / await from above breaks the navigation tree rendering, so we resort to promises ¯\_(ツ)_/¯
  // which seems to work. Also, we need custom-elements.json in order to be able to use automatic knobs
  // through withWebComponentsKnobs
  // @see https://open-wc.org/demoing-storybook/?path=/docs/decorators-withwebcomponentknobs--example-output
  fetch(`${new URL('../custom-elements.json', import.meta.url)}`)
    .then(response => response.json())
    .then(customElements => setCustomElements(customElements))
    .catch(e => console.error(e));

  addDecorator(withA11y);

  addParameters({
    // storybook-addon-a11y
    // @see https://github.com/storybookjs/storybook/tree/master/addons/a11y#parameters
    a11y: {
      config: {},
      options: {
        restoreScroll: true,
      },
    },
    // Storybook Docs
    // @see https://github.com/storybookjs/storybook/tree/master/addons/docs
    // @see https://github.com/storybookjs/storybook/blob/next/addons/docs/common/README.md#iframe-height
    // @see https://github.com/storybookjs/storybook/blob/next/addons/docs/web-components/README.md
    docs: {
      iframeHeight: '200px',
    },
    // Global Storybook options
    // @see https://storybook.js.org/docs/configurations/options-parameter/
    options: {
      showRoots: true,
      storySort: sortEachDepth([['Intro', 'Components', '...']]),
    },
  });
}

run();
