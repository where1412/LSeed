const conf = require('../conf.js')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const merge = require('webpack-merge')


var common = require('./base.config.js')

module.exports = merge (common,{
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
		      warnings: false,
		      drop_console: false,
		    },
		    ecma : 5
		})
		//new BundleAnalyzerPlugin()
	]
})