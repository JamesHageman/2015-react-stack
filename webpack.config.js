var path = require('path');
var autoprefixer = require('autoprefixer-core');

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
        exclude: /node_modules/,
        loader: 'babel?stage=1'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: process.env.NODE_ENV !== 'production' ?
            'style!css?module&importLoaders=1&localIdentName=[path][name]---[local]---[hash:base64:5]!postcss'
          :
            'style!css?module&importLoaders=1&localIdentName=[hash:base64:5]!postcss'
      },
      {
        test: /\.css$/,
        exclude: /app/,
        loader: 'style!css!postcss'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  postcss: [
    require('autoprefixer-core'),
    require('postcss-nested'),
    require('postcss-simple-vars')({variables: require('./app/constants/UIConstants.js')})
  ]
};
