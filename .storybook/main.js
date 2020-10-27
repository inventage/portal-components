module.exports = {
  stories: ['../README.md', '../components/*/README.md'],
  // Storybook addons
  // @see https://storybook.js.org/addons/
  addons: [
    'storybook-prebuilt/addon-docs/register.js',
    // 'storybook-prebuilt/addon-actions/register.js',
    'storybook-prebuilt/addon-knobs/register.js',
    'storybook-prebuilt/addon-a11y/register.js',
    // 'storybook-prebuilt/addon-backgrounds/register.js',
    // 'storybook-prebuilt/addon-links/register.js',
    'storybook-prebuilt/addon-viewport/register.js',
  ],
  esDevServer: {
    // custom es-dev-server options
    // @see https://open-wc.org/developing/es-dev-server.html#configuration-files
    nodeResolve: true,
    watch: true,
    open: false,
  },
};
