const path = require('path');

import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
// import scss from "rollup-plugin-scss";
import postcss from "rollup-plugin-postcss";
import autoprefixer from 'autoprefixer';
import env from 'postcss-preset-env';
// import rebasePlugin from "rollup-plugin-rebase";
// import url from '@rollup/plugin-url';
// import scssSmartAsset from 'rollup-plugin-scss-smart-asset';

const config = [
  {
    input: "src/javascript/index.js",
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
        file: "dist/bundle.umd.js",
        format: "umd",
      },
    ],
    plugins: [
      commonjs({
        include: "node_modules/**",
      }),
      resolve(),
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
      }),
      // scss({
      //   output: "dist/bundle.css",
      // }),
      // url(),
      // rebasePlugin({
      //   verbose: true
      // }),
      postcss({
        inject: { insertAt: 'top' },
        plugins: [
          env(),
          autoprefixer(),
        ],
      }),
      // scssSmartAsset({
      //   insert: true,
      //   postcssConfig: {
      //     inject: { insertAt: 'top' },
      //     plugins: [
      //       env(),
      //       autoprefixer(),
      //     ],
      //   },
      //   // postcssUrlConfig: {
      //   //   url: "inline",
      //   //   basePath: path.resolve('src/fonts'),
      //   //   assetsPath: './fonts',
      //   //   useHash: false
      //   // }
      // }),
    ],
  },
];

export default config;
