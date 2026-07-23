/**
 * Opens SmartRoooms in the default browser (Windows / macOS / Linux).
 */
const { exec } = require('child_process');
const url = process.argv[2] || 'http://localhost:5173';

const cmd = process.platform === 'win32'
  ? `start "" "${url}"`
  : process.platform === 'darwin'
    ? `open "${url}"`
    : `xdg-open "${url}"`;

exec(cmd, (err) => {
  if (err) console.error('Could not open browser:', err.message);
  else console.log('Opened', url);
});
