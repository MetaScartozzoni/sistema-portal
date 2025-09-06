const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL
const ANON_KEY = process.env.SUPABASE_ANON_KEY
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY

function getAnonClient(extraHeaders) {
  if (!SUPABASE_URL || !ANON_KEY) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
  return createClient(SUPABASE_URL, ANON_KEY, extraHeaders ? { global: { headers: extraHeaders } } : undefined)
}

function getServiceClient() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) throw new Error('Missing SUPABASE_URL or SERVICE_ROLE_KEY')
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
}

module.exports = { getAnonClient, getServiceClient }

