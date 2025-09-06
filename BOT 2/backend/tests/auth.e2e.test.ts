import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import supertest from 'supertest';
import { buildApp } from '../src/app';

let app: Awaited<ReturnType<typeof buildApp>>;
let request: supertest.SuperTest<supertest.Test>;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
  request = supertest(app.server);
});

afterAll(async () => {
  await app.close();
});

describe('Auth', () => {
  it('registers and logs in', async () => {
    const email = `user_${Date.now()}@local`;
    const reg = await request.post('/auth/register').send({ name: 'User', email, password: 'secret123' });
    expect(reg.status).toBe(201);

    const login = await request.post('/auth/login').send({ email, password: 'secret123' });
    expect(login.status).toBe(200);
    expect(login.body.user.email).toBe(email);

    const me = await request.get('/me').set('Authorization', `Bearer ${login.body.token}`);
    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe(email);
  });
});

