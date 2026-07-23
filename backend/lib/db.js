const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function read(file, fallback = []) {
  ensureDir();
  const fp = path.join(DATA_DIR, file);
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf-8'));
  } catch {
    return typeof fallback === 'function' ? fallback() : fallback;
  }
}

function write(file, data) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

module.exports = { read, write, DATA_DIR };
