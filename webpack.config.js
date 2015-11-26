/*eslint-env node */
var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer-core');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var NODE_ENV = process.env.NODE_ENV || 'development';
var DEVELOPMENT = (NODE_ENV !== 'production');

var cssTextPlugin = new ExtractTextPlugin('client.bundle.css');

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  }),

  new webpack.PrefetchPlugin('bootstrap/less/bootstrap.less'),
  new webpack.PrefetchPlugin('react'),
  new webpack.PrefetchPlugin('react-router'),
  new webpack.PrefetchPlugin('./components/connect.js'),
  new webpack.PrefetchPlugin('./components/ui/Icon.js'),

  /*
    Automatically provide jQuery for libraries that use it (like Bootstrap).
    This plugin adds jQuery = require('jquery'); to the top of such files.
   */
  new webpack.ProvidePlugin({
    jQuery: 'jquery'
  }),

  cssTextPlugin
];

if (!DEVELOPMENT) {
  plugins.push(new webpack.optimize.OccurenceOrderPlugin());
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: false,
        warnings: false
      }
    })
  );
}

module.exports = {
  context: path.join(__dirname, '/app'),
  entry: [
    './index.html',
    './main.js'
  ],
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js'
  },
  devtool: DEVELOPMENT ? '#inline-source-map' : undefined,
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader'
      }
    ],

    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      // .less files in /app/components/ are locally scoped
      {
        test: /\.less$/,
        exclude: /(node_modules|global)/,
        loader: DEVELOPMENT ?
                cssTextPlugin.extract('style-loader',
                  'css?module&importLoaders=2&' +
                  'localIdentName=[path][name]---[local]---[hash:base64:5]&' +
                  'sourceMap!postcss!less?sourceMap')
              :
                cssTextPlugin.extract('style-loader',
                  'css?module&importLoaders=2&localIdentName=[hash:base64:5]' +
                  '!postcss!less')
      },
      // other stylesheets are globally scoped
      {
        test: /\.less$/,
        exclude: path.join(__dirname, '/app/components'),
        loader: DEVELOPMENT ?
            cssTextPlugin.extract('style-loader',
                                  'css?importLoaders=2&sourceMap!postcss!' +
                                  'less?sourceMap')
          :
            cssTextPlugin.extract('style-loader',
                                  'css?importLoaders=2!postcss!less')
      },
      {
        test: /\.css$/,
        loader:
          DEVELOPMENT ?
            cssTextPlugin.extract('style-loader',
                                  'css?importLoaders=1&sourceMap!postcss')
          :
            cssTextPlugin.extract('style-loader', 'css?importLoaders=1!postcss')
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=10000&minetype=application/font-woff' +
          (DEVELOPMENT ? '&name=[name]_[hash].[ext]' : '')
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: DEVELOPMENT ? 'file?name=[name]_[hash].[ext]' : 'file'
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url?limit=10000' +
          (DEVELOPMENT ? '&name=[name]_[hash].[ext]' : '')
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      }
    ]
  },
  postcss: [
    autoprefixer
  ],
  eslint: {
    emitError: true,
    failOnError: true,
    formatter: require('eslint-friendly-formatter')
  },
  plugins: plugins
};
