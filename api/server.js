require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const { requestContext } = require('./middlewares/requestContext')
const { requestLogger } = require('./middlewares/requestLogger')
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler')

const authRoutes = require('./routes/auth')
const healthRoutes = require('./routes/health')
const integrationRoutes = require('./routes/integration')
const adminRoutes = require('./routes/admin')

const PORT = process.env.PORT || 5000
const ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)

const app = express()

// Security headers
app.use(helmet({ contentSecurityPolicy: process.env.HELMET_ENABLE_CSP === 'true' ? undefined : false }))

// CORS
app.use(cors({ origin: ORIGINS.length ? ORIGINS : true, credentials: true }))

// Body parsers
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// Basic rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW || '900000', 10),
  max: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
})

// Request context (request id, timing, etc.)
app.use(requestContext)
app.use(requestLogger)

// Routes
app.use('/health', healthRoutes)
app.use('/auth', authLimiter, authRoutes)
if (process.env.ENABLE_INTEGRATION_ROUTES === 'true') {
  app.use('/integration', integrationRoutes)
}
app.use('/admin', adminRoutes)

// 404 and errors
app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`[api] listening on port ${PORT}`)
})
