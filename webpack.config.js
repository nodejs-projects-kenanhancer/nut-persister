const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const { NODE_ENV = "production" } = process.env;

const patterns = [
  { from: "./package*.json", to: '../' },
];

module.exports = {
  context: __dirname,
  mode: NODE_ENV === 'production' ? 'production' : 'development',
  devtool: NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
  entry: {
    index: './src/index.ts'
  },
  resolve: {
    extensions: ['.mjs', '.json', '.ts', '.yml'],
    symlinks: false,
    cacheWithContext: false,
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'dist/src'),
    filename: 'index.js',
    sourceMapFilename: 'index.js.map',
    clean: true,
  },
  target: 'node',
  externals: [nodeExternals()],
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.(tsx?)$/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack')
          ]
        ],
        options: {
          transpileOnly: false
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns,
    }),
  ],
};