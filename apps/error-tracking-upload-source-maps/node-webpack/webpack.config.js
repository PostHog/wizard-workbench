const path = require('path')
require('dotenv/config')

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  mode: 'production',
  experiments: {
    topLevelAwait: true,
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
