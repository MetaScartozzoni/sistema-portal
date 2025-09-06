import { buildApp } from '../dist/app.js';

async function run() {
  const app = await buildApp();
  const email = `test_${Date.now()}@local`;
  const password = 'pass1234';

  const reg = await app.inject({ method: 'POST', url: '/api/auth/register', payload: { name: 'Test', email, password } });
  console.log('REGISTER', reg.statusCode, reg.body);

  const login = await app.inject({ method: 'POST', url: '/api/auth/login', payload: { email, password } });
  console.log('LOGIN', login.statusCode, login.body);
  const cookie = login.headers['set-cookie'];
  console.log('COOKIE', cookie);

  const me = await app.inject({ method: 'GET', url: '/api/me', headers: { cookie: Array.isArray(cookie) ? cookie.join(';') : (cookie || '') } });
  console.log('ME', me.statusCode, me.body);

  const origin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  const health = await app.inject({ method: 'GET', url: '/api/health', headers: { origin } });
  console.log('HEALTH', health.statusCode, 'ACAO=', health.headers['access-control-allow-origin']);

  await app.close();
}

run().catch((e) => { console.error(e); process.exit(1); });

