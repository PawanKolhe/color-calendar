import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import strip from "@rollup/plugin-strip";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import banner2 from "rollup-plugin-banner2";
import pkg from "./package.json" with { type: "json" };

const config = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/bundle.cjs.js",
        format: "cjs",
      },
      {
        file: "dist/bundle.esm.js",
        format: "esm",
      },
      {
        name: "Calendar",
        file: "dist/bundle.js",
        format: "umd",
      },
    ],
    plugins: [
      typescript({
        tsconfig: "tsconfig.build.json",
      }),
      strip(), // removes console.log
      commonjs({
        include: "node_modules/**",
      }),
      resolve(),
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
      }),
      terser(), // minify javascript
      banner2(() => {
        return `/* color-calendar v${pkg.version} by ${pkg.author} */\n\n`;
      }),
    ],
  },
  {
    input: "src/react/index.ts",
    external: ["react", "react-dom"],
    output: [
      {
        file: "dist/react.cjs.js",
        format: "cjs",
      },
      {
        file: "dist/react.esm.js",
        format: "esm",
      },
    ],
    plugins: [
      typescript({
        tsconfig: "tsconfig.build.json",
      }),
      strip(), // removes console.log
      commonjs({
        include: "node_modules/**",
      }),
      resolve(),
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
        presets: ["@babel/preset-react"],
      }),
      terser(), // minify javascript
      banner2(() => {
        return `/* color-calendar React v${pkg.version} by ${pkg.author} */\n\n`;
      }),
    ],
  },
];

export default config;
