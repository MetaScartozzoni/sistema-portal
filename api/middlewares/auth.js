const { getAnonClient, getServiceClient } = require('../config/supabase')

async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || ''
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing Bearer token' })
    const token = auth.slice(7)

    const supa = getAnonClient({ Authorization: `Bearer ${token}` })
    const { data, error } = await supa.auth.getUser()
    if (error || !data?.user) return res.status(401).json({ error: 'Invalid token' })

    req.user = data.user
    req.authToken = token

    // hydrate profile (optional, tolerant to failure)
    try {
      const srv = getServiceClient()
      const { data: profile } = await srv.from('profiles').select('*').eq('id', req.user.id).maybeSingle()
      if (profile) req.profile = profile
    } catch (_) {}

    next()
  } catch (e) {
    next(e)
  }
}

module.exports = { requireAuth }
