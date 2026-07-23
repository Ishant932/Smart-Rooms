const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { read, write } = require('./lib/db');
const {
  register, login, updateProfile, authMiddleware, adminOnly, getUsers, getWallet, getWallets,
  addPoints, addCash, redeemPointsForDiscount, processBookingReferral,
  processTransactionPoints, addWalletTransaction, sanitizeUser, updateWallet, saveUsers,
  POINTS_FOR_DISCOUNT, DISCOUNT_AMOUNT, REFERRAL_CASH, SIGNUP_POINTS, TRANSACTION_POINTS,
} = require('./lib/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'rooms.json');

app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

const JAIPUR_COORDS_SERVER = {
  'malviya nagar': { lat: 26.8547, lng: 75.824 },
  'mansarovar': { lat: 26.8723, lng: 75.7705 },
  'vaishali nagar': { lat: 26.911, lng: 75.743 },
  'sodala': { lat: 26.892, lng: 75.792 },
  'khatipura': { lat: 26.936, lng: 75.715 },
  'jagatpura': { lat: 26.823, lng: 75.864 },
  'gopalpura': { lat: 26.868, lng: 75.788 },
  'vidhyadhar nagar': { lat: 26.964, lng: 75.734 },
  'raja park': { lat: 26.805, lng: 75.828 },
  'c scheme': { lat: 26.912, lng: 75.803 },
  'bani park': { lat: 26.928, lng: 75.803 },
  'tonk road': { lat: 26.838, lng: 75.802 },
  'ajmer road': { lat: 26.905, lng: 75.728 },
  'sanganer': { lat: 26.813, lng: 75.802 },
  'sitapura': { lat: 26.785, lng: 75.848 },
  'jhotwara': { lat: 26.945, lng: 75.758 },
  'pratap nagar': { lat: 26.798, lng: 75.838 },
  'tonk phatak': { lat: 26.845, lng: 75.805 },
  'patrakar colony': { lat: 26.878, lng: 75.812 },
  'gandhi nagar': { lat: 26.872, lng: 75.778 },
  'subhash nagar': { lat: 26.892, lng: 75.768 },
  'civil lines': { lat: 26.915, lng: 75.818 },
  'shastri nagar': { lat: 26.938, lng: 75.778 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },
};

function coordsForLocation(location, address = '') {
  const haystack = `${location || ''} ${address || ''}`.toLowerCase();
  for (const [key, coords] of Object.entries(JAIPUR_COORDS_SERVER)) {
    if (key !== 'jaipur' && haystack.includes(key)) return coords;
  }
  return JAIPUR_COORDS_SERVER.jaipur;
}

const BLOCKED_UPLOAD_PATTERNS = [/porn/i, /xxx/i, /nude/i, /sex/i, /adult/i, /nsfw/i];
const ALLOWED_UPLOAD_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/webm', 'video/quicktime',
]);

const uploadStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '';
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 25 * 1024 * 1024, files: 12 },
  fileFilter: (_, file, cb) => {
    const name = file.originalname.toLowerCase();
    if (BLOCKED_UPLOAD_PATTERNS.some((p) => p.test(name))) {
      return cb(new Error('Upload rejected: inappropriate file name'));
    }
    if (!ALLOWED_UPLOAD_TYPES.has(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, WebP, GIF images and MP4/WebM videos allowed'));
    }
    cb(null, true);
  },
});

app.post('/api/upload', authMiddleware, (req, res) => {
  upload.array('files', 12)(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
    const files = (req.files || []).map((f) => ({
      url: `/uploads/${f.filename}`,
      type: f.mimetype.startsWith('video/') ? 'video' : 'image',
      name: f.originalname,
    }));
    res.json({ files });
  });
});

function readRooms() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}
function writeRooms(rooms) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(rooms, null, 2));
}

function listingsForUser(user, rooms = readRooms()) {
  if (!user || user.role !== 'owner') return [];
  const email = user.email?.toLowerCase();
  const name = user.name?.toLowerCase();
  return rooms.filter(
    (r) => r.ownerId === user.id
      || (email && r.owner?.email?.toLowerCase() === email)
      || (name && r.owner?.name?.toLowerCase() === name)
  );
}

function removeListingsForUser(user) {
  const rooms = readRooms();
  const email = user.email?.toLowerCase();
  const name = user.name?.toLowerCase();
  const filtered = rooms.filter(
    (r) => r.ownerId !== user.id
      && !(email && r.owner?.email?.toLowerCase() === email)
      && !(name && r.owner?.name?.toLowerCase() === name)
  );
  const removed = rooms.length - filtered.length;
  if (removed > 0) writeRooms(filtered);
  return removed;
}

function getVisibleRooms() {
  const users = getUsers();
  const suspended = users.filter((u) => u.status === 'suspended');
  const suspendedIds = new Set(suspended.map((u) => u.id));
  const suspendedEmails = new Set(suspended.map((u) => u.email?.toLowerCase()).filter(Boolean));
  const suspendedNames = new Set(suspended.map((u) => u.name?.toLowerCase()).filter(Boolean));
  return readRooms().filter((r) => {
    if (r.city !== 'Jaipur') return false;
    if (suspendedIds.has(r.ownerId)) return false;
    if (r.owner?.email && suspendedEmails.has(r.owner.email.toLowerCase())) return false;
    if (r.owner?.name && suspendedNames.has(r.owner.name.toLowerCase())) return false;
    return true;
  });
}

function attachOwnerListings(user, rooms) {
  if (user.role !== 'owner') return user;
  const listings = listingsForUser(user, rooms);
  return { ...user, listings, listingCount: listings.length };
}

// ─── AUTH ───────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const result = await register(req.body);
  if (result.error) return res.status(400).json(result);
  res.status(201).json(result);
});

app.post('/api/auth/login', async (req, res) => {
  const result = await login(req.body.email, req.body.password);
  if (result.error) return res.status(401).json(result);
  res.json(result);
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const wallet = getWallet(req.user.id);
  res.json({ user: req.user, wallet });
});

app.patch('/api/auth/profile', authMiddleware, (req, res) => {
  const result = updateProfile(req.user.id, req.body);
  if (result.error) return res.status(400).json(result);
  const wallet = getWallet(req.user.id);
  res.json({ user: result.user, wallet });
});

