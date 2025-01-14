const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    mapbuilder: './main.js',
    mapbuilderadmin: './mainadmin.js'
  },
  output: {
    path: __dirname+'/dist/',
    chunkFilename: '[name].bundle.js',
    filename: '[name].js'
  },
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false)
    })
  ]
};