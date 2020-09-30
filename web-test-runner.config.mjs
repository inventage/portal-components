import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  nodeResolve: true,
  concurrentBrowsers: 3,
  concurrency: 10,
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: {
      statements: 90,
      branches: 65,
      functions: 80,
      lines: 90,
    },
  },
  plugins: [esbuildPlugin({ ts: true })],
};
