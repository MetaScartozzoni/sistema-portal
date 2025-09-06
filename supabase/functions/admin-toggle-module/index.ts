import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (!['POST'].includes(req.method)) return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  try {
    const auth = req.headers.get('Authorization')
    if (!auth) throw new Error('missing auth')

    const url = Deno.env.get('SUPABASE_URL')!
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!
    const svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY')!

    const userClient = createClient(url, anon, { global: { headers: { Authorization: auth } } })
    const { data: { user } } = await userClient.auth.getUser()
    if (!user) throw new Error('unauthorized')

    const admin = createClient(url, svc)
    const body = await req.json().catch(() => ({})) as { module?: string; enabled?: boolean }
    const moduleName = String(body.module || '').trim()
    const enabled = Boolean(body.enabled)
    if (!moduleName) return new Response(JSON.stringify({ error: 'module required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle()
    if (me?.role !== 'admin') return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    await admin.rpc('set_setting_bool', { _scope: 'global', _subject_id: null, _key: `module.${moduleName}`, _value: enabled })
    await admin.rpc('touch_module_health', { _m: moduleName, _status: enabled ? 'ok' : 'down' })
    await admin.from('audit_logs').insert({ user_id: user.id, action: 'toggle_module', target: `module:${moduleName}`, payload: { enabled } })

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'internal_error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})

