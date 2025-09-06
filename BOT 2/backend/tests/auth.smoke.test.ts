import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../src/app';
import { prisma } from '../src/libs/db';

let app: Awaited<ReturnType<typeof buildApp>>;

describe('Auth smoke', () => {
  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('registers, logs in and fetches /me', async () => {
    const email = `test_${Date.now()}@example.com`;
    const password = 'pass1234';

    // register
    const reg = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: { name: 'Test', email, password }
    });
    expect(reg.statusCode).toBe(201);

    // login
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email, password }
    });
    expect(login.statusCode).toBe(200);
    const setCookie = login.headers['set-cookie'];
    expect(setCookie).toBeTruthy();
    const cookieHeader = Array.isArray(setCookie) ? setCookie.join(';') : setCookie as string;

    // /me with cookie
    const me = await app.inject({
      method: 'GET',
      url: '/api/me',
      headers: { cookie: cookieHeader }
    });
    expect(me.statusCode).toBe(200);
    const body = me.json() as any;
    expect(body?.user?.email).toBe(email);
  });

  it('sets CORS headers for allowed origin', async () => {
    const origin = process.env.CORS_ORIGIN || 'http://localhost:5173';
    const res = await app.inject({
      method: 'GET',
      url: '/api/health',
      headers: { origin }
    });
    expect(res.statusCode).toBe(200);
    const allow = res.headers['access-control-allow-origin'];
    expect(allow === origin || allow === '*').toBe(true);
  });
});
