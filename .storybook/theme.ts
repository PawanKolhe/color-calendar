import { create } from "storybook/theming/create";

export default create({
  base: "light",

  // Typography - Modern, readable fonts
  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", Consolas, "Liberation Mono", Menlo, monospace',

  // Branding - Inspired by the vibrant logo gradient
  brandTitle: "Color Calendar",
  brandUrl: "https://master--68dc1b2449e62022d61d079f.chromatic.com/",
  brandImage: "/logo.png", // Use the colorful gradient logo
  brandTarget: "_self",

  // Color palette - Inspired by logo gradient and calendar themes
  colorPrimary: "#8b5cf6", // Purple-500 - From logo gradient
  colorSecondary: "#f59e0b", // Amber-500 - From logo gradient

  // UI - Clean backgrounds inspired by calendar designs
  appBg: "#fefefe", // Pure white background like calendar cards
  appContentBg: "#ffffff", // Clean white content areas
  appPreviewBg: "#ffffff", // Clean preview background
  appBorderColor: "#e5e7eb", // Subtle border like calendar separators
  appBorderRadius: 12, // Rounded corners like calendar cards

  // Text colors - High contrast for readability
  textColor: "#111827", // Dark gray like calendar text
  textInverseColor: "#ffffff", // Pure white for inverse text

  // Toolbar - Clean design inspired by calendar headers
  barTextColor: "#6b7280", // Muted gray text
  barSelectedColor: "#8b5cf6", // Purple primary from logo
  barHoverColor: "#f59e0b", // Amber secondary from logo
  barBg: "#ffffff", // Clean white background

  // Form elements - Modern design matching calendar aesthetics
  inputBg: "#ffffff", // Clean white background
  inputBorder: "#d1d5db", // Subtle border
  inputTextColor: "#111827", // Dark text for readability
  inputBorderRadius: 8, // Rounded corners matching calendar style
});
