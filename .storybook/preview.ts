import type { Preview } from "@storybook/html-vite";

// Import calendar CSS themes
import "../src/sass/theme-basic.scss";
import "../src/sass/theme-glass.scss";

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
