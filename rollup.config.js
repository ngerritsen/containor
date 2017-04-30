import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'

const config = {
  entry: 'src/web.js',
  plugins: [
    buble({
      objectAssign: 'Object.assign'
    }),
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

export default config
