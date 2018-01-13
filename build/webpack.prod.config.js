const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const GLOBAL_CONFIG = require('../config/prod.env.js')

module.exports = {
  devtool: '#cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: { // 配置单文件组件样式表用到的所有css预处理器
                css: ExtractTextPlugin.extract({
                  use: [
                    'css-loader?minimize',
                    'postcss-loader'
                  ],
                  fallback: 'vue-style-loader'
                }),
                less: ExtractTextPlugin.extract({
                    use: [
                      'css-loader?minimize',
                      'postcss-loader',
                      'less-loader'
                    ],
                    fallback: 'vue-style-loader'
                })
              }
            }
          },
          {
            loader: 'iview-loader',
            options: {
              prefix: false // 禁止iview组件使用前缀写法，如<i-row></i-row>
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: [
            'css-loader?minimize',
            'postcss-loader',
            'less-loader'
          ],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            'css-loader?minimize',
            'postcss-loader'
          ],
          fallback: 'style-loader'
        })  
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {root: path.resolve(__dirname, '../')}),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    }), // 提取不变的js库单独生成js便于缓存
    new webpack.optimize.UglifyJsPlugin({ // 压缩js
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: '#cheap-module-source-map'
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true //当有多个js文件时需要将此项设置为true
    }),
    new webpack.DefinePlugin(GLOBAL_CONFIG) //向代码里注入配置文件的变量
  ]
}

