const pages = require('../pages.js')
const conf = require('../conf.js')
const path = require('path')
const ROOT = path.resolve(__dirname, '../../')
const HtmlWebpackPlugin = require('html-webpack-plugin')

var plugins = []

pages.forEach((page) => {
	let htmlPlugin = new HtmlWebpackPlugin({
		filename: `${page}/index.html`,
		template: path.resolve(ROOT,conf.sourceDir,conf.htmlTpl),
		hash: true,
		xhtml: true,
		chunks : [page,'main','lib']
	})
	plugins.push(htmlPlugin);
});
plugins.push(new HtmlWebpackPlugin({
	filename: 'index.html',
	template: path.resolve(ROOT,conf.sourceDir,conf.htmlTpl),
	hash: true,
	xhtml: true,
	chunks : ['main']
}))
module.exports = plugins