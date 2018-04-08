const conf = require('../conf.js')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ROOT = path.resolve(__dirname, '../../')
const pages = require('../pages.js')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var entries = {}
pages.forEach((page) => {
	console.log('page',path.resolve(conf.sourceDir, 'page' ,page, 'index.js'))
  entries[page] = path.resolve(conf.sourceDir, 'page' ,page , 'index.js')
})
entries['main'] = path.resolve(conf.sourceDir, conf.entry)

var plugins = require('./base.plugin.js')

module.exports = {
	entry: entries,
	output: {
		filename: '[name]/[name].bundle.js',
		path: path.resolve(ROOT,conf.dev.dir),
		publicPath: '/',
		chunkFilename: "[name].js"
	},
	resolve: {
		alias: {
			'src': path.resolve(__dirname,'../../src'),
			'pages': path.resolve(__dirname,'../../src/pages')
		}
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				options: {
			        presets: [['env', { loose: true }]],
			        cacheDirectory: true,
			        //plugins: ['transform-runtime'],
			    }
			}
		]
	},
	plugins: plugins.concat([
		new webpack.ProvidePlugin({
		    THREE : "three/build/three.min.js",
		    Stats : 'stats-js',
		    dat : 'dat.gui'
		}),
		// 升级到4后要舍弃  但ProvidePlugin报错？？？？ 
		new webpack.optimize.CommonsChunkPlugin({
			name: "lib",
			filename: "lib.js",
			minChunks: function (module) {
			    return module.context && module.context.includes("node_modules");
			}
		})
		//new BundleAnalyzerPlugin()
	])
}