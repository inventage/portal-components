/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const { bsSettings } = require('@open-wc/testing-karma-bs');
const createBaseConfig = require('./karma.conf.js');

module.exports = config => {
  config.set(
    merge.strategy({
      browsers: 'replace',
    })(bsSettings(config), createBaseConfig(config), {
      // @see https://github.com/karma-runner/karma-browserstack-launcher
      browserStack: {
        build: 'Portal Components Tests',
        project: 'portal-components',
      },
      // @see node_modules/@open-wc/testing-karma-bs/bs-settings.js
      browsers: [
        'bs_win10_chrome_latest',
        // Only chrome for now
        // 'bs_win10_firefox_latest',
        // 'bs_win10_edge_latest',
        // 'bs_osxmojave_safari_latest',
        // 'bs_win10_ie_11',
      ],
    }),
  );

  return config;
};
