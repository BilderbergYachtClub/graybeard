const gulp = require('gulp')
const browserSync = require("browser-sync").create();
const pug = require('gulp-pug')
const postcss = require('gulp-postcss')
const source = require('vinyl-source-stream')
const rollupStream = require('@rollup/stream')
const clean = require('gulp-clean')
const rename = require('gulp-rename')
const fs = require('fs')

const { buildDir } = require('./graybeard.config')

let cache

// Destroys the build directory
gulp.task('clean', () => {
  return gulp.src(buildDir, { allowEmpty: true }).pipe(clean())
})

// Compiles javascript using rollup
gulp.task('javascript', () => {
  const config = require('./rollup.config.js')

  return rollupStream({ ...config, cache })
    .on('bundle', (bundle) => {
      cache = bundle
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(`${buildDir}/assets/scripts`))
    .pipe(browserSync.stream())
})

gulp.task('markup', () => {
  return gulp
    .src(['src/**/*.pug', '!src/_lib/**/*.pug'])
    .pipe(pug())
    .pipe(rename((path) => {
      if (path.basename !== 'index') {
        path.dirname += '/' + path.basename
        path.basename = "index"
      }
    }))
    .pipe(gulp.dest(buildDir))
    .pipe(browserSync.stream())
})

// Compiles stylesheets using postcss
gulp.task('stylesheets', () => {
  return gulp
    .src(['src/**/*.css', '!src/**/_components/**/*.css'])
    .pipe(postcss([
      require('postcss-easy-import'),
      require('postcss-nested'),
      require('tailwindcss'),
      require('autoprefixer')
    ]))
    .pipe(gulp.dest(buildDir))
    .pipe(browserSync.stream())
})


// Copies assets to the build directory
gulp.task('assets', () => {
  return gulp.src('src/**/*.{png,jpg,gif,svg,ico}')
    .pipe(gulp.dest(buildDir))
})

//
gulp.task('build', gulp.parallel(
  'markup',
  'javascript',
  'stylesheets',
  'assets'
))

// Watches for changes and rebuilds the project as necessary
gulp.task('watch', () => {
  gulp.watch('src/**/*.css', gulp.series('stylesheets'))
  gulp.watch('src/**/*.{pug, json}', gulp.series('markup'))
  gulp.watch('src/**/*.{png,jpg,svg,ico}', gulp.series('assets'))
  gulp.watch('src/**/*.js', gulp.series('javascript'))
})

gulp.task('serve', () => {
  browserSync.init({
    server: './build/',
    port: 4200,
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function (snippet, match) {
          return snippet + match;
        }
      }
    }
  })
})

gulp.task('default',
  gulp.series(
    'clean',
    'build',
    gulp.parallel('serve', 'watch')
  )
)
