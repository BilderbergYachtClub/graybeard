const { src, dest, watch } = require('gulp')
const pug = require('gulp-pug')
const livereload = require('gulp-livereload')

function html () {
  return src(['src/**/*.pug', '!src/includes/*'])
    .pipe(pug())
    .pipe(dest('build/'))
    .pipe(livereload())
}

// exports.js = js;
// exports.css = css;
exports.html = html
exports.watch = function () {
  livereload.listen()
  watch('src/**/*.pug', html)
}
