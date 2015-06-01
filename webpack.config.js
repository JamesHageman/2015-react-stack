var path = require('path');

module.exports = {
  context: __dirname + '/app',
  entry: './main.js',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  },
  devtool: process.env.NODE_ENV !== 'production' ? '#inline-source-map' : undefined,
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: /app/,
        loader: 'babel?stage=1'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  }
};
