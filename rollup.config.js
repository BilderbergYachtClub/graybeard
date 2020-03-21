const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

module.exports = {
  input: './src/assets/scripts/index.js',
  plugins: [
    babel({
      presets: ['@babel/env'],
      exclude: 'node_modules/**',
      babelrc: false
    }),
    resolve(),
    commonjs()
  ]
}
