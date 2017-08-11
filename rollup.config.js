const buble = require('rollup-plugin-buble')
const resolve = require('rollup-plugin-node-resolve')
const uglify = require('rollup-plugin-uglify')

const config = {
  entry: 'src/web.js',
  plugins: [
    buble(),
    resolve({
      jsnext: true
    })
  ],
  targets: [
    {
      dest: 'dist/containor.js',
      format: 'iife',
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
