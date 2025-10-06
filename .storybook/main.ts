import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/stories/Introduction.mdx", // Introduction first
    "../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)", // HTML stories second
    "../src/react/**/*.stories.@(js|jsx|mjs|ts|tsx)", // React stories last
  ],
  addons: ["@storybook/addon-docs"],
  staticDirs: ["../screenshots"], // Serve images from screenshots directory
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};
export default config;
