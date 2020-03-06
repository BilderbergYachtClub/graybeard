const gulp = require('gulp')
const pug = require('gulp-pug')
const postcss = require('gulp-postcss')
const babel = require('gulp-babel')
const livereload = require('gulp-livereload')

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

gulp.task('js', () => {
  return gulp
    .src('src/scripts/app.js')
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(gulp.dest('build/scripts'))
    .pipe(livereload())
})

gulp.task('dev', () => {
  let config = {
    ignoreInitial: false
  }

  livereload.listen()

  gulp.watch('src/**/*.pug', gulp.series('html'), config)
  gulp.watch('src/styles/**/*.css', gulp.series('css'), config)
  gulp.watch('src/scripts/**/*.js', gulp.series('js'), config)
})
