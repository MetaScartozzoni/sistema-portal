import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import supertest from 'supertest';
import { buildApp } from '../src/app';

let app: Awaited<ReturnType<typeof buildApp>>;
let request: supertest.SuperTest<supertest.Test>;
let token: string;
let projectId: string;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
  request = supertest(app.server);

  const email = `proj_${Date.now()}@local`;
  await request.post('/auth/register').send({ name: 'U', email, password: 'secret123' });
  const login = await request.post('/auth/login').send({ email, password: 'secret123' });
  token = login.body.token;

  const proj = await request
    .post('/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'My Project' });
  projectId = proj.body.id;
});

afterAll(async () => {
  await app.close();
});

describe('Bots', () => {
  it('creates and activates a bot', async () => {
    const create = await request
      .post('/bots')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'My Bot', projectId });
    expect(create.status).toBe(201);
    const botId = create.body.id;

    const act = await request.post(`/bots/${botId}/activate`).set('Authorization', `Bearer ${token}`);
    expect(act.status).toBe(200);

    const pause = await request.post(`/bots/${botId}/pause`).set('Authorization', `Bearer ${token}`);
    expect(pause.status).toBe(200);
  });
});

