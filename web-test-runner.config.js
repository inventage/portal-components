module.exports = {
  nodeResolve: true,
  concurrency: 10,
  coverageConfig: {
    threshold: {
      statements: 50,
      branches: 50,
      functions: 50,
      lines: 50,
    },
  },
};
