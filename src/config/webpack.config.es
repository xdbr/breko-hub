import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { APP, STATIC, STYLES } from '~/src/config/paths'
import IsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin'
import isomorphicConfig from '~/src/config/isomorphic.config'

const isoToolsPlugin = new IsomorphicToolsPlugin(isomorphicConfig)

export default {
  entry: {
    head: [
      `${APP}/utils/loadCSS.js`,
    ],
    body: [
      `${APP}/entry.es`,
    ],
  },
  output: {
    path: STATIC,
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  resolve: {
    root: APP,
    modulesDirectories: [ 'node_modules', STYLES ],
    extensions: [
      '', '.js', '.jsx', '.es', '.es6', '.scss',
    ],
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'DEBUG': JSON.stringify(process.env.DEBUG),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'head',
    }),
    new ExtractTextPlugin('[name].[hash].css',{
      allChunks: true,
    }),
  ],
  module: {
    loaders: [ {
      // test: /.*\.(gif|png|jpe?g|svg)$/i,
      test: isoToolsPlugin.regular_expression('images'),
      loader: 'url-loader?limit=10240',
      // loader: 'file',
    // }, {
    //   test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
    //   loader: "url?limit=10000&minetype=application/font-woff"
    // }, {
    //   test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    //   loader: "url?limit=10000&minetype=application/octet-stream"
    // }, {
    //   test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    //   loader: "file"
    // }, {
    //   test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    //   loader: "url?limit=10000&minetype=image/svg+xml"
    }, {
      test: /\.json$/i,
      loader: 'json',
    } ],
  },
}
