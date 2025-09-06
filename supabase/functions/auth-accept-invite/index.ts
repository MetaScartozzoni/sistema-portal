import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { cors } from './_shared/cors.ts'

type Body = {
  role?: 'admin' | 'employee' | 'receptionist' | 'doctor' | 'patient'
  crm?: string
  specialty?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization' }), { status: 401, headers: cors })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY')!

    const anon = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } })
    const srv = createClient(supabaseUrl, serviceKey)

    // 1) Verifica usuário logado
    const { data: { user }, error: uerr } = await anon.auth.getUser()
    if (uerr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: cors })
    }

    // 2) Carrega profile + possíveis overrides do corpo
    const body = (await req.json().catch(() => ({}))) as Body

    const { data: profile } = await srv
      .from('profiles')
      .select('id, email, role, first_name, last_name')
      .eq('id', user.id)
      .single()

    const role = (body.role ?? (profile as any)?.role ?? (user as any).user_metadata?.role ?? 'patient') as Body['role']
    const email = (profile as any)?.email ?? user.email ?? null

    // 3) Se role for staff/admin/doctor -> garantir employees
    let employees_created = false
    if (['admin', 'employee', 'receptionist', 'doctor'].includes(role || '')) {
      const { data: existsEmp } = await srv
        .from('employees')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!existsEmp) {
        const { error: eIns } = await srv.from('employees').insert({
          user_id: user.id,
          email: email,
          role: role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        if (eIns) throw eIns
        employees_created = true
      }
    }

    // 4) Se for doctor -> garantir doctors (crm/specialty do body ou metadata)
    let doctors_created = false
    if (role === 'doctor') {
      const { data: existsDoc } = await srv
        .from('doctors')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!existsDoc) {
        const crm = body.crm ?? (user.user_metadata as any)?.crm ?? null
        const specialty = body.specialty ?? (user.user_metadata as any)?.specialty ?? null

        const { error: dIns } = await srv.from('doctors').insert({
          user_id: user.id,
          crm,
          specialty,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        if (dIns) throw dIns
        doctors_created = true
      }
    }

    // 5) Paciente opcional
    let patients_created = false
    if (role === 'patient') {
      const { data: existsPat } = await srv
        .from('patients')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!existsPat) {
        const { error: pIns } = await srv.from('patients').insert({
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        if (pIns) throw pIns
        patients_created = true
      }
    }

    return new Response(JSON.stringify({
      ok: true,
      user_id: user.id,
      role,
      employees_created,
      doctors_created,
      patients_created,
    }), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } })
  } catch (e) {
    const msg = (e as any)?.message ?? String(e)
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: cors })
  }
})
