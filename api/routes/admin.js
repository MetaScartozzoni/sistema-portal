const router = require('express').Router()
const { requireAuth, requireRole } = require('../middlewares/auth')
const { getServiceClient } = require('../config/supabase')

// Protege todas as rotas abaixo como admin
router.use(requireAuth, requireRole('admin'))

router.get('/ping', (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString(), request_id: req.ctx?.id })
})

router.get('/flags', async (req, res, next) => {
  try {
    const srv = getServiceClient()
    // flags globais atuais (module.*)
    const { data: rows } = await srv
      .from('settings')
      .select('key,value,is_active')
      .eq('scope', 'global')
      .ilike('key', 'module.%')
    const flags = {}
    for (const r of rows || []) flags[r.key] = r.is_active !== false && (r.value === true || r.value === 'true' || r.value?.toString?.() === 'true')
    res.json({ ok: true, flags })
  } catch (e) { next(e) }
})

module.exports = router
