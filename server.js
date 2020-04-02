const express = require('express')
const livereload = require('livereload')
const livereloadMiddleware = require('connect-livereload')
const app = express();
const { serverPort, buildDir } = require('./graybeard.config')

console.log(buildDir)
livereload
  .createServer({ delay: 200, usePolling: true })
  .watch(buildDir)

app.use(livereloadMiddleware({ port: 35729 }))
app.use(express.static(buildDir))
app.listen(serverPort)

console.info(`Server started at http://localhost:${serverPort}`)
