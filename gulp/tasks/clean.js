const gulp = require('gulp');
const clean = require('gulp-clean');

gulp.task('clean-dev', function (done) {
    gulp.src(['dev/*'])
        .pipe(clean())
        .on('end', done)
})

gulp.task('clean-build', function (done) {
    gulp.src(['build/*'])
        .pipe(clean())
        .on('end', done)
})