// ─── TERMS & REQUIREMENTS ────────────────────────────────
app.get('/api/terms', (_, res) => {
  res.json(read('terms.json'));
});

app.post('/api/requirements', authMiddleware, (req, res) => {
  const reqs = read('requirements.json');
  const entry = {
    id: uuidv4(),
    userId: req.user.id,
    userName: req.user.name,
    userEmail: req.user.email,
    userPhone: req.user.phone,
    ...req.body,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
  reqs.push(entry);
  write('requirements.json', reqs);
  res.status(201).json(entry);
});

app.get('/api/requirements', authMiddleware, adminOnly, (_, res) => {
  res.json(read('requirements.json'));
});

// ─── ADMIN USERS ─────────────────────────────────────────
app.get('/api/admin/users', authMiddleware, adminOnly, (_, res) => {
  const rooms = readRooms();
  const users = getUsers().map(sanitizeUser).map((u) => attachOwnerListings(u, rooms));
  res.json({
    total: users.filter((u) => u.role !== 'admin').length,
    tenants: users.filter((u) => u.role === 'tenant'),
    owners: users.filter((u) => u.role === 'owner'),
    admins: users.filter((u) => u.role === 'admin'),
    all: users,
  });
});

app.get('/api/admin/dashboard', authMiddleware, adminOnly, (_, res) => {
  const users = getUsers();
  const nonAdminUsers = users.filter((u) => u.role !== 'admin');
  const wallets = getWallets();
  const bookings = read('bookings.json');
  const complaints = read('complaints.json');
  const partnerships = read('partnerships.json');
  const transactions = read('transactions.json');
  const requirements = read('requirements.json');
  const rooms = readRooms();

  res.json({
    stats: {
      totalUsers: nonAdminUsers.length,
      tenants: nonAdminUsers.filter((u) => u.role === 'tenant').length,
      owners: nonAdminUsers.filter((u) => u.role === 'owner').length,
      admins: users.filter((u) => u.role === 'admin').length,
      totalListings: rooms.length,
      verifiedListings: rooms.filter((r) => r.verified).length,
      featuredListings: rooms.filter((r) => r.featured).length,
      openRequirements: requirements.filter((r) => r.status === 'open').length,
      activeBookings: bookings.filter((b) => b.status === 'active').length,
      openComplaints: complaints.filter((c) => c.status !== 'resolved').length,
      partnerships: partnerships.filter((p) => p.status === 'active').length,
      totalTransactions: transactions.length,
      totalWalletBalance: wallets.reduce((s, w) => s + w.balance, 0),
      totalPoints: wallets.reduce((s, w) => s + w.points, 0),
      freeBooking: true,
      freeListing: true,
    },
    recentComplaints: complaints.slice(0, 5),
    recentBookings: bookings.slice(0, 5),
    recentUsers: users.filter((u) => u.role !== 'admin').slice(-8).reverse().map(sanitizeUser),
    partnerships,
    requirements: requirements.slice(0, 5),
  });
});

app.get('/api/admin/users/:id/listings', authMiddleware, adminOnly, (req, res) => {
  const user = getUsers().find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const safe = sanitizeUser(user);
  const listings = listingsForUser(safe);
  res.json({ user: safe, listings, total: listings.length });
});

app.patch('/api/admin/users/:id', authMiddleware, adminOnly, (req, res) => {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  if (users[idx].role === 'admin' && users[idx].id !== req.user.id) {
    return res.status(403).json({ error: 'Cannot modify other admin accounts' });
  }
  const { status, name, email, phone, role, college } = req.body;
  let listingsRemoved = 0;
  if (name) users[idx].name = name;
  if (email) users[idx].email = email;
  if (phone !== undefined) users[idx].phone = phone;
  if (college !== undefined) users[idx].college = college;
  if (role && ['tenant', 'owner'].includes(role) && users[idx].role !== 'admin') {
    users[idx].role = role;
  }
  if (status && ['active', 'suspended'].includes(status)) {
    users[idx].status = status;
    if (status === 'suspended' && users[idx].role === 'owner') {
      listingsRemoved = removeListingsForUser(users[idx]);
    }
  }
  users[idx].updatedAt = new Date().toISOString();
  saveUsers(users);
  const safe = sanitizeUser(users[idx]);
  res.json({ ...safe, listingsRemoved });
});

app.delete('/api/admin/users/:id', authMiddleware, adminOnly, (req, res) => {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  if (users[idx].role === 'admin') {
    return res.status(403).json({ error: 'Cannot delete admin accounts' });
  }
  let listingsRemoved = 0;
  if (users[idx].role === 'owner') {
    listingsRemoved = removeListingsForUser(users[idx]);
  }
  users.splice(idx, 1);
  saveUsers(users);
  res.json({ message: 'User deleted', listingsRemoved });
});

app.patch('/api/admin/wallets/:userId', authMiddleware, adminOnly, (req, res) => {
  const updates = {};
  if (req.body.balance !== undefined) updates.balance = Number(req.body.balance);
  if (req.body.points !== undefined) updates.points = Number(req.body.points);
  const wallet = updateWallet(req.params.userId, updates);
  if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
  if (req.body.reason) {
    addWalletTransaction(req.params.userId, {
      type: 'admin',
      amount: 0,
      reason: req.body.reason,
      balanceAfter: wallet.balance,
      pointsAfter: wallet.points,
    });
  }
  res.json(wallet);
});

app.get('/api/admin/rooms', authMiddleware, adminOnly, (_, res) => {
  res.json({ total: readRooms().length, rooms: readRooms() });
});

app.patch('/api/admin/rooms/:id', authMiddleware, adminOnly, (req, res) => {
  const rooms = readRooms();
  const idx = rooms.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Room not found' });
  const allowed = [
    'verified', 'featured', 'status', 'title', 'price', 'deposit', 'location',
    'type', 'description', 'bedrooms', 'bathrooms', 'area', 'furnishing', 'address',
  ];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) rooms[idx][key] = req.body[key];
  });
  if (req.body.verified === true) {
    rooms[idx].owner = { ...rooms[idx].owner, verified: true };
  }
  writeRooms(rooms);
  res.json(rooms[idx]);
});

