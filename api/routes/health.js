const router = require('express').Router()
const { getAnonClient } = require('../config/supabase')

router.get('/', async (req, res) => {
  const deep = req.query.deep === '1' || req.query.deep === 'true'
  const out = {
    status: 'ok',
    ts: new Date().toISOString(),
    request_id: req.ctx?.id,
  }
  if (deep) {
    try {
      const supa = getAnonClient()
      const { error } = await supa.from('ai_messages').select('id', { count: 'exact', head: true }).limit(1)
      out.db = { reachable: !error, error: error?.message }
    } catch (e) {
      out.db = { reachable: false, error: String(e.message || e) }
    }
  }
  res.json(out)
})

module.exports = router

