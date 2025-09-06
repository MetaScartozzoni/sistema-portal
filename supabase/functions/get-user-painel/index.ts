import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { cors } from './_shared/cors.ts'

type Role = 'admin' | 'doctor' | 'secretary' | 'patient'

function normalizeRole(input?: string | null): Role {
  const r = (input || '').toString().toLowerCase()
  if (r === 'admin') return 'admin'
  if (r === 'doctor' || r === 'medico') return 'doctor'
  if (r === 'secretary' || r === 'secretaria' || r === 'employee' || r === 'receptionist') return 'secretary'
  return 'patient'
}

function urlFor(role: Role): string {
  switch (role) {
    case 'admin': return '/portal/admin'
    case 'doctor': return '/portal/doctor'
    case 'secretary': return '/portal/secretary'
    default: return '/portal/patient'
  }
}

function legacyPanelFor(role: Role): string {
  switch (role) {
    case 'admin': return '/admin-dashboard'
    case 'doctor': return '/doctor-dashboard'
    case 'secretary': return '/secretary-dashboard'
    default: return '/patient-dashboard'
  }
}

function defaultModules(role: Role) {
  if (role === 'admin' || role === 'doctor') {
    return { orcamento: true, bot: true, financeiro: true, agenda: true, prontuario: true }
  }
  if (role === 'secretary') {
    return { orcamento: true, bot: true, financeiro: true, agenda: true, prontuario: false }
  }
  return { orcamento: false, bot: false, financeiro: false, agenda: true, prontuario: false }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY')!

    const authHeader = req.headers.get('authorization') || ''
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: cors })
    }

    const anon = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } })
    const srv = createClient(supabaseUrl, serviceKey)

    const { data: ures, error: uerr } = await anon.auth.getUser()
    const user = ures?.user
    if (uerr || !user) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: cors })
    }

    // 1) Tenta pegar role via RLS
    let roleStr: string | null | undefined
    try {
      const { data: prof } = await anon
        .from('profiles')
        .select('role, email, id')
        .eq('id', user.id)
        .maybeSingle()
      roleStr = prof?.role
    } catch (_) {
      // ignora
    }

    // 2) Fallback: metadata
    if (!roleStr) roleStr = (user.user_metadata as any)?.role

    // 3) Fallback: service role em profiles
    if (!roleStr) {
      const { data: profSrv } = await srv
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
      roleStr = profSrv?.role
    }

    // 4) Fallback: VIEW user_profiles (compat)
    if (!roleStr) {
      const { data: up } = await srv
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()
      roleStr = up?.role
    }

    const role = normalizeRole(roleStr)

    // TODO: se existir permissions/settings, carregar a partir delas
    const modules = defaultModules(role)

    const body = {
      ok: true,
      role,
      panel: legacyPanelFor(role),
      url: urlFor(role),
      modules,
    }

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  } catch (e) {
    const msg = (e as any)?.message ?? String(e)
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500, headers: cors })
  }
})

