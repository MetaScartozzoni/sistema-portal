// Webhook de Auth (Supabase) – sincroniza employees/doctors/patients
// Eventos: user.created, user.confirmed (user.updated opcional)
// Verificação de assinatura HMAC via cabeçalho X-Supabase-Signature

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { cors } from './_shared/cors.ts'

type AuthWebhookPayload = {
  type?: string
  event?: string
  record?: any
  user?: {
    id: string
    email?: string
    user_metadata?: Record<string, unknown>
  } | null
}

function base64UrlToBytes(b64url: string): Uint8Array {
  // Tolerante a base64url e sem padding
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(b64url.length / 4) * 4, '=')
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function verifySignature(rawBody: string, signatureB64: string | null, secret: string | undefined) {
  if (!signatureB64 || !secret) return false
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
  const sig = base64UrlToBytes(signatureB64)
  return await crypto.subtle.verify('HMAC', key, sig, enc.encode(rawBody))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY')!
    const WEBHOOK_SECRET = Deno.env.get('AUTH_WEBHOOK_SECRET')

    const raw = await req.text()
    const sig = req.headers.get('X-Supabase-Signature') || req.headers.get('x-supabase-signature')

    const ok = await verifySignature(raw, sig, WEBHOOK_SECRET)
    if (!ok) {
      return new Response(JSON.stringify({ error: 'invalid signature' }), { status: 401, headers: cors })
    }

    const payload = JSON.parse(raw) as AuthWebhookPayload
    const eventType = (payload.type ?? payload.event ?? 'unknown').toLowerCase()
    // Opcional: processe apenas eventos relevantes
    const allowed = ['user.created', 'user.confirmed', 'user.updated']
    if (!allowed.includes(eventType)) {
      return new Response(JSON.stringify({ ok: true, skipped: true, event: eventType }), { status: 202, headers: { ...cors, 'Cache-Control': 'no-store' } })
    }
    const u = payload.user ?? payload.record ?? null
    if (!u?.id) {
      return new Response(JSON.stringify({ error: 'missing user in payload' }), { status: 400, headers: cors })
    }

    const srv = createClient(SUPABASE_URL, SERVICE_KEY)

    // profile (se existir)
    const { data: profile } = await srv
      .from('profiles')
      .select('id, email, role, first_name, last_name')
      .eq('id', u.id)
      .maybeSingle()

    // role: profile.role > user_metadata.role > 'patient'
    const mdRole = (u.user_metadata?.role as string | undefined)?.toLowerCase()
    const role = (profile?.role ?? mdRole ?? 'patient') as 'admin' | 'employee' | 'receptionist' | 'doctor' | 'patient'
    const email = profile?.email ?? u.email ?? null
    const crm = (u.user_metadata as any)?.crm ?? null
    const specialty = (u.user_metadata as any)?.specialty ?? null

    let employees_created = false
    let doctors_created = false
    let patients_created = false

    // STAFF -> employees
    if (['admin', 'employee', 'receptionist', 'doctor'].includes(role)) {
      const { data: existsEmp } = await srv
        .from('employees')
        .select('user_id')
        .eq('user_id', u.id)
        .maybeSingle()
      if (!existsEmp) {
        const { error: insEmp } = await srv
          .from('employees')
          .upsert({
            user_id: u.id,
            email,
            role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id', ignoreDuplicates: true })
        if (insEmp) throw insEmp
        employees_created = true
      }
    }

    // DOCTOR extra
    if (role === 'doctor') {
      const { data: existsDoc } = await srv
        .from('doctors')
        .select('user_id')
        .eq('user_id', u.id)
        .maybeSingle()
      if (!existsDoc) {
        const { error: insDoc } = await srv
          .from('doctors')
          .upsert({
            user_id: u.id,
            crm,
            specialty,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id', ignoreDuplicates: true })
        if (insDoc) throw insDoc
        doctors_created = true
      }
    }

    // PATIENT
    if (role === 'patient') {
      const { data: existsPat } = await srv
        .from('patients')
        .select('user_id')
        .eq('user_id', u.id)
        .maybeSingle()
      if (!existsPat) {
        const { error: insPat } = await srv
          .from('patients')
          .upsert({
            user_id: u.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id', ignoreDuplicates: true })
        if (insPat) throw insPat
        patients_created = true
      }
    }

    return new Response(
      JSON.stringify({ ok: true, event: eventType, user_id: u.id, role, employees_created, doctors_created, patients_created }),
      { status: 200, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } },
    )
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: String((e as any)?.message ?? e) }), { status: 500, headers: cors })
  }
})
