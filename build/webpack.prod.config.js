var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: false,
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js'
        }), // 提取不变的js库单独生成js便于缓存
        new webpack.optimize.UglifyJsPlugin({ // 压缩js
            compress: {
                warnings: false
            },
            output: {
                comments: false // remove all comments
            }
        })
    ]
};
