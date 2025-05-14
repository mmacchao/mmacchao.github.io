// utils.js
// import { fileURLToPath } from 'url';
// import path from 'path';
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const path = require('path')

module.exports = {
  entry: './main.js',
  experiments: {
    outputModule: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'base-webpack.js',
    library: {
      name: 'MyLibrary',
      type: 'umd',
    },
  },
  optimization: {
    minimize: false,
  },
  // experiments: {
  //   outputModule: true,
  // },
  // externalsType: 'module',
  externals: {
    vue: 'vue',
  },
}
