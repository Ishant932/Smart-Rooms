/**
 * Free ports 5000 (backend) and 5173 (frontend) before starting dev server.
 * Prevents stale backend processes missing new API routes.
 */
const { execSync } = require('child_process');

const PORTS = [5000, 5173];

function killPort(port) {
  if (process.platform !== 'win32') return;
  try {
    const out = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, { encoding: 'utf8' });
    const pids = new Set();
    out.split('\n').forEach((line) => {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid)) pids.add(pid);
    });
    pids.forEach((pid) => {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        console.log(`Freed port ${port} (PID ${pid})`);
      } catch {
        /* already stopped */
      }
    });
  } catch {
    /* nothing listening */
  }
}

PORTS.forEach(killPort);
