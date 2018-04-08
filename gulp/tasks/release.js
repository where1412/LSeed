const gulp = require('gulp')
const webpack = require('webpack-stream')
const webpackProdConfig = require('../webpack/prod.config.js')

const wep = require('webpack')

gulp.task('build:prod', function () {

    gulp.src('./src/index.js')
		.pipe(webpack(webpackProdConfig))
        .pipe(gulp.dest('dev'))

})
