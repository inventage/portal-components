import { addDecorator, addParameters, setCustomElements, withA11y } from '@open-wc/demoing-storybook';

addParameters({
  docs: {
    iframeHeight: '200px',
  },
});

async function run() {
  // const customElements = await (
  //   await fetch(new URL('../custom-elements.json', import.meta.url))
  // ).json();
  setCustomElements({});

  addDecorator(withA11y);
}

run();
