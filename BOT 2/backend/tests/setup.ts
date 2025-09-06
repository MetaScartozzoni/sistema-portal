import { rmSync } from 'fs';
import path from 'path';

// Use an isolated SQLite DB per test run
const testDb = path.join(process.cwd(), `test-${Date.now()}.db`);
process.env.DATABASE_PROVIDER = 'sqlite';
process.env.DATABASE_URL = `file:${testDb}`;
process.env.JWT_SECRET = 'test-secret-please-change';
process.env.PORT = '0';
process.env.CORS_ORIGIN = 'http://localhost:5173';

afterAll(() => {
  try {
    rmSync(testDb);
  } catch {}
});