app.delete('/api/admin/rooms/:id', authMiddleware, adminOnly, (req, res) => {
  const rooms = readRooms();
  const filtered = rooms.filter((r) => r.id !== req.params.id);
  if (filtered.length === rooms.length) return res.status(404).json({ error: 'Room not found' });
  writeRooms(filtered);
  res.json({ message: 'Listing removed' });
});

app.get('/api/admin/bookings', authMiddleware, adminOnly, (_, res) => {
  res.json(read('bookings.json'));
});

app.patch('/api/admin/bookings/:id', authMiddleware, adminOnly, (req, res) => {
  const bookings = read('bookings.json');
  const idx = bookings.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Booking not found' });
  if (req.body.status) bookings[idx].status = req.body.status;
  write('bookings.json', bookings);
  res.json(bookings[idx]);
});

app.delete('/api/admin/bookings/:id', authMiddleware, adminOnly, (req, res) => {
  const bookings = read('bookings.json');
  const filtered = bookings.filter((b) => b.id !== req.params.id);
  if (filtered.length === bookings.length) return res.status(404).json({ error: 'Booking not found' });
  write('bookings.json', filtered);
  res.json({ message: 'Booking deleted' });
});

app.get('/api/admin/inquiries', authMiddleware, adminOnly, (_, res) => {
  res.json(read('inquiries.json', []));
});

app.patch('/api/admin/partnerships/:id', authMiddleware, adminOnly, (req, res) => {
  const list = read('partnerships.json');
  const idx = list.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  if (req.body.status) list[idx].status = req.body.status;
  write('partnerships.json', list);
  res.json(list[idx]);
});

app.patch('/api/admin/requirements/:id', authMiddleware, adminOnly, (req, res) => {
  const reqs = read('requirements.json');
  const idx = reqs.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  if (req.body.status) reqs[idx].status = req.body.status;
  write('requirements.json', reqs);
  res.json(reqs[idx]);
});

app.delete('/api/admin/requirements/:id', authMiddleware, adminOnly, (req, res) => {
  const reqs = read('requirements.json');
  const filtered = reqs.filter((r) => r.id !== req.params.id);
  if (filtered.length === reqs.length) return res.status(404).json({ error: 'Not found' });
  write('requirements.json', filtered);
  res.json({ message: 'Requirement deleted' });
});

// ─── WALLET ───────────────────────────────────────────────
app.get('/api/wallet', authMiddleware, (req, res) => {
  const wallet = getWallet(req.user.id);
  const transactions = read('walletTransactions.json').filter((t) => t.userId === req.user.id);
  res.json({
    wallet,
    transactions,
    rules: {
      signupPoints: SIGNUP_POINTS,
      referralCash: REFERRAL_CASH,
      pointsForDiscount: POINTS_FOR_DISCOUNT,
      discountAmount: DISCOUNT_AMOUNT,
      transactionPoints: TRANSACTION_POINTS,
    },
  });
});

app.post('/api/wallet/redeem-points', authMiddleware, (req, res) => {
  const result = redeemPointsForDiscount(req.user.id);
  if (result.error) return res.status(400).json(result);
  res.json({ ...result, wallet: getWallet(req.user.id) });
});

app.post('/api/wallet/pay-rent', authMiddleware, (req, res) => {
  const { amount, roomId, ownerId } = req.body;
  const wallet = getWallet(req.user.id);
  const useBalance = Math.min(wallet.balance, Number(amount) || 0);
  if (useBalance <= 0) return res.status(400).json({ error: 'Insufficient wallet balance' });

  const newBalance = wallet.balance - useBalance;
  updateWallet(req.user.id, { balance: newBalance, totalSpent: (wallet.totalSpent || 0) + useBalance });

  addWalletTransaction(req.user.id, {
    type: 'spend',
    amount: -useBalance,
    reason: `Rent payment for room ${roomId}`,
    balanceAfter: newBalance,
    pointsAfter: wallet.points,
  });

  if (ownerId) processTransactionPoints(req.user.id, ownerId, useBalance);

  const tx = { id: uuidv4(), tenantId: req.user.id, ownerId, roomId, amount: useBalance, walletDiscount: useBalance, type: 'rent', status: 'completed', createdAt: new Date().toISOString() };
  const txs = read('transactions.json');
  txs.unshift(tx);
  write('transactions.json', txs);

  res.json({ success: true, used: useBalance, wallet: getWallet(req.user.id) });
});

// ─── GAMES ────────────────────────────────────────────────
const GAME_REWARDS = {
  cricket: { min: 4, max: 18 },
  'cake-cut': { min: 5, max: 22 },
  'room-runner': { min: 6, max: 28 },
  'spin-wheel': { min: 1, max: 5 },
  'tap-race': { min: 1, max: 4 },
  'memory-match': { min: 2, max: 6 },
  'dice-luck': { min: 1, max: 3 },
  'color-match': { min: 2, max: 5 },
  'number-guess': { min: 2, max: 8 },
  'reaction-time': { min: 1, max: 6 },
  'coin-flip': { min: 1, max: 4 },
};

app.post('/api/games/:gameId/play', authMiddleware, (req, res) => {
  const { gameId } = req.params;
  const { score } = req.body;
  if (!GAME_REWARDS[gameId]) return res.status(404).json({ error: 'Game not found' });

  const { min, max } = GAME_REWARDS[gameId];
  const pointsEarned = Math.min(max, Math.max(min, Math.floor((score || 50) / 10) + min));

  addPoints(req.user.id, pointsEarned, `Played ${gameId} game — score: ${score || 'N/A'}`);

  const sessions = read('gameSessions.json');
  sessions.unshift({
    id: uuidv4(),
    userId: req.user.id,
    gameId,
    score: score || 0,
    pointsEarned,
    playedAt: new Date().toISOString(),
  });
  write('gameSessions.json', sessions);

  res.json({ pointsEarned, totalPoints: getWallet(req.user.id).points, wallet: getWallet(req.user.id), message: `You earned ${pointsEarned} points!` });
});

