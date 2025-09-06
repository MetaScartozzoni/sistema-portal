const router = require('express').Router()
const { requireAuth } = require('../middlewares/auth')
const { getAnonClient } = require('../config/supabase')

// GET /auth/me -> retorna user (Supabase) e profile (se existir)
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    res.json({ ok: true, user: req.user, profile: req.profile || null })
  } catch (e) { next(e) }
})

// POST /auth/ensure-patient-self -> chama RPC ensure_patient_self() no contexto do usuário
router.post('/ensure-patient-self', requireAuth, async (req, res, next) => {
  try {
    const token = req.authToken
    const supa = getAnonClient({ Authorization: `Bearer ${token}` })
    const { error } = await supa.rpc('ensure_patient_self')
    if (error) return res.status(400).json({ ok: false, error: error.message })
    res.json({ ok: true })
  } catch (e) { next(e) }
})

module.exports = router

