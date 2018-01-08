var webpack = require('webpack');
var path = require('path');

var ROOT_PATH = path.resolve(__dirname, '../');
var SRC_PATH = path.resolve(ROOT_PATH, 'src');

var DEV_GLOBAL_CONFIG = require('../config/dev.env.js');

module.exports = {
    devtool: false,
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
    }
};
