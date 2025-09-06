import { spawn } from 'node:child_process';

function run(cmd, args, opts = {}) {
  const child = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', ...opts });
  child.on('exit', (code, signal) => {
    if (code != null) {
      console.log(`[${cmd}] exited with code ${code}`);
    } else if (signal) {
      console.log(`[${cmd}] killed by signal ${signal}`);
    }
  });
  return child;
}

async function runOnce(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const c = run(cmd, args, opts);
    c.on('close', () => resolve(undefined));
  });
}

async function main() {
  console.log('> Preparing local database (prisma db push)...');
  try {
    await runOnce('npx', ['prisma', 'db', 'push', '--skip-generate'], { cwd: 'backend' });
  } catch (e) {
    console.warn('! Could not run prisma db push. Continuing...', e?.message || e);
  }

  console.log('> Starting backend (port 3001) and frontend (port 5173)...');
  const backend = run('npm', ['run', 'dev'], { cwd: 'backend' });
  const frontend = run('npm', ['run', 'dev']);

  const shutdown = () => {
    console.log('\nShutting down...');
    if (!backend.killed) backend.kill('SIGINT');
    if (!frontend.killed) frontend.kill('SIGINT');
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main();

