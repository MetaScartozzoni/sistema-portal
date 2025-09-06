const { randomUUID } = require('crypto')

function requestContext(req, res, next) {
  req.ctx = {
    id: randomUUID(),
    start: Date.now(),
  }
  res.setHeader('X-Request-Id', req.ctx.id)
  next()
}

module.exports = { requestContext }

