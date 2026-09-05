import type { Preview } from '@storybook/vue3-vite'
import '../src/styles/tailwind.css'
import '../src/styles/tokens.css'
import '../src/styles/shared.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;