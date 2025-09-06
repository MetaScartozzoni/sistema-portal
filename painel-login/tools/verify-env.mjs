#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const REQUIRED = [
  'VITE_API_BASE_URL',
  // Required when Supabase is enabled in this app
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
];

const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env não encontrado em painel-login');
  process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf-8');
const missing = REQUIRED.filter(key => !new RegExp(`^${key}=`, 'm').test(content));

if (missing.length) {
  console.error('❌ Variáveis ausentes:', missing.join(', '));
  process.exit(2);
}

console.log('✅ .env ok');
