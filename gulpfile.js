const gulp = require('gulp')
const pug = require('gulp-pug')
const postcss = require('gulp-postcss')
const babel = require('gulp-babel')
const livereload = require('gulp-livereload')
const clean = require('gulp-clean')

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

gulp.task('clean', () => {
  return gulp.src('build', { read: false }).pipe(clean())
})

gulp.task('build', gulp.parallel('js', 'html', 'css'))

gulp.task('dev', () => {
  let config = {
    ignoreInitial: false
  }

  livereload.listen()

  gulp.watch('src/**/*.pug', gulp.series('html'), config)
  gulp.watch('src/styles/**/*.css', gulp.series('css'), config)
  gulp.watch('src/scripts/**/*.js', gulp.series('js'), config)
})
