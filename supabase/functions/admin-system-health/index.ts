import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (!['GET', 'POST'].includes(req.method)) return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  try {
    const auth = req.headers.get('Authorization')
    if (!auth) throw new Error('missing auth')

    const url = Deno.env.get('SUPABASE_URL')!
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!
    const svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY')!

    const authed = createClient(url, anon, { global: { headers: { Authorization: auth } } })
    const { data: { user } } = await authed.auth.getUser()
    if (!user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const srv = createClient(url, svc)

    // autoriza admin
    const { data: me } = await srv.from('profiles').select('role').eq('id', user.id).maybeSingle()
    if (me?.role !== 'admin') return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const { data: health } = await srv.from('module_health').select('*').order('module')
    const { data: logs } = await srv.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50)
    // flags atuais (globais)
    const { data: flags } = await srv.rpc('get_feature_flags', { _user_id: user.id })

    return new Response(JSON.stringify({ ok: true, health: health || [], logs: logs || [], flags: flags || {} }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'internal_error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})

