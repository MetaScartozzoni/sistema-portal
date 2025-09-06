import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { buildCors } from '../_shared/cors.ts'

const cors = buildCors()

type BookPayload = { doctor_id: string; start_time: string; end_time: string; patient_id?: string }
type IdPayload = { id: string }
type ReschedulePayload = { id: string; start_time: string; end_time: string }

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  try {
    const url = Deno.env.get('SUPABASE_URL')!
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!
    const svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY')!

    const auth = req.headers.get('authorization')
    if (!auth) return json({ error: 'no_auth' }, 401)

    const authed = createClient(url, anon, { global: { headers: { Authorization: auth } } })
    const srv = createClient(url, svc)

    const { data: ures } = await authed.auth.getUser()
    const user = ures?.user
    if (!user) return json({ error: 'unauthorized' }, 401)

    const body = await req.json().catch(() => ({})) as Record<string, unknown>
    const action = String(body.action || '').toLowerCase()
    if (!action) return json({ error: 'missing_action' }, 400)

    // Gate pelo módulo (settings)
    try {
      const { data: flags } = await authed.rpc('get_feature_flags', { _user_id: user.id })
      if (flags && (flags as any)['module.agenda'] === false) return json({ error: 'module_disabled', module: 'agenda' }, 423)
    } catch (_) { /* se RPC indisponível, segue */ }

    switch (action) {
      case 'book': {
        const p = body as unknown as BookPayload
        if (!p.doctor_id || !p.start_time || !p.end_time) return json({ error: 'invalid_payload' }, 422)
        const patient_id = p.patient_id || user.id
        const { data, error } = await srv.rpc('book_appointment_atomic', {
          doctor_id: p.doctor_id,
          patient_id,
          start_time: p.start_time,
          end_time: p.end_time,
        })
        if (error) {
          const msg = error.message || ''
          if (msg.includes('conflict')) return json({ error: 'conflict' }, 409)
          return json({ error: 'db_error', detail: msg }, 500)
        }
        return json({ ok: true, appointment: data })
      }
      case 'confirm':
      case 'check_in':
      case 'complete':
      case 'no_show':
      case 'cancel': {
        const p = body as unknown as IdPayload
        if (!p.id) return json({ error: 'invalid_payload' }, 422)
        const fn = `appointment_${action}`.replace('-', '_')
        const { error } = await srv.rpc(fn, { id: p.id })
        if (error) return json({ error: 'db_error', detail: error.message }, 500)
        return json({ ok: true })
      }
      case 'reschedule': {
        const p = body as unknown as ReschedulePayload
        if (!p.id || !p.start_time || !p.end_time) return json({ error: 'invalid_payload' }, 422)
        const { error } = await srv.rpc('appointment_reschedule', {
          id: p.id,
          start_time: p.start_time,
          end_time: p.end_time,
        })
        if (error) return json({ error: 'db_error', detail: error.message }, 500)
        return json({ ok: true })
      }
      default:
        return json({ error: 'unknown_action' }, 400)
    }
  } catch (e: any) {
    return json({ error: 'internal_error', detail: e?.message || String(e) }, 500)
  }
})

