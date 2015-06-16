var path = require('path');
var autoprefixer = require('autoprefixer-core');

var DEVELOPMENT = (process.env.NODE_ENV !== 'production');

module.exports = {
  context: __dirname + '/app',
  entry: './main.js',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  },
  devtool: DEVELOPMENT ? '#inline-source-map' : undefined,
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        exclude: /node_modules/
      }
    ],

    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel?stage=1'
      },
      // .less files in /app/components/ are locally scoped
      {
        test: /\.less$/,
        exclude: /(node_modules|global)/,
        loader: DEVELOPMENT ?
            'style!css?module&importLoaders=2&localIdentName=[path][name]---[local]---[hash:base64:5]!postcss!less'
          :
            'style!css?module&importLoaders=2&localIdentName=[hash:base64:5]!postcss!less'
      },
      // other stylesheets are globally scoped
      {
        test: /\.less$/,
        exclude: /app\/components/,
        loader: DEVELOPMENT ?
            'style!css?importLoaders=2!postcss!less'
          :
            'style!css?importLoaders=2!postcss!less'
      },
      {
        test: /\.css$/,
        loader: DEVELOPMENT ?
            'style!css?importLoaders=1!postcss'
          :
            'style!css?importLoaders=1!postcss'
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
    require('autoprefixer-core')
  ],
  eslint: {
    emitError: true,
    failOnError: true
  }
};