app.get('/api/games/leaderboard', authMiddleware, (_, res) => {
  const sessions = read('gameSessions.json');
  const users = getUsers();
  const scores = {};
  sessions.forEach((s) => {
    scores[s.userId] = (scores[s.userId] || 0) + s.pointsEarned;
  });
  const leaderboard = Object.entries(scores)
    .map(([userId, total]) => ({
      userId,
      name: users.find((u) => u.id === userId)?.name || 'Unknown',
      totalPoints: total,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 10);
  res.json(leaderboard);
});

// ─── REVIEWS ──────────────────────────────────────────────
app.get('/api/reviews', (req, res) => {
  let reviews = read('reviews.json');
  const { roomId, userId, role } = req.query;
  if (roomId) reviews = reviews.filter((r) => r.roomId === roomId);
  if (userId) reviews = reviews.filter((r) => r.reviewerId === userId || r.targetId === userId);
  if (role) reviews = reviews.filter((r) => r.reviewerRole === role);
  res.json(reviews);
});

app.post('/api/reviews', authMiddleware, (req, res) => {
  const { roomId, targetId, targetRole, rating, comment } = req.body;
  const review = {
    id: uuidv4(),
    roomId,
    reviewerId: req.user.id,
    reviewerRole: req.user.role,
    reviewerName: req.user.name,
    targetId,
    targetRole,
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString(),
  };
  const reviews = read('reviews.json');
  reviews.unshift(review);
  write('reviews.json', reviews);
  addPoints(req.user.id, 10, 'Submitted a review');
  res.status(201).json(review);
});

// ─── COMPLAINTS ───────────────────────────────────────────
app.get('/api/complaints', authMiddleware, (req, res) => {
  let complaints = read('complaints.json');
  if (req.user.role === 'tenant') complaints = complaints.filter((c) => c.tenantId === req.user.id);
  else if (req.user.role === 'owner') {
    const rooms = readRooms().filter((r) => r.ownerId === req.user.id || r.owner?.name === req.user.name);
    const roomIds = rooms.map((r) => r.id);
    complaints = complaints.filter((c) => roomIds.includes(c.roomId));
  }
  res.json(complaints);
});

app.post('/api/complaints', authMiddleware, (req, res) => {
  if (req.user.role !== 'tenant') return res.status(403).json({ error: 'Only tenants can file complaints' });
  const { subject, description, category, roomId, roomTitle, propertyArea, priority, attachments } = req.body;
  if (!subject?.trim() || !description?.trim()) {
    return res.status(400).json({ error: 'Subject and description are required' });
  }
  const complaint = {
    id: uuidv4(),
    tenantId: req.user.id,
    tenantName: req.user.name,
    tenantEmail: req.user.email,
    tenantPhone: req.user.phone || '',
    roomId: roomId || null,
    roomTitle: roomTitle?.trim() || 'General complaint',
    propertyArea: propertyArea || req.user.preferredArea || '',
    category: category || 'other',
    priority: priority || 'normal',
    subject: subject.trim(),
    description: description.trim(),
    attachments: Array.isArray(attachments) ? attachments.slice(0, 8) : [],
    status: 'open',
    adminNote: '',
    createdAt: new Date().toISOString(),
  };
  const complaints = read('complaints.json');
  complaints.unshift(complaint);
  write('complaints.json', complaints);
  res.status(201).json(complaint);
});

app.patch('/api/complaints/:id', authMiddleware, adminOnly, (req, res) => {
  const complaints = read('complaints.json');
  const idx = complaints.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  complaints[idx] = { ...complaints[idx], ...req.body };
  write('complaints.json', complaints);
  res.json(complaints[idx]);
});

app.delete('/api/admin/complaints/:id', authMiddleware, adminOnly, (req, res) => {
  const complaints = read('complaints.json');
  const filtered = complaints.filter((c) => c.id !== req.params.id);
  if (filtered.length === complaints.length) return res.status(404).json({ error: 'Not found' });
  write('complaints.json', filtered);
  res.json({ message: 'Complaint deleted' });
});

// ─── PARTNERSHIPS ─────────────────────────────────────────
app.get('/api/partnerships', (_, res) => {
  res.json(read('partnerships.json'));
});

app.post('/api/partnerships', authMiddleware, adminOnly, (req, res) => {
  const partnership = { id: uuidv4(), ...req.body, studentsReferred: 0, totalRentProcessed: 0, joinedAt: new Date().toISOString() };
  const list = read('partnerships.json');
  list.unshift(partnership);
  write('partnerships.json', list);
  res.status(201).json(partnership);
});

// ─── ROOM PARTNERS ────────────────────────────────────────
app.get('/api/room-partners', (req, res) => {
  let partners = read('roomPartners.json').filter((p) => p.status === 'active');
  const { college, city } = req.query;
  if (college) partners = partners.filter((p) => p.college.toLowerCase().includes(college.toLowerCase()));
  if (city) partners = partners.filter((p) => p.city.toLowerCase() === city.toLowerCase());
  res.json(partners);
});

app.post('/api/room-partners', authMiddleware, (req, res) => {
  if (req.user.role !== 'tenant') return res.status(403).json({ error: 'Tenants only' });
  const partner = {
    id: uuidv4(),
    tenantId: req.user.id,
    tenantName: req.user.name,
    contact: req.user.phone,
    ...req.body,
    status: 'active',
    postedAt: new Date().toISOString(),
  };
  const list = read('roomPartners.json');
  list.unshift(partner);
  write('roomPartners.json', list);
  addPoints(req.user.id, 12, 'Posted room partner listing');
  res.status(201).json(partner);
});

// ─── BOOKINGS (PG/HOSTEL) ─────────────────────────────────
app.get('/api/bookings', authMiddleware, (req, res) => {
  let bookings = read('bookings.json');
  if (req.user.role === 'tenant') bookings = bookings.filter((b) => b.tenantId === req.user.id);
  else if (req.user.role === 'owner') bookings = bookings.filter((b) => b.ownerId === req.user.id);
  // admin sees all bookings
  res.json(bookings);
});

app.post('/api/bookings', authMiddleware, (_req, res) => {
  res.status(403).json({
    error: 'Direct booking is disabled. Chat with the owner or use Contact Now to connect via SmartRoooms.',
  });
});

// ─── EXISTING ROOMS API ───────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', message: 'SmartRoooms API is running' }));

app.get('/api/stats', (_, res) => {
  const rooms = readRooms().filter((r) => r.city === 'Jaipur');
  res.json({
    totalRooms: rooms.length,
    totalCities: 1,
    city: 'Jaipur',
    verifiedListings: rooms.filter((r) => r.verified).length,
    avgRating: rooms.length ? (rooms.reduce((s, r) => s + r.rating, 0) / rooms.length).toFixed(1) : '0',
    zeroBrokerage: true,
  });
});

app.get('/api/locations', (_, res) => {
  const rooms = readRooms().filter((r) => r.city === 'Jaipur');
  const locationMap = {};
  rooms.forEach((r) => { locationMap[r.location] = (locationMap[r.location] || 0) + 1; });
  res.json(Object.entries(locationMap).map(([name, count]) => ({
    name: `${name}, Jaipur`,
    city: 'Jaipur',
    area: name,
    count,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  })).sort((a, b) => b.count - a.count));
});

app.get('/api/categories', (_, res) => {
  res.json([
    { id: 'pg-boys', label: 'Boys PG / Hostel', icon: 'users', color: '#6366f1' },
    { id: 'pg-girls', label: 'Girls PG / Hostel', icon: 'heart', color: '#ec4899' },
    { id: 'flat', label: 'Flats & Apartments', icon: 'building', color: '#8b5cf6' },
    { id: 'shared-room', label: 'Shared Rooms', icon: 'share', color: '#14b8a6' },
    { id: 'hostel', label: 'Student Hostels', icon: 'graduation-cap', color: '#f59e0b' },
  ]);
});

app.get('/api/rooms', (req, res) => {
  let rooms = getVisibleRooms();
  const {
    type, city, location, gender, minPrice, maxPrice, search, featured, sort,
    furnishing, verified, minRating, amenity, bedrooms,
  } = req.query;

  if (type) rooms = rooms.filter((r) => r.type === type);
  if (city) rooms = rooms.filter((r) => (r.city || 'Jaipur').toLowerCase() === city.toLowerCase());
  if (location) rooms = rooms.filter((r) => r.location.toLowerCase().includes(location.toLowerCase()));
  if (gender) rooms = rooms.filter((r) => r.gender === gender || r.gender === 'any');
  if (minPrice) rooms = rooms.filter((r) => r.price >= Number(minPrice));
  if (maxPrice) rooms = rooms.filter((r) => r.price <= Number(maxPrice));
  if (featured === 'true') rooms = rooms.filter((r) => r.featured);
  if (furnishing) rooms = rooms.filter((r) => r.furnishing === furnishing);
  if (verified === 'true') rooms = rooms.filter((r) => r.verified);
  if (minRating) rooms = rooms.filter((r) => r.rating >= Number(minRating));
  if (bedrooms) {
    const n = Number(bedrooms);
    rooms = rooms.filter((r) => (n >= 3 ? r.bedrooms >= 3 : r.bedrooms === n));
  }
  if (amenity) rooms = rooms.filter((r) => r.amenities?.includes(amenity));
  if (search) {
    const q = search.toLowerCase();
    rooms = rooms.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  }
  if (sort === 'price-asc') rooms.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') rooms.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') rooms.sort((a, b) => b.rating - a.rating);
  else rooms.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
  res.json({ total: rooms.length, city: 'Jaipur', rooms });
});

app.get('/api/rooms/:id', (req, res) => {
  const room = getVisibleRooms().find((r) => r.id === req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json(room);
});

function getPastTenantsForRoom(roomId) {
  const bookings = read('bookings.json')
    .filter((b) => b.roomId === roomId && b.tenantId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const users = getUsers();
  const seen = new Set();
  const tenants = [];
  bookings.forEach((b) => {
    if (seen.has(b.tenantId)) return;
    seen.add(b.tenantId);
    const user = users.find((u) => u.id === b.tenantId);
    const phone = user?.phone || b.tenantPhone || '';
    if (!phone) return;
    tenants.push({
      tenantId: b.tenantId,
      name: user?.name || b.tenantName,
      phone,
      lastStay: b.endDate || b.createdAt,
    });
  });
  return tenants;
}

function resolveTenantById(tenantId) {
  const user = getUsers().find((u) => u.id === tenantId && u.role === 'tenant');
  if (!user?.phone) return null;
  return { tenantId: user.id, name: user.name, phone: user.phone };
}

app.get('/api/rooms/:id/past-tenants', authMiddleware, (req, res) => {
  const room = readRooms().find((r) => r.id === req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  if (room.ownerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not your listing' });
  }
  res.json(getPastTenantsForRoom(room.id));
});

app.get('/api/owner/tenant-directory', authMiddleware, (req, res) => {
  if (req.user.role !== 'owner' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Owners only' });
  }
  const tenants = getUsers()
    .filter((u) => u.role === 'tenant' && u.phone)
    .map((u) => ({ id: u.id, name: u.name, phone: u.phone, college: u.college || '' }));
  res.json(tenants);
});

app.patch('/api/rooms/:id/availability', authMiddleware, (req, res) => {
  const rooms = readRooms();
  const idx = rooms.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Room not found' });
  const room = rooms[idx];
  if (room.ownerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not your listing' });
  }

  const { status, tenantId } = req.body;
  if (!['available', 'occupied'].includes(status)) {
    return res.status(400).json({ error: 'Status must be available or occupied' });
  }

  if (status === 'available') {
    let lastTenant = null;
    if (tenantId) {
      lastTenant = resolveTenantById(tenantId);
      if (!lastTenant) {
        return res.status(400).json({ error: 'Select a registered tenant with a valid phone number' });
      }
    } else {
      const past = getPastTenantsForRoom(room.id);
      if (past.length === 0) {
        return res.status(400).json({
          error: 'No booking history for this room. Select a previous tenant from the list.',
          needsTenantPick: true,
        });
      }
      lastTenant = {
        tenantId: past[0].tenantId,
        name: past[0].name,
        phone: past[0].phone,
      };
    }
    rooms[idx].listingStatus = 'available';
    rooms[idx].lastTenant = { ...lastTenant, assignedAt: new Date().toISOString() };
  } else {
    rooms[idx].listingStatus = 'occupied';
    rooms[idx].lastTenant = null;
  }

  writeRooms(rooms);
  res.json(rooms[idx]);
});

app.post('/api/rooms', authMiddleware, (req, res) => {
  if (req.user.role !== 'owner' && req.user.role !== 'admin') return res.status(403).json({ error: 'Owners only' });
  const rooms = readRooms();
  const coords = coordsForLocation(req.body.location, req.body.address);
  const newRoom = {
    id: uuidv4(),
    ...req.body,
    lat: req.body.lat ?? coords.lat,
    lng: req.body.lng ?? coords.lng,
    ownerId: req.user.id,
    featured: false,
    verified: false,
    rating: 0,
    reviews: 0,
    postedAt: new Date().toISOString(),
    images: req.body.images?.length ? req.body.images : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
    videos: req.body.videos?.length ? req.body.videos : [],
    owner: { name: req.user.name, phone: req.user.phone, verified: false },
    listingStatus: 'occupied',
    lastTenant: null,
  };
  rooms.unshift(newRoom);
  writeRooms(rooms);
  addPoints(req.user.id, 12, 'Posted new room listing');
  res.status(201).json(newRoom);
});

app.patch('/api/rooms/:id', authMiddleware, (req, res) => {
  const rooms = readRooms();
  const idx = rooms.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Room not found' });
  const room = rooms[idx];
  if (room.ownerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not your listing' });
  }
  const allowed = [
    'title', 'type', 'price', 'deposit', 'location', 'city', 'address',
    'bedrooms', 'bathrooms', 'area', 'furnishing', 'gender', 'availableFor',
    'amenities', 'description', 'images', 'videos', 'lat', 'lng',
  ];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) rooms[idx][key] = req.body[key];
  });
  if (req.body.location || req.body.address) {
    const coords = coordsForLocation(rooms[idx].location, rooms[idx].address);
    if (!req.body.lat) rooms[idx].lat = coords.lat;
    if (!req.body.lng) rooms[idx].lng = coords.lng;
  }
  writeRooms(rooms);
  res.json(rooms[idx]);
});

app.post('/api/inquiries', (req, res) => {
  const inquiries = read('inquiries.json', []);
  const inquiry = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
  inquiries.push(inquiry);
  write('inquiries.json', inquiries);
  res.status(201).json({ message: 'Inquiry submitted', inquiry });
});

// ─── SmartRoooms contact & owner chat (no direct rent) ───
const SMARTROOMS_CONTACT = {
  display: '+91 98765 43210',
  tel: '+919876543210',
  hours: 'Mon–Sat, 9 AM – 8 PM IST',
  email: 'hello@smartroooms.in',
};

function listingRef(roomId) {
  return String(roomId).slice(0, 8).toUpperCase();
}

app.get('/api/rooms/:id/contact', (req, res) => {
  const room = getVisibleRooms().find((r) => r.id === req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  const ref = listingRef(room.id);
  res.json({
    ...SMARTROOMS_CONTACT,
    listingRef: ref,
    roomTitle: room.title,
    ownerName: room.owner?.name || 'Property Owner',
    whatsappMessage: `Hi SmartRoooms, I want to connect with the owner for "${room.title}" in ${room.location || 'Jaipur'}. Listing Ref: ${ref}`,
    note: 'SmartRoooms provides this number to connect you with the owner. Zero commission — chat or call us anytime.',
  });
});

function getAllRooms() {
  return read('rooms.json', []);
}

function ensureWelcomeMessage(chats, room, tenantId) {
  const thread = chats.filter((c) => c.roomId === room.id && c.userId === tenantId);
  if (thread.length > 0) return thread;

  const welcome = {
    id: uuidv4(),
    roomId: room.id,
    userId: tenantId,
    ownerId: room.ownerId,
    fromRole: 'owner',
    senderName: room.owner?.name || 'Owner',
    text: `Namaste! Thanks for your interest in "${room.title}". Feel free to ask about rent, deposit, amenities, or visit timing. I typically reply within a few hours.`,
    createdAt: new Date().toISOString(),
  };
  chats.push(welcome);
  write('chats.json', chats);
  return [welcome];
}

function sortThreadMessages(chats, roomId, tenantId) {
  return chats
    .filter((c) => c.roomId === roomId && c.userId === tenantId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

app.get('/api/chat/conversations', authMiddleware, (req, res) => {
  const chats = read('chats.json', []);
  const allRooms = getAllRooms();
  const users = read('users.json', []);

  if (req.user.role === 'tenant') {
    const byRoom = {};
    chats
      .filter((c) => c.userId === req.user.id)
      .forEach((c) => {
        const existing = byRoom[c.roomId];
        if (!existing || new Date(c.createdAt) > new Date(existing.lastAt)) {
          byRoom[c.roomId] = {
            roomId: c.roomId,
            lastMessage: c.text,
            lastAt: c.createdAt,
            lastFromRole: c.fromRole,
          };
        }
      });

    const conversations = Object.values(byRoom)
      .map((conv) => {
        const room = allRooms.find((r) => r.id === conv.roomId);
        return {
          ...conv,
          roomTitle: room?.title || 'Listing',
          ownerName: room?.owner?.name || 'Owner',
          ownerId: room?.ownerId || null,
          roomImage: room?.images?.[0] || null,
        };
      })
      .sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt));

    return res.json({ conversations });
  }

  if (req.user.role === 'owner') {
    const myRoomIds = allRooms.filter((r) => r.ownerId === req.user.id).map((r) => r.id);
    const byThread = {};

    chats
      .filter((c) => myRoomIds.includes(c.roomId))
      .forEach((c) => {
        const key = `${c.roomId}:${c.userId}`;
        const existing = byThread[key];
        if (!existing || new Date(c.createdAt) > new Date(existing.lastAt)) {
          byThread[key] = {
            roomId: c.roomId,
            tenantId: c.userId,
            lastMessage: c.text,
            lastAt: c.createdAt,
            lastFromRole: c.fromRole,
          };
        }
      });

    const conversations = Object.values(byThread)
      .map((conv) => {
        const room = allRooms.find((r) => r.id === conv.roomId);
        const tenant = users.find((u) => u.id === conv.tenantId);
        return {
          ...conv,
          tenantName: tenant?.name || 'Tenant',
          roomTitle: room?.title || 'Listing',
          roomImage: room?.images?.[0] || null,
        };
      })
      .sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt));

    return res.json({ conversations });
  }

  return res.status(403).json({ error: 'Tenants and owners only' });
});

