import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import banner2 from "rollup-plugin-banner2";
import typescript from "@rollup/plugin-typescript";
import strip from "@rollup/plugin-strip";
import pkg from "./package.json" with { type: "json" };

const config = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/bundle.cjs.js",
        format: "cjs"
      },
      {
        file: "dist/bundle.esm.js",
        format: "esm"
      },
      {
        name: "Calendar",
        file: "dist/bundle.js",
        format: "umd"
      }
    ],
    plugins: [
      typescript({
        tsconfig: "tsconfig.build.json"
      }),
      strip(), // removes console.log
      commonjs({
        include: "node_modules/**"
      }),
      resolve(),
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled"
      }),
      terser(), // minify javascript
      banner2(() => {
        return `/* color-calendar v${pkg.version} by ${pkg.author} */\n\n`;
      })
    ]
  }
];

export default config;
