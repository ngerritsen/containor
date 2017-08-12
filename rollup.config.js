const buble = require('rollup-plugin-buble')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const uglify = require('rollup-plugin-uglify')

const config = {
  entry: 'src/container.js',
  plugins: [
    buble(),
    nodeResolve(),
    commonjs()
  ],
  targets: [
    {
      dest: 'dist/containor.js',
      format: 'iife',
      moduleName: 'Containor',
      sourceMap: true
    }
  ]
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(uglify())
  config.targets[0].sourceMap = false
  config.targets[0].dest = 'dist/containor.min.js'
}

module.exports = config
