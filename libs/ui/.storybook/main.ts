import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../**/*.@(mdx|stories.@(ts))'],
  addons: ['@storybook/addon-styling-webpack'],
  staticDirs: [
    { from: '../src/assets/icons', to: '/assets/icons' },
    '../src/styles/config/_fonts.scss',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/recipes/storybook/custom-builder-configs
