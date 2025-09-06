function notFoundHandler(req, res, next) {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl })
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500
  const body = {
    error: err.name || 'Error',
    message: err.expose ? err.message : (process.env.NODE_ENV === 'development' ? err.message : 'Internal error'),
    request_id: req.ctx?.id,
  }
  if (process.env.NODE_ENV === 'development' && err.stack) body.stack = err.stack
  res.status(status).json(body)
}

module.exports = { errorHandler, notFoundHandler }

