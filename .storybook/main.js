module.exports = {
  stories: ['../components/**/stories/**/*.stories.{js,md,mdx}', '../docs/**/stories/**/*.stories.{js,md,mdx}'],
  // Storybook addons
  // @see https://storybook.js.org/addons/
  addons: [
    'storybook-prebuilt/addon-docs/register.js',
    // 'storybook-prebuilt/addon-actions/register.js',
    'storybook-prebuilt/addon-knobs/register.js',
    'storybook-prebuilt/addon-a11y/register.js',
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
