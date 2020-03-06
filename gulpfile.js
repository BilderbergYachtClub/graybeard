const gulp = require('gulp')
const pug = require('gulp-pug')
const livereload = require('gulp-livereload')

gulp.task('html', () => {
  return gulp
    .src(['src/**/*.pug', '!src/components/*'])
    .pipe(pug())
    .pipe(gulp.dest('build/'))
    .pipe(livereload())
})

gulp.task('dev', () => {
  livereload.listen()
  gulp.watch('src/**/*.pug', gulp.series('html'))
})
