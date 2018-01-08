const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '../');
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const NODE_ENV = process.env.NODE_ENV;

const webpackEnvConfig = {
    development: require('./webpack.dev.config.js'),
    production: require('./webpack.prod.config.js')
};

const GLOBAL_CONFIG = {
	development: require('../config/dev.env.js'),
	production: require('../config/prod.env.js')
}

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
				enforce: 'pre',
				test: /\.(vue|jsx?)$/,
				loader: 'eslint-loader',
				exclude: /node_modules/
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					extractCSS: true
				}
			},
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
            	test: /\.less$/,
            	loader: 'style-loader!css-loader!less-loader'
            },
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader"
				})
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
            template: path.resolve(ROOT_PATH, 'index.html'), //source
            chunks: ['app', 'vendor'],
            hash: true
		}),
    	new ExtractTextPlugin("style.css"),
        new webpack.DefinePlugin(GLOBAL_CONFIG[NODE_ENV])
	],
	resolve: {
    	extensions: ['.js', '.vue', '.less', '.json'],
		alias: {
            'vue': 'vue/dist/vue.esm.js',
            '@': SRC_PATH
		}
	}
};

module.exports = webpackMerge(
	commonConfig,
	webpackEnvConfig[NODE_ENV]
);