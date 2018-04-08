const gulp = require('gulp')
const webpack = require('webpack-stream')
const webpackServer = require('webpack-dev-server')
const devConf = require('../conf.js').dev
const webpackDevConfig = require('../webpack/dev.config.js')
const path = require('path')
const watch = require('gulp-watch')
const connect = require('gulp-connect')
const ROOT = path.resolve(__dirname, '../../')
const conf = require('../conf.js')

gulp.task('server', function watcher() {
	connect.server({
	    name: 'SuperServer',
	    root: [ROOT + '/dev'],
	    port: conf.dev.port ,
	    livereload: true
	})
})
