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

const wep = require('webpack')

gulp.task('server', function watcher() {
	connect.server({
	    name: 'SuperServer',
	    root: [ROOT + '/dev'],
	    port: conf.dev.port ,
	    livereload: true
	})
})

gulp.task('reload', function watcher() {
	connect.reload()
})

gulp.task('build:dev', function watcher() {

    gulp.src('./src/index.js')
		.pipe(webpack(webpackDevConfig))
        .pipe(gulp.dest('dev'))

})

gulp.task('dev', ['server'] ,function watcher() {

	gulp.watch(['src/**/*.js','src/index.js'],() => {

	    gulp.src('./src/index.js')
			.pipe(webpack(webpackDevConfig))
	        .pipe(gulp.dest('dev'))
	        .pipe(connect.reload())
	        
	})

});