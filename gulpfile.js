const gulp = require('gulp')
const clean = require('gulp-clean')
const rename = require('gulp-rename')
const { templates: { pug, markdown } } = require('./utils/build')
const frontMatter = require('gulp-front-matter')
const layout = require('gulp-layout')
const postcss = require('gulp-postcss')
const cleanCSS = require('gulp-clean-css')
const { rollup } = require('rollup')
const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const babel = require('rollup-plugin-babel')
const { buildDir } = require('./graybeard.config')

// Destroys the build directory
gulp.task('clean', () => {
  return gulp.src(buildDir, { allowEmpty: true }).pipe(clean())
})

// Compiles javascript using rollup
gulp.task('javascript', () => {
  const input = 'src/index.js'

  return rollup({
    input,
    plugins: [
      resolve(),
      commonjs(),
      babel({
        presets: ['@babel/env'],
        exclude: 'node_modules/**',
        babelrc: false
      })
    ]
  }).then(bundle => {
    bundle.write({
      file: `${buildDir}/bundle.js`,
      format: 'umd',
      name: 'library',
      sourcemap: true
    })
  })
})

// Compiles pug files
gulp.task('markup', () => {
  return gulp
    .src(['src/**/*.pug', '!src/lib/**/*.pug'])
    .pipe(pug())
    .pipe(rename((path) => {
      if (path.basename !== 'index') {
        path.dirname += '/' + path.basename
        path.basename = 'index'
      }
    }))
    .pipe(gulp.dest(buildDir))
})

// Compiles markdown files
gulp.task('markdown', () => {
  return gulp
    .src('src/**/*.md')
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout(file => file.frontMatter))
    .pipe(gulp.dest(buildDir))
})

// Compiles stylesheets using postcss
gulp.task('stylesheets', () => {
  return gulp
    .src(['src/index.css', '!src/lib/**/*.css'])
    .pipe(postcss([
      require('postcss-easy-import'),
      require('postcss-nested'),
      require('tailwindcss'),
      require('autoprefixer')
    ]))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest(buildDir))
})

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

// Watches for changes and rebuilds the project as necessary
gulp.task('watch', () => {
  gulp.watch('src/**/*.css', gulp.series('stylesheets'))
  gulp.watch('src/**/*.pug', gulp.series('markup'))
  gulp.watch('src/**/*.md', gulp.series('markdown'))
  gulp.watch('src/**/*.{png,jpg,svg,ico}', gulp.series('assets'))
  gulp.watch('src/**/*.js', gulp.series('javascript'))
})

gulp.task('default', gulp.series('clean', 'build', 'watch'))
