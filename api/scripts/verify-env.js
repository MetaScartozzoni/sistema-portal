#!/usr/bin/env node
/* Simple env checker for API */
const required = [
  'SUPABASE_URL',
]

const optionallyOneOf = [['SUPABASE_SERVICE_ROLE_KEY', 'SERVICE_ROLE_KEY']]

let ok = true
for (const k of required) {
  if (!process.env[k]) {
    console.error(`[env] Missing required: ${k}`)
    ok = false
  }
}

for (const group of optionallyOneOf) {
  const present = group.find((k) => !!process.env[k])
  if (!present) {
    console.error(`[env] Provide one of: ${group.join(', ')}`)
    ok = false
  }
}

if (!ok) {
  console.error('[env] FAIL')
  process.exit(1)
} else {
  console.log('[env] OK')
}

