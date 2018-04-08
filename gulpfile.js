const gulp = require('gulp')
const webpack = require('webpack-stream')
const uglify = require('gulp-uglify')

require('./gulp/tasks/dev.js')
require('./gulp/tasks/clean.js')
require('./gulp/tasks/release.js')

gulp.task('default', () =>
    gulp.src('./src/index.js')
		.pipe(webpack({
            output: {
                library: 'Seed',
                filename: 'seed.js'
            }
        }))
        .pipe(uglify('seed.min.js', {
            mangle: true,
            compress: true
        }))
        .pipe(gulp.dest('dist'))
)
