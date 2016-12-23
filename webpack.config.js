const webpack = require('webpack')

const env = process.env.NODE_ENV
const config = {
  devtool: 'source-map',
  entry: './src/web.js',
  output: {
    path: 'dist',
    filename: 'containor.js'
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel',
        include: /src/
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
}

if (env === 'production') {
  delete config.devtool

  config.output.filename = 'containor.min.js'
  config.plugins.push(new webpack.optimize.UglifyJsPlugin())
}

module.exports = config