app.get('/api/chat/rooms/:roomId', authMiddleware, (req, res) => {
  const room = getAllRooms().find((r) => r.id === req.params.roomId);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const users = read('users.json', []);
  let tenantId;

  if (req.user.role === 'tenant') {
    tenantId = req.user.id;
  } else if (req.user.role === 'owner') {
    if (room.ownerId !== req.user.id) return res.status(403).json({ error: 'Not your listing' });
    tenantId = req.query.tenantId;
    if (!tenantId) return res.status(400).json({ error: 'tenantId query required' });
  } else {
    return res.status(403).json({ error: 'Tenants and owners only' });
  }

  const chats = read('chats.json', []);
  ensureWelcomeMessage(chats, room, tenantId);
  const freshChats = read('chats.json', []);
  const messages = sortThreadMessages(freshChats, room.id, tenantId);
  const tenant = users.find((u) => u.id === tenantId);

  res.json({
    messages,
    room: {
      id: room.id,
      title: room.title,
      location: room.location,
      price: room.price,
      image: room.images?.[0],
      owner: room.owner,
    },
    tenant: tenant ? { id: tenant.id, name: tenant.name } : { id: tenantId, name: 'Tenant' },
  });
});

app.post('/api/chat/rooms/:roomId/start', authMiddleware, (req, res) => {
  if (req.user.role !== 'tenant') return res.status(403).json({ error: 'Tenants only' });
  const room = getAllRooms().find((r) => r.id === req.params.roomId);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const chats = read('chats.json', []);
  ensureWelcomeMessage(chats, room, req.user.id);
  const freshChats = read('chats.json', []);
  const messages = sortThreadMessages(freshChats, room.id, req.user.id);

  res.json({
    messages,
    room: { id: room.id, title: room.title, owner: room.owner },
  });
});

