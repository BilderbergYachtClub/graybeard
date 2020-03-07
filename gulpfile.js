const gulp = require('gulp')
const pug = require('gulp-pug')
const postcss = require('gulp-postcss')
const babel = require('gulp-babel')
const data = require('gulp-data')
const assignToPug = require('gulp-assign-to-pug')
const livereload = require('gulp-livereload')
const clean = require('gulp-clean')

const { buildDir, dataSource } = require('./graybeard.config')

gulp.task('html', () => {
  return gulp
    .src(['src/**/*.pug', '!src/_*/*', '!src/**/_*'])
    .pipe(pug())
    .pipe(gulp.dest(buildDir))
    .pipe(livereload())
})

gulp.task('css', () => {
  return gulp
    .src(['src/styles/**/*.css', '!src/styles/**/_*.css'])
    .pipe(postcss())
    .pipe(gulp.dest(`${buildDir}/styles`))
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
    .pipe(gulp.dest(`${buildDir}/scripts`))
    .pipe(livereload())
})

gulp.task('assets', () => {
  return gulp
    .src('src/assets/**/*')
    .pipe(gulp.dest(`${buildDir}/assets`))
    .pipe(livereload)
})

gulp.task('data', () => {
  if (!dataSource) return

  let { source, format, template, destination } = dataSource

  let build = () => {
    return gulp
      .src(`src/${source}/**/*.${format}`)
      .pipe(data(file => JSON.parse(file.contents)))
      .pipe(assignToPug(`src/_templates/${template}.pug`))
  }

  return build()
    .pipe(gulp.dest(`${buildDir}/${destination}`))
    .pipe(livereload())
})

gulp.task('clean', () => {
  return gulp.src(buildDir, { read: false }).pipe(clean({ allowEmpty: true }))
})

gulp.task('build', gulp.parallel('js', 'html', 'css', 'assets', 'data'))

gulp.task('dev', () => {
  livereload.listen()
  gulp.watch('src/**/*', gulp.series('html', 'assets', 'css', 'js'), {
    ignoreInitial: false
  })
})
