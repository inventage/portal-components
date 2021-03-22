const { esbuildPlugin } = require('@web/dev-server-esbuild');

module.exports = {
  nodeResolve: true,
  concurrentBrowsers: 1,
  concurrency: 3,
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: {
      statements: 90,
      branches: 60,
      functions: 80,
      lines: 90,
    },
  },
  // testFramework: {
  //   config: {
  //     timeout: 100000,
  //   },
  // },
  plugins: [esbuildPlugin({ ts: true })],
};
