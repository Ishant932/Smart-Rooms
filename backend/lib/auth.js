const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { read, write } = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'smartroooms-dev-secret-2026';
const SIGNUP_POINTS = 80;
const REFERRAL_CASH = 150;
const POINTS_FOR_DISCOUNT = 500;
const DISCOUNT_AMOUNT = 50;
const TRANSACTION_POINTS = 15;
const MAX_WALLET_BALANCE = 100;

function walletCreditRoom(wallet) {
  return Math.max(0, MAX_WALLET_BALANCE - (wallet.balance || 0));
}

function applyWalletCredit(wallet, amount) {
  return Math.min(Number(amount) || 0, walletCreditRoom(wallet));
}

function generateReferralCode(name) {
  const base = (name || 'SR').replace(/\s/g, '').slice(0, 4).toUpperCase();
  return `${base}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function getUsers() {
  return read('users.json', []);
}

function saveUsers(users) {
  write('users.json', users);
}

function getWallets() {
  return read('wallets.json', []);
}

function saveWallets(wallets) {
  write('wallets.json', wallets);
}

function getWallet(userId) {
  const wallets = getWallets();
  let wallet = wallets.find((w) => w.userId === userId);
  if (!wallet) {
    wallet = {
      userId,
      balance: 0,
      points: 0,
      referralCode: generateReferralCode('SR'),
      referredBy: null,
      totalEarned: 0,
      totalSpent: 0,
    };
    wallets.push(wallet);
    saveWallets(wallets);
  }
  return wallet;
}

function updateWallet(userId, updates) {
  const wallets = getWallets();
  const idx = wallets.findIndex((w) => w.userId === userId);
  if (idx === -1) return null;
  const next = { ...wallets[idx], ...updates };
  if (next.balance !== undefined) {
    next.balance = Math.min(MAX_WALLET_BALANCE, Math.max(0, Number(next.balance) || 0));
  }
  wallets[idx] = next;
  saveWallets(wallets);
  return wallets[idx];
}

function addWalletTransaction(userId, entry) {
  const txs = read('walletTransactions.json', []);
  const tx = { id: uuidv4(), userId, ...entry, createdAt: new Date().toISOString() };
  txs.unshift(tx);
  write('walletTransactions.json', txs);
  return tx;
}

function addPoints(userId, points, reason) {
  const wallet = getWallet(userId);
  const newPoints = wallet.points + points;
  updateWallet(userId, { points: newPoints });
  addWalletTransaction(userId, { type: 'points', amount: points, reason, balanceAfter: wallet.balance, pointsAfter: newPoints });
  return newPoints;
}

function addCash(userId, amount, reason) {
  const wallet = getWallet(userId);
  const credit = applyWalletCredit(wallet, amount);
  if (credit <= 0) return wallet.balance;
  const newBalance = wallet.balance + credit;
  updateWallet(userId, { balance: newBalance, totalEarned: (wallet.totalEarned || 0) + credit });
  addWalletTransaction(userId, { type: 'cash', amount: credit, reason, balanceAfter: newBalance, pointsAfter: wallet.points });
  return newBalance;
}

function redeemPointsForDiscount(userId) {
  const wallet = getWallet(userId);
  if (wallet.points < POINTS_FOR_DISCOUNT) {
    return { error: `Need ${POINTS_FOR_DISCOUNT} points. You have ${wallet.points}.` };
  }
  const credit = applyWalletCredit(wallet, DISCOUNT_AMOUNT);
  if (credit <= 0) {
    return { error: 'Unable to redeem right now. Try again later.' };
  }
  const newBalance = wallet.balance + credit;
  const newPoints = wallet.points - POINTS_FOR_DISCOUNT;
  updateWallet(userId, { points: newPoints, balance: newBalance });
  addWalletTransaction(userId, {
    type: 'redeem',
    pointsUsed: POINTS_FOR_DISCOUNT,
    cashAdded: credit,
    reason: `Redeemed ${POINTS_FOR_DISCOUNT} points for ₹${credit} rent credit`,
    balanceAfter: newBalance,
    pointsAfter: newPoints,
  });
  return { success: true, discount: credit, pointsRemaining: newPoints };
}

function processReferral(referrerId, newUserId) {
  addCash(referrerId, REFERRAL_CASH, `Referral bonus — new user joined`);
  addPoints(referrerId, 35, 'Successful referral');
}

function processBookingReferral(referrerId, tenantId, roomTitle) {
  addCash(referrerId, REFERRAL_CASH, `Referral rent bonus — ${roomTitle}`);
  addPoints(referrerId, 25, 'Referral room booking');
  addPoints(tenantId, TRANSACTION_POINTS, 'Room booked via SmartRoooms');
}

function processTransactionPoints(tenantId, ownerId, amount) {
  addPoints(tenantId, TRANSACTION_POINTS, 'Rent payment completed');
  addPoints(ownerId, TRANSACTION_POINTS, 'Rent received via SmartRoooms');
  const tenantWallet = getWallet(tenantId);
  const ownerWallet = getWallet(ownerId);
  return { tenantPoints: tenantWallet.points, ownerPoints: ownerWallet.points };
}

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

async function register(payload) {
  const {
    name, firstName, lastName, email, password, role, phone, college, referralCode,
    preferredArea, address, gender, age, lookingFor, budget, propertyTypes,
    bio, facilities, termsAccepted,
  } = payload;

  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: 'Email already registered' };
  }
  if (phone && users.find((u) => u.phone === phone)) {
    return { error: 'Phone number already registered' };
  }
  if (!['tenant', 'owner'].includes(role)) {
    return { error: 'Role must be tenant or owner' };
  }
  if (!termsAccepted) {
    return { error: 'You must accept Terms & Conditions' };
  }
  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters' };
  }

  let referrer = null;
  if (referralCode) {
    const wallets = getWallets();
    referrer = wallets.find((w) => w.referralCode === referralCode.toUpperCase());
  }

  const fullName = name || `${firstName || ''} ${lastName || ''}`.trim();

  const user = {
    id: uuidv4(),
    name: fullName,
    firstName: firstName || fullName.split(' ')[0] || '',
    lastName: lastName || fullName.split(' ').slice(1).join(' ') || '',
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 10),
    role,
    phone: phone || '',
    college: college || '',
    preferredArea: preferredArea || '',
    address: address || '',
    gender: gender || '',
    age: age ? Number(age) : null,
    lookingFor: lookingFor || (role === 'tenant' ? 'pg' : ''),
    budget: budget ? Number(budget) : null,
    propertyTypes: propertyTypes || [],
    bio: bio || '',
    facilities: facilities || [],
    termsAccepted: true,
    termsAcceptedAt: new Date().toISOString(),
    profileComplete: true,
    createdAt: new Date().toISOString(),
    status: 'active',
    listings: role === 'owner' ? [] : undefined,
    bookings: role === 'tenant' ? [] : undefined,
  };

  users.push(user);
  saveUsers(users);

  const wallet = {
    userId: user.id,
    balance: 0,
    points: SIGNUP_POINTS,
    referralCode: generateReferralCode(name),
    referredBy: referrer?.userId || null,
    totalEarned: 0,
    totalSpent: 0,
  };
  const wallets = getWallets();
  wallets.push(wallet);
  saveWallets(wallets);

  addWalletTransaction(user.id, {
    type: 'points',
    amount: SIGNUP_POINTS,
    reason: 'Welcome bonus on registration',
    balanceAfter: 0,
    pointsAfter: SIGNUP_POINTS,
  });

  if (referrer) {
    processReferral(referrer.userId, user.id);
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return { user: sanitizeUser(user), token, wallet: getWallet(user.id) };
}

async function login(email, password) {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: 'Invalid email or password' };
  }
  if (user.status === 'suspended') {
    return { error: 'Your account has been suspended. Contact admin.' };
  }
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return { user: sanitizeUser(user), token, wallet: getWallet(user.id) };
}

function updateProfile(userId, updates) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { error: 'User not found' };

  const allowed = [
    'name', 'firstName', 'lastName', 'phone', 'college', 'preferredArea', 'address',
    'gender', 'age', 'bio', 'lookingFor', 'budget', 'propertyTypes', 'facilities',
  ];
  const next = { ...users[idx] };
  allowed.forEach((key) => {
    if (updates[key] !== undefined) next[key] = updates[key];
  });
  if (updates.firstName || updates.lastName) {
    next.name = `${next.firstName || ''} ${next.lastName || ''}`.trim() || next.name;
  }
  next.updatedAt = new Date().toISOString();
  users[idx] = next;
  saveUsers(users);
  return { user: sanitizeUser(next) };
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(header.slice(7), JWT_SECRET);
    const users = getUsers();
    const user = users.find((u) => u.id === decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (user.status === 'suspended') return res.status(403).json({ error: 'Account suspended' });
    req.user = sanitizeUser(user);
    req.wallet = getWallet(user.id);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}

module.exports = {
  JWT_SECRET,
  SIGNUP_POINTS,
  REFERRAL_CASH,
  POINTS_FOR_DISCOUNT,
  DISCOUNT_AMOUNT,
  TRANSACTION_POINTS,
  getUsers,
  saveUsers,
  getWallet,
  getWallets,
  updateWallet,
  addWalletTransaction,
  addPoints,
  addCash,
  redeemPointsForDiscount,
  processReferral,
  processBookingReferral,
  processTransactionPoints,
  sanitizeUser,
  register,
  login,
  updateProfile,
  authMiddleware,
  adminOnly,
};
