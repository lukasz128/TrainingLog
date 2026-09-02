import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../**/*.@(mdx|stories.@(ts))'],
  addons: ['@storybook/addon-styling-webpack'],
  staticDirs: [
    { from: '../../../../ui/src/assets/icons', to: '/assets/icons' },
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;
