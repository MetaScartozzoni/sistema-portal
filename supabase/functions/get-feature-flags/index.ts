import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Role = 'admin' | 'doctor' | 'secretary' | 'patient'

function defaultsByRole(role: Role) {
  return {
    'module.orcamento': role === 'admin' || role === 'doctor',
    'module.financeiro': role === 'admin' || role === 'doctor',
    'module.bot': role === 'admin' || role === 'doctor',
    'module.agenda': role !== 'patient',
    'module.prontuario': role === 'admin' || role === 'doctor',
  } as Record<string, boolean>
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (!['GET', 'POST'].includes(req.method)) {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
    const ANON = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY') ?? ''

    const auth = req.headers.get('Authorization')
    if (!auth) {
      return new Response(JSON.stringify({ error: 'no-auth' }), {
        status: 401,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const authed = createClient(SUPABASE_URL, ANON, { global: { headers: { Authorization: auth } } })

    // usuário + role
    const { data: { user }, error: uerr } = await authed.auth.getUser()
    if (uerr || !user) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), {
        status: 401,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    let role: Role = 'patient'
    const { data: pr } = await authed.from('profiles').select('role').eq('id', user.id).maybeSingle()
    if (pr?.role) role = pr.role as Role
    else if (typeof (user.user_metadata as any)?.role === 'string') role = ((user.user_metadata as any).role as string).toLowerCase() as Role

    // 1) defaults por role
    const flags: Record<string, boolean> = { ...defaultsByRole(role) }

    // 2) permissões por usuário (se existir tabela permissions)
    try {
      if (SERVICE) {
        const srv = createClient(SUPABASE_URL, SERVICE)
        const { data: perms } = await srv
          .from('permissions')
          .select('painel, pode_acessar')
          .eq('user_id', user.id)
        if (Array.isArray(perms)) {
          for (const p of perms) {
            const k = `module.${String((p as any).painel)}`
            flags[k] = Boolean((p as any).pode_acessar)
          }
        }
      }
    } catch (_) {
      // ignora se tabela permissions não existir
    }

    // 3) overrides de settings (global + user): RPC
    try {
      const { data: overrides } = await authed.rpc('get_feature_flags', { _user_id: user.id })
      if (overrides && typeof overrides === 'object') {
        for (const [k, v] of Object.entries(overrides as Record<string, any>)) {
          if (k.startsWith('module.')) flags[k] = Boolean(v)
        }
      }
    } catch (_) {
      // ignora se RPC indisponível
    }

    return new Response(JSON.stringify({ ok: true, role, flags }), {
      status: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? 'internal_error' }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }
})

