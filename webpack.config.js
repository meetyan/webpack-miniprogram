const {resolve} = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MinaWebpackPlugin = require('./plugins/minaWebpackPlugin')
const MinaRuntimePlugin = require('./plugins/minaRuntimePlugin')

module.exports = {
  context: resolve('src'),
  entry: './app.js',
  output: {
    path: resolve('dist'),
    filename: '[name].js',
    globalObject: 'wx',
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
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
          globOptions: {
            ignore: ['**/*.js'],
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [new MinaWebpackPlugin(), new MinaRuntimePlugin()],
  mode: 'none',
}
