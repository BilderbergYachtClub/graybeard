const handleError = error => {
}

module.exports = {
  handleError(error) {
    if (process.env.NODE_ENV === 'produciton') {
      throw new Error(error)
    } else {
      console.error(error)
    }
  }
}
