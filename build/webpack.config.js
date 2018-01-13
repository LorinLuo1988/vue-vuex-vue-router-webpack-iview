const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const webpackEnvConfig = {
    development: require('./webpack.dev.config.js'),
    production: require('./webpack.prod.config.js')
}

const ROOT_PATH = path.resolve(__dirname, '../')
const SRC_PATH = path.resolve(ROOT_PATH, 'src')
const NODE_ENV = process.env.NODE_ENV;

let commonConfig = {
	entry: {
		app: path.resolve(SRC_PATH, 'main.js'),
		vendor: ['vue', 'vuex', 'vue-router', 'iview']
	},
	output: {
		path: path.resolve(ROOT_PATH, 'dist'),
		filename: '[name].bundle.js',
    chunkFilename: '[name].[chunkHash].bundle.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				enforce: 'pre', //防止eslint在代码检查前，代码被其他loader修改
				test: /\.(vue|jsx?)$/,
				loader: 'eslint-loader',
				exclude: /node_modules/
			},
      {
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
      },
      {
      	test: /iview\/*.*js$/,
      	loader: 'babel-loader'
      },
			{
				test: /\.(png|jpe?g|gif|woff|svg|eot|ttf)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
				}
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			favicon: path.resolve(ROOT_PATH, 'favicon.ico'),
      template: path.resolve(ROOT_PATH, 'index.html'),
      chunks: ['app', 'vendor'],
      hash: true
		})
	],
	resolve: {
    extensions: ['.js', '.vue', '.less', '.css', '.json'],
		alias: {
      'vue': 'vue/dist/vue.esm.js',
      '@': SRC_PATH
		}
	}
}

module.exports = webpackMerge(
	commonConfig,
	webpackEnvConfig[NODE_ENV]
)