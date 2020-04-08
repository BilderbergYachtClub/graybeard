const clean = require('gulp-clean')
const cleanCSS = require('gulp-clean-css')
const frontMatter = require('gulp-front-matter')
const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const inlineSource = require('gulp-inline-source')
const layout = require('gulp-layout')
const markdown = require('gulp-markdown')
const postcss = require('gulp-postcss')
const pug = require('gulp-pug')
const purgecss = require('gulp-purgecss')
const rename = require('gulp-rename')
const webpack = require('webpack-stream')

const { buildDir } = require('./graybeard.config')
const { handleError } = require('./utils/build')

// Destroys the build directory
gulp.task('clean', () => {
  return gulp.src(buildDir, { allowEmpty: true }).pipe(clean())
})

// Compiles javascript using rollup
gulp.task('javascript', () => {
  return gulp.src('src/index.js')
    .pipe(webpack(require('./webpack.config')))
    .pipe(gulp.dest(buildDir))
})

gulp.task('markup', () => {
  return gulp
    .src(['src/**/*.pug', '!src/template/**'])
    .pipe(pug({ pretty: true }).on('error', handleError))
    .pipe(rename((path) => {
      if (path.basename !== 'index') {
        path.dirname += '/' + path.basename
        path.basename = 'index'
      }
    }))
    .pipe(gulp.dest(buildDir))
})

gulp.task('markdown', () => {
  return gulp
    .src('src/**/*.md')
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout(file => file.frontMatter))
    .pipe(gulp.dest(buildDir))
})

gulp.task('html:optimized', gulp.series('markup', 'markdown', () => {
  return gulp.src(buildDir + '/**/*.html')
    .pipe(inlineSource({ rootpath: process.cwd() + '/' + buildDir }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(gulp.dest(buildDir))
}))

gulp.task('stylesheets', () => {
  return gulp
    .src('src/index.css')
    .pipe(postcss([
      require('postcss-easy-import'),
      require('postcss-nested'),
      require('tailwindcss'),
      require('autoprefixer')
    ]))
    .pipe(gulp.dest(buildDir))
})

gulp.task('stylesheets:optimized', gulp.series('stylesheets', () => {
  return gulp
    .src(buildDir + '/index.css')
    .pipe(purgecss({ content: [buildDir + '/**/*.html'] }))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest(buildDir))
}))

// Copies assets to the build directory
gulp.task('assets', () => {
  return gulp.src('src/**/*.{png,jpg,gif,svg,ico}')
    .pipe(gulp.dest(buildDir))
})

//
gulp.task('build', gulp.parallel(
  'markup',
  'markdown',
  'javascript',
  'stylesheets',
  'assets'
))

gulp.task('publish', gulp.series(
  'clean',
  'html:optimized',
  'stylesheets:optimized',
  'javascript',
  'assets'
))

// Watches for changes and rebuilds the project as necessary
gulp.task('watch', () => {
  gulp.watch('src/**/*.css', gulp.series('stylesheets'))
  gulp.watch('src/**/*.pug', gulp.series('markup'))
  gulp.watch('src/**/*.md', gulp.series('markdown'))
  gulp.watch('src/**/*.{png,jpg,svg,ico}', gulp.series('assets'))
  gulp.watch('src/**/*.js', gulp.series('javascript'))
})

gulp.task('default', gulp.series('clean', 'build', 'watch'))
