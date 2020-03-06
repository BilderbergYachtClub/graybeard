const { src, dest, watch } = require('gulp')
const pug = require('gulp-pug')

function html () {
  return src(['src/**/*.pug', '!src/includes/*'])
    .pipe(pug())
    .pipe(dest('build/'))
}

// exports.js = js;
// exports.css = css;
exports.html = html
exports.watch = function () {
  watch('src/**/*.pug', html)
}
