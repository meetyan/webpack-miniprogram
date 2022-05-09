const {resolve} = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const LodashWebpackPlugin = require('lodash-webpack-plugin')
const MinaWebpackPlugin = require('./plugins/minaWebpackPlugin')
const MinaRuntimePlugin = require('./plugins/minaRuntimePlugin')

const debuggable = process.env.BUILD_TYPE !== 'release'

module.exports = {
  context: resolve('src'),
  entry: {main: './app.js'},
  output: {
    path: resolve('dist'),
    filename: '[name].js',
    publicPath: resolve('dist'),
    globalObject: 'wx',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js)x?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(scss)$/,
        include: /src/,
        use: [
          {
            loader: 'file-loader',
            options: {
              useRelativePath: true,
              name: '[path][name].wxss',
              context: resolve('src'),
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {includePaths: [resolve('src', 'styles'), resolve('src')]},
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          to: './',
          filter: resourcePath => !['.js', '.scss'].some(item => resourcePath.endsWith(item)),
        },
      ],
    }),
    new MinaWebpackPlugin({
      scriptExtensions: ['.js'],
      assetExtensions: ['.scss'],
    }),
    new MinaRuntimePlugin(),
    new LodashWebpackPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'development',
      BUILD_TYPE: JSON.stringify(process.env.BUILD_TYPE) || 'debug',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'common',
      minChunks: 2,
      minSize: 0,
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
  mode: debuggable ? 'none' : 'production',
  devtool: debuggable ? 'inline-source-map' : 'source-map',
}
