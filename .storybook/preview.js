import { addDecorator, addParameters, setCustomElements, withA11y } from '@open-wc/demoing-storybook';
import { sortEachDepth } from '@lion/helpers';

async function run() {
  // const customElements = await (
  //   await fetch(new URL('../custom-elements.json', import.meta.url))
  // ).json();
  setCustomElements({});

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
