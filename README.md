# Portal Components

A collection of webcomponents for enterprise portals.

[![made with open-wc](https://img.shields.io/badge/made%20with-open--wc-%23217ff9)](https://open-wc.org)
[![Main Workflow](https://github.com/inventage/portal-components/workflows/Main%20Workflow/badge.svg)](https://github.com/inventage/portal-components/actions?query=workflow%3A"Main+Workflow")

## Installation

```bash
npm i @inventage/portal-components
```

## Usage

```html
<script type="module">
  import '@inventage/portal-components/components/portal-navigation/portal-navigation.js';
</script>

<portal-navigation></portal-navigation>
```

## Linting with ESLint, Prettier, and Types

To scan the project for linting errors, run

```bash
npm run lint
```

To automatically fix many linting errors, run

```bash
npm run format
```

## Testing with Karma

To run the suite of karma tests, run

```bash
npm run test
```

To run the tests in watch mode (for TDD, for example), run

```bash
npm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.
