#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const REQUIRED = [
  'VITE_API_BASE_URL',
  'VITE_PORTAL_LOGIN_URL',
  'VITE_ROLE_REQUIRED',
  'VITE_FEATURES'
];

const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env não encontrado');
  process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf-8');
const missing = REQUIRED.filter(key => !new RegExp(`^${key}=`, 'm').test(content));

if (missing.length) {
  console.error('❌ Variáveis ausentes:', missing.join(', '));
  process.exit(2);
}

console.log('✅ .env ok');
