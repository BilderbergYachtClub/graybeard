const gulp = require('gulp')
const pug = require('gulp-pug')
const livereload = require('gulp-livereload')
const postcss = require('gulp-postcss')

gulp.task('html', () => {
  return gulp
    .src(['src/**/*.pug', '!src/components/*'])
    .pipe(pug())
    .pipe(gulp.dest('build/'))
    .pipe(livereload())
})

gulp.task('css', () => {
  return gulp
    .src(['src/styles/**/*.css', '!src/styles/**/_*.css'])
    .pipe(postcss())
    .pipe(gulp.dest('build/styles'))
    .pipe(livereload())
})

gulp.task('dev', () => {
  livereload.listen()
  gulp.watch('src/**/*.pug', gulp.series('html'))
  gulp.watch('src/**/*.css', gulp.series('css'))
})
