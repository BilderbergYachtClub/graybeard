const express = require('express')
const livereload = require('livereload')
const livereloadMiddleware = require('connect-livereload')
const app = express();
const port = process.env.PORT || 3000
const staticDir = process.env.STATIC_DIR || 'public'

livereload
  .createServer({ delay: 200 })
  .watch(staticDir)

app.use(livereloadMiddleware())
app.use(express.static(staticDir))
app.listen(port)
