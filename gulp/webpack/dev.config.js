const conf = require('../conf.js')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ROOT = path.resolve(__dirname, '../../')
const pages = require('../pages.js')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const merge = require('webpack-merge')


var common = require('./base.config.js')

module.exports = merge (common,{
	devtool: 'cheap-eval-source-map',
	plugins: [

		// 升级到4后要舍弃  但ProvidePlugin报错？？？？ 
		new webpack.optimize.CommonsChunkPlugin({
			name: "lib",
			filename: "lib.js",
			minChunks: function (module) {
			    return module.context && module.context.includes("node_modules");
			}
		})
		//new BundleAnalyzerPlugin()
	]
})