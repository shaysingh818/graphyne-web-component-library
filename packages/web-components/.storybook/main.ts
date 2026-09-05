import type { StorybookConfig } from '@storybook/vue3-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/vue3-vite",
  async viteFinal(viteConfig) {
    viteConfig.plugins = viteConfig.plugins ?? [];
    viteConfig.plugins.push(tailwindcss());
    return viteConfig;
  }
};
export default config;