app.get('/api/rooms/:id/chat', authMiddleware, (req, res) => {
  const room = getAllRooms().find((r) => r.id === req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  if (req.user.role !== 'tenant') return res.status(403).json({ error: 'Tenants only' });

  const chats = read('chats.json', []);
  ensureWelcomeMessage(chats, room, req.user.id);
  const freshChats = read('chats.json', []);
  const messages = sortThreadMessages(freshChats, room.id, req.user.id);

  res.json({ messages, owner: room.owner });
});

app.post('/api/rooms/:id/chat', authMiddleware, (req, res) => {
  const room = getAllRooms().find((r) => r.id === req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  if (req.user.role !== 'tenant') return res.status(403).json({ error: 'Tenants only' });
  if (room.city && room.city !== 'Jaipur') return res.status(404).json({ error: 'Room not found' });

  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'Message required' });

  const chats = read('chats.json', []);
  chats.push({
    id: uuidv4(),
    roomId: room.id,
    userId: req.user.id,
    ownerId: room.ownerId,
    fromRole: 'tenant',
    senderName: req.user.name,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  });
  write('chats.json', chats);

  const messages = sortThreadMessages(read('chats.json', []), room.id, req.user.id);
  res.status(201).json({ messages });
});

app.post('/api/chat/rooms/:roomId/reply', authMiddleware, (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Owners only' });

  const room = getAllRooms().find((r) => r.id === req.params.roomId);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  if (room.ownerId !== req.user.id) return res.status(403).json({ error: 'Not your listing' });

  const { tenantId, text } = req.body;
  if (!tenantId) return res.status(400).json({ error: 'tenantId required' });
  if (!text?.trim()) return res.status(400).json({ error: 'Message required' });

  const chats = read('chats.json', []);
  ensureWelcomeMessage(chats, room, tenantId);

  const ownerMsg = {
    id: uuidv4(),
    roomId: room.id,
    userId: tenantId,
    ownerId: room.ownerId,
    fromRole: 'owner',
    senderName: req.user.name,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
  const allChats = read('chats.json', []);
  allChats.push(ownerMsg);
  write('chats.json', allChats);

  const messages = sortThreadMessages(read('chats.json', []), room.id, tenantId);
  res.status(201).json({ messages });
});

// ─── Smart Services (tiffin, plumber, etc.) ───
const SERVICES_CATALOG = [
  { id: 'tiffin-veg', name: 'Veg Tiffin', category: 'Food & Tiffin', emoji: '🍱', priceFrom: 80, unit: 'per meal', desc: 'Fresh home-style veg meals — lunch or dinner delivered to your PG.', popular: true },
  { id: 'tiffin-nonveg', name: 'Non-Veg Tiffin', category: 'Food & Tiffin', emoji: '🍗', priceFrom: 100, unit: 'per meal', desc: 'Hygiene-checked non-veg tiffin from trusted Jaipur kitchens.', popular: true },
  { id: 'monthly-meals', name: 'Monthly Meal Plan', category: 'Food & Tiffin', emoji: '📅', priceFrom: 2200, unit: 'per month', desc: 'Breakfast + lunch + dinner packages for students & working tenants.', popular: true },
  { id: 'plumber', name: 'Plumber', category: 'Home Repair', emoji: '🔧', priceFrom: 199, unit: 'visit', desc: 'Tap leak, flush, pipe blockage — verified plumbers in your area.', popular: true },
  { id: 'electrician', name: 'Electrician', category: 'Home Repair', emoji: '⚡', priceFrom: 149, unit: 'visit', desc: 'Fan, switch, wiring & power backup issues fixed fast.', popular: false },
  { id: 'carpenter', name: 'Carpenter', category: 'Home Repair', emoji: '🪚', priceFrom: 249, unit: 'visit', desc: 'Bed repair, cupboard, door lock & furniture fixes.', popular: false },
  { id: 'laundry', name: 'Laundry Pickup', category: 'Daily Living', emoji: '👕', priceFrom: 40, unit: 'per kg', desc: 'Wash & iron with doorstep pickup across Jaipur localities.', popular: true },
  { id: 'cleaning', name: 'Room Deep Clean', category: 'Daily Living', emoji: '🧹', priceFrom: 399, unit: 'per session', desc: 'Professional cleaning for PG rooms, flats & shared spaces.', popular: false },
  { id: 'ac-service', name: 'AC Service', category: 'Appliances', emoji: '❄️', priceFrom: 349, unit: 'per unit', desc: 'AC gas refill, servicing & cooler maintenance before summer.', popular: false },
  { id: 'pest-control', name: 'Pest Control', category: 'Home Repair', emoji: '🐜', priceFrom: 499, unit: 'per visit', desc: 'Cockroach, mosquito & termite treatment for rented rooms.', popular: false },
  { id: 'wifi-setup', name: 'WiFi Setup', category: 'Appliances', emoji: '📶', priceFrom: 199, unit: 'visit', desc: 'Router install, range extender & speed troubleshooting.', popular: false },
  { id: 'packers', name: 'Packers & Movers', category: 'Daily Living', emoji: '📦', priceFrom: 999, unit: 'local shift', desc: 'Small shifting within Jaipur — ideal when changing PG or flat.', popular: false },
];

app.get('/api/services/catalog', (_, res) => {
  res.json({ services: SERVICES_CATALOG, city: 'Jaipur' });
});

app.get('/api/services/bookings', authMiddleware, (req, res) => {
  let bookings = read('serviceBookings.json', []);
  if (req.user.role === 'tenant') {
    bookings = bookings.filter((b) => b.userId === req.user.id);
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Tenants and admin only' });
  }
  res.json(bookings);
});

app.post('/api/services/book', authMiddleware, (req, res) => {
  if (req.user.role !== 'tenant') return res.status(403).json({ error: 'Tenants only' });
  const { serviceId, address, area, phone, notes, preferredDate, preferredTime } = req.body;
  const service = SERVICES_CATALOG.find((s) => s.id === serviceId);
  if (!service) return res.status(400).json({ error: 'Invalid service' });
  if (!address?.trim() || !area?.trim()) return res.status(400).json({ error: 'Address and area required' });

  const booking = {
    id: uuidv4(),
    userId: req.user.id,
    userName: req.user.name,
    userPhone: phone || req.user.phone || '',
    serviceId: service.id,
    serviceName: service.name,
    category: service.category,
    priceFrom: service.priceFrom,
    unit: service.unit,
    address: address.trim(),
    area: area.trim(),
    notes: notes?.trim() || '',
    preferredDate: preferredDate || '',
    preferredTime: preferredTime || '',
    status: 'pending',
    adminNote: '',
    createdAt: new Date().toISOString(),
  };

  const bookings = read('serviceBookings.json', []);
  bookings.unshift(booking);
  write('serviceBookings.json', bookings);
  addPoints(req.user.id, 5, `Booked ${service.name} via Smart Services`);

  res.status(201).json({ booking, message: 'Service request submitted! Our team will contact you shortly.' });
});

app.patch('/api/admin/service-bookings/:id', authMiddleware, adminOnly, (req, res) => {
  const bookings = read('serviceBookings.json', []);
  const idx = bookings.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const { status, adminNote } = req.body;
  if (status) bookings[idx].status = status;
  if (adminNote !== undefined) bookings[idx].adminNote = adminNote;
  bookings[idx].updatedAt = new Date().toISOString();
  write('serviceBookings.json', bookings);
  res.json(bookings[idx]);
});

// ─── Platform Feedback (tenant & owner) ───
app.get('/api/feedback', authMiddleware, (req, res) => {
  if (!['tenant', 'owner', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Not allowed' });
  }
  let list = read('feedbacks.json', []);
  if (req.user.role === 'tenant' || req.user.role === 'owner') {
    list = list.filter((f) => f.userId === req.user.id);
  }
  res.json(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post('/api/feedback', authMiddleware, (req, res) => {
  if (!['tenant', 'owner'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Tenants and owners only' });
  }
  const { rating, category, subject, message } = req.body;
  if (!subject?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Subject and message required' });
  }
  const r = Number(rating);
  if (!r || r < 1 || r > 5) return res.status(400).json({ error: 'Rating 1–5 required' });

  const entry = {
    id: uuidv4(),
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    rating: r,
    category: category || 'general',
    subject: subject.trim(),
    message: message.trim(),
    status: 'open',
    adminReply: '',
    createdAt: new Date().toISOString(),
  };

  const list = read('feedbacks.json', []);
  list.unshift(entry);
  write('feedbacks.json', list);
  addPoints(req.user.id, 3, 'Submitted platform feedback');

  res.status(201).json({ feedback: entry, message: 'Thank you! Your feedback helps us improve SmartRoooms.' });
});

app.get('/api/admin/feedback', authMiddleware, adminOnly, (_, res) => {
  const list = read('feedbacks.json', []);
  res.json(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.patch('/api/admin/feedback/:id', authMiddleware, adminOnly, (req, res) => {
  const list = read('feedbacks.json', []);
  const idx = list.findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const { status, adminReply } = req.body;
  if (status) list[idx].status = status;
  if (adminReply !== undefined) list[idx].adminReply = adminReply;
  list[idx].updatedAt = new Date().toISOString();
  write('feedbacks.json', list);
  res.json(list[idx]);
});

app.get('/api/admin/service-bookings', authMiddleware, adminOnly, (_, res) => {
  res.json(read('serviceBookings.json', []));
});

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api).*/, (req, res, next) => {
    if (req.path.includes('.')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`SmartRoooms API running on http://localhost:${PORT}`);
  if (fs.existsSync(frontendDist)) {
    console.log(`SmartRoooms website ready at http://localhost:${PORT} (production mode)`);
  } else {
    console.log(`Dev frontend: http://localhost:5173 (run npm run dev from project root)`);
  }
});
