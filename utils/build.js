const pug = require('gulp-pug')
const markdown = require('gulp-markdown')

const handleError = error => {
  if (process.env.NODE_ENV === 'produciton') {
    throw new Error(error)
  } else {
    console.error(error)
  }
}

module.exports = {
  templates: {
    pug () {
      return pug({ pretty: true }).on('error', handleError)
    },
    markdown () {
      return markdown()
    }
  }
}
