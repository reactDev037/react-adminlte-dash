import * as path from 'path';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackRemarkPlugin from 'html-webpack-remark-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import SystemBellPlugin from 'system-bell-webpack-plugin';
import CleanPlugin from 'clean-webpack-plugin';
import merge from 'webpack-merge';
import React from 'react';
import ReactDOM from 'react-dom/server';

import App from './demo/App';
import pkg from './package.json';

import js from 'highlight.js/lib/languages/javascript';

const RENDER_UNIVERSAL = true;
const TARGET = process.env.npm_lifecycle_event;
const ROOT_PATH = __dirname;
const config = {
  paths: {
    readme: path.join(ROOT_PATH, 'README.md'),
    dist: path.join(ROOT_PATH, 'dist'),
    src: path.join(ROOT_PATH, 'src'),
    demo: path.join(ROOT_PATH, 'demo'),
    tests: path.join(ROOT_PATH, 'tests'),
  },
  filename: 'bundle',
  library: 'React-AdminLTE',
};
const STYLE_ENTRIES = [
  'bootstrap/dist/css/bootstrap.css',
  'font-awesome/css/font-awesome.css',
  'highlight.js/styles/github.css',
  'react-ghfork/gh-fork-ribbon.ie.css',
  'react-ghfork/gh-fork-ribbon.css',
  './src/styles/less/AdminLTE.less',
  './src/styles/less/skins/_all-skins.less',
];
let extractCSS = new ExtractTextPlugin('[contenthash].css');
let extractLESS = new ExtractTextPlugin('[contenthash].css');

process.env.BABEL_ENV = TARGET;

const demoCommon = {
  resolve: {
    extensions: ['', '.js', '.jsx', '.css', '.less']
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: [
          config.paths.demo,
          config.paths.src,
        ],
      },
    ],
    loaders: [
      {
        test: /\.png$/,
        loader: 'url?limit=100000&mimetype=image/png',
        include: config.paths.demo,
      },
      {
        test: /\.jpg$/,
        loader: 'file',
        include: config.paths.demo,
      },
      {
        test: /\.json$/,
        loader: 'json',
        include: path.join(ROOT_PATH, 'package.json'),
      },
      { test: /\.(ttf|eot|svg|gif)(\?[\s\S]+)?$/, loader: 'file' },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
    ],
  },
  plugins: [
    new SystemBellPlugin(),
  ],
};

if (TARGET === 'start') {
  module.exports = merge(demoCommon, {
    devtool: 'eval-source-map',
    entry: {
      demo: [config.paths.demo].concat(STYLE_ENTRIES),
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"development"',
      }),
      new HtmlWebpackPlugin({
        title: pkg.name + ' - ' + pkg.description,
        template: 'lib/index_template.ejs',

        // Context for the template
        name: pkg.name,
        description: pkg.description,
        demonstration: '',
      }),
      new HtmlWebpackRemarkPlugin({
        key: 'documentation',
        file: config.paths.readme,
        languages: {
          js,
        },
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
        },
        {
          test: /\.less$/,
          loaders: ['style', 'css', 'less'],
        },
        {
          test: /\.jsx?$/,
          loaders: ['babel?cacheDirectory'],
          include: [
            config.paths.demo,
            config.paths.src,
          ],
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      host: process.env.HOST,
      port: process.env.PORT,
      stats: 'errors-only',
    },
  });
}

function NamedModulesPlugin(options) {
  this.options = options || {};
}
NamedModulesPlugin.prototype.apply = function(compiler) {
  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('before-module-ids', function(modules) {
      modules.forEach(function(module) {
        if(module.id === null && module.libIdent) {
          var id = module.libIdent({
            context: this.options.context || compiler.options.context,
          });

          // Skip CSS and LESS files since those go through ExtractTextPlugin
          if(!id.endsWith('.css') && !id.endsWith('.less')) {
            module.id = id;
          }
        }
      }, this);
    }.bind(this));
  }.bind(this));
};

if (TARGET === 'gh-pages' || TARGET === 'gh-pages:stats') {
  module.exports = merge(demoCommon, {
    entry: {
      app: config.paths.demo,
      vendors: [
        'react',
      ],
      style: STYLE_ENTRIES,
    },
    output: {
      path: './gh-pages',
      filename: '[name].[chunkhash].js',
      chunkFilename: '[chunkhash].js',
    },
    plugins: [
      new CleanPlugin(['gh-pages'], {
        verbose: false,
      }),
      extractCSS,
      extractLESS,
      new webpack.DefinePlugin({
          // This affects the react lib size
        'process.env.NODE_ENV': '"production"',
      }),
      new HtmlWebpackPlugin({
        title: pkg.name + ' - ' + pkg.description,
        template: 'lib/index_template.ejs',

        // Context for the template
        name: pkg.name,
        description: pkg.description,
        demonstration: RENDER_UNIVERSAL ? ReactDOM.renderToString(<App />) : '',
      }),
      new HtmlWebpackRemarkPlugin({
        key: 'documentation',
        file: config.paths.readme,
        languages: {
          js,
        },
      }),
      new NamedModulesPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendors', 'manifest'],
      }),
    ],
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: extractCSS.extract('style', 'css?sourceMap'),
        },
        {
          test: /\.less$/,
          loader: extractLESS.extract('style', 'css?SourceMap!less?sourceMap'),
        },
        {
          test: /\.jsx?$/,
          loaders: ['babel'],
          include: [
            config.paths.demo,
            config.paths.src,
          ],
        },
      ],
    },
  });
}

// !TARGET === prepush hook for test
if (TARGET === 'test' || TARGET === 'test:tdd' || !TARGET) {
  module.exports = merge(demoCommon, {
    module: {
      preLoaders: [
        {
          test: /\.jsx?$/,
          loaders: ['isparta', 'eslint'],
          include: [
            config.paths.tests,
          ],
        },
      ],
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ['babel?cacheDirectory'],
          include: [
            config.paths.src,
            config.paths.tests,
          ],
        },
      ],
    },
  })
}

const distCommon = {
  devtool: 'source-map',
  output: {
    path: config.paths.dist,
    libraryTarget: 'umd',
    library: config.library
  },
  entry: {
    app: config.paths.src,
    vendors: [
      'react',
    ],
    style: STYLE_ENTRIES,
  },
  externals: {
    'react': {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    }
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: extractCSS.extract('style', 'css?sourceMap'),
      },
      {
        test: /\.less$/,
        loader: extractLESS.extract('style', 'css?SourceMap!less?sourceMap'),
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: config.paths.src
      },
      { test: /\.(ttf|eot|svg|gif)(\?[\s\S]+)?$/, loader: 'file' },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
    ]
  },
  plugins: [
    extractCSS,
    extractLESS,
    new SystemBellPlugin()
  ]
};

if (TARGET === 'dist') {
  module.exports = merge(distCommon, {
    output: {
      filename: config.filename + '.js'
    }
  });
}

if (TARGET === 'dist:min') {
  module.exports = merge(distCommon, {
    output: {
      filename: config.filename + '.min.js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}
