const { logger } = require('../lib/logger')

function requestLogger(req, res, next) {
  if (process.env.ENABLE_REQUEST_LOGGING !== 'true') return next()
  const start = Date.now()
  const { id } = req.ctx || {}
  res.on('finish', () => {
    logger.info('http', {
      request_id: id,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration_ms: Date.now() - start,
      user_agent: req.headers['user-agent'],
      ip: req.ip,
    })
  })
  next()
}

module.exports = { requestLogger }

