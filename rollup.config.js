const path = require('path');

import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import banner from 'rollup-plugin-banner';
import typescript from '@rollup/plugin-typescript';
import strip from '@rollup/plugin-strip';

const config = [
  {
    input: "src/index.ts",    
    output: [
      {
        file: "dist/bundle.cjs.js",
        sourcemap: true,
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
      typescript(),
      // strip({
      //   debugger: false,
      //   // functions: ['console.log', 'assert.*', 'debug', 'alert'],
      //   sourceMap: true
      // }),  // removes console.log
      commonjs({
        include: "node_modules/**",
      }),
      resolve(),
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
        sourcemap: true,
      }),
      terser({
        // sourcemap: true
      }), // minify javascript
      banner('color-calendar\nv<%= pkg.version %>\nby <%= pkg.author %>'),
    ],
  },
];

export default config;
