import type { Preview } from "@storybook/html-vite";

// Import calendar CSS themes
import "../dist/css/theme-basic.css";
import "../dist/css/theme-glass.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
