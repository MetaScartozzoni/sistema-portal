#!/usr/bin/env node
// Smoke das Edge Functions essenciais: health e get-user-painel
// Uso:
//   ACCESS_TOKEN=... node api/scripts/smoke-functions.js
// Opções (env):
//   FUNCTIONS_BASE=https://<ref>.functions.supabase.co  (default derivado de SUPABASE_URL ou project ref)

const fetch = global.fetch || ((...args) => import('node-fetch').then(({default: f}) => f(...args)))

function inferFunctionsBase() {
  const explicit = process.env.FUNCTIONS_BASE
  if (explicit) return explicit.replace(/\/$/, '')
  const supaUrl = process.env.SUPABASE_URL || ''
  if (supaUrl) {
    const m = supaUrl.match(/^https?:\/\/([^.]+)\./)
    if (m) return `https://${m[1]}.functions.supabase.co`
  }
  const ref = 'hcimldvemwlscilvejli'
  return `https://${ref}.functions.supabase.co`
}

async function smoke() {
  const base = inferFunctionsBase()
  const accessToken = process.env.ACCESS_TOKEN
  const results = { base }

  // health shallow
  try {
    const r = await fetch(`${base}/health`)
    results.health = { status: r.status, ok: r.ok }
  } catch (e) {
    results.health = { error: String(e.message || e) }
  }

  // health deep
  try {
    const r = await fetch(`${base}/health?deep=1`)
    results.health_deep = { status: r.status, ok: r.ok }
  } catch (e) {
    results.health_deep = { error: String(e.message || e) }
  }

  // get-user-painel (necessita token)
  if (!accessToken) {
    results.get_user_painel = { skipped: true, reason: 'ACCESS_TOKEN ausente' }
  } else {
    try {
      const r = await fetch(`${base}/get-user-painel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const body = await r.json().catch(() => ({}))
      results.get_user_painel = { status: r.status, ok: r.ok, body }
    } catch (e) {
      results.get_user_painel = { error: String(e.message || e) }
    }
  }

  console.log(JSON.stringify(results, null, 2))
}

smoke().catch((e) => { console.error(e); process.exit(1) })

