const webpack = require('webpack')
const path = require('path')
const GLOBAL_CONFIG = require('../config/dev.env.js')

const ROOT_PATH = path.resolve(__dirname, '../')

module.exports = {
  devServer: {
    port: process.env.PORT || 8081,
    hot: true,
    inline: true,
    progress: true,
    contentBase: path.resolve(ROOT_PATH, 'dist'),
    historyApiFallback: true,
    disableHostCheck: true,
    compress: true,
    open: true,
    overlay: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: { // 配置单文件组件样式表用到的所有css预处理器
                css: [
                  'style-loader',
                  'css-loader',
                  'postcss-loader'
                ],
                less: [
                  'style-loader',
                  'css-loader',
                  'postcss-loader', 
                  'less-loader'
                ]
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
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]  
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(GLOBAL_CONFIG) //向代码里注入配置文件的变量
  ]
}

