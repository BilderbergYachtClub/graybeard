const webpack = require('webpack')
const path = require('path')
const { buildDir } = require('./graybeard.config.js')

const outputDir = path.resolve(__dirname, buildDir)

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: path.resolve(__dirname, 'src'),
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map',
    })
  ],
  output: {
    path: outputDir,
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: ['babel-loader']
    }]
  }
}
