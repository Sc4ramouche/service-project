const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', function() {
  gulp.src('./assets/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css')); 
});

gulp.task('sass:watch', function() {
  gulp.watch('./assets/scss/**/*.scss', ['sass']);
});