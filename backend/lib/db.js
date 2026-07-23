const fs = require('fs');
const path = require('path');
const dns = require('dns');
const { MongoClient } = require('mongodb');

// Prefer public DNS for Atlas SRV lookups (some local resolvers refuse querySrv)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {
  /* ignore */
}

const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_COLLECTION = 'json_store';

const cache = new Map();
let client = null;
let db = null;
let mongoReady = false;
let persistQueue = Promise.resolve();

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function fileKey(file) {
  return String(file || '').replace(/\\/g, '/');
}

function clone(value) {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

function readFile(file, fallback = []) {
  ensureDir();
  const fp = path.join(DATA_DIR, file);
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf-8'));
  } catch {
    return typeof fallback === 'function' ? fallback() : fallback;
  }
}

function writeFile(file, data) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

function listDataFiles() {
  ensureDir();
  return fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
}

async function persistToMongo(file, data) {
  if (!mongoReady || !db) return;
  const key = fileKey(file);
  await db.collection(STORE_COLLECTION).updateOne(
    { _id: key },
    { $set: { data, updatedAt: new Date() } },
    { upsert: true },
  );
}

function queuePersist(file, data) {
  persistQueue = persistQueue
    .then(() => persistToMongo(file, data))
    .catch((err) => {
      console.error(`[db] Mongo persist failed for ${file}:`, err.message);
    });
  return persistQueue;
}

function read(file, fallback = []) {
  const key = fileKey(file);
  if (cache.has(key)) return clone(cache.get(key));
  const data = readFile(file, fallback);
  cache.set(key, clone(data));
  return clone(data);
}

function write(file, data) {
  const key = fileKey(file);
  const payload = clone(data);
  cache.set(key, payload);
  writeFile(file, payload);
  queuePersist(file, payload);
}

async function writeAndFlush(file, data) {
  write(file, data);
  await flushDb();
}

async function initDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[db] MONGODB_URI not set — using local JSON files only');
    return { mode: 'json' };
  }

  client = new MongoClient(uri, { serverApi: { version: '1', strict: true, deprecationErrors: true } });
  await client.connect();
  const dbName = process.env.MONGODB_DB || 'smartrooms';
  db = client.db(dbName);
  await db.command({ ping: 1 });
  mongoReady = true;
  console.log(`[db] Connected to MongoDB Atlas database "${dbName}"`);

  const existing = await db.collection(STORE_COLLECTION).find({}).toArray();
  if (existing.length > 0) {
    for (const doc of existing) {
      cache.set(fileKey(doc._id), clone(doc.data));
      writeFile(doc._id, doc.data);
    }
    console.log(`[db] Loaded ${existing.length} collections from Atlas`);
  } else {
    const files = listDataFiles();
    for (const file of files) {
      const data = readFile(file, []);
      cache.set(fileKey(file), clone(data));
      await persistToMongo(file, data);
    }
    console.log(`[db] Seeded ${files.length} local JSON files into Atlas`);
  }

  return { mode: 'mongo', dbName };
}

async function flushDb() {
  await persistQueue;
}

async function closeDb() {
  await flushDb();
  if (client) {
    await client.close();
    client = null;
    db = null;
    mongoReady = false;
  }
}

function isMongoReady() {
  return mongoReady;
}

module.exports = {
  read,
  write,
  writeAndFlush,
  initDb,
  flushDb,
  closeDb,
  isMongoReady,
  DATA_DIR,
};
