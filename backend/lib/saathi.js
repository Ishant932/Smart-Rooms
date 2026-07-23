/**
 * Saathi — SmartRoooms on-site knowledge assistant (no paid AI API).
 * Keyword / intent matching over curated product facts.
 */

const KB = [
  {
    id: 'greeting',
    patterns: [/^(hi|hello|hey|namaste|good\s*(morning|evening|afternoon))\b/i, /\bsaathi\b/i],
    answer:
      'Namaste! I am Saathi, your SmartRoooms guide for Jaipur student rooms. Ask me about PGs, flats, wallet points, Play & Earn, posting a listing, or contacting owners.',
  },
  {
    id: 'what-is',
    patterns: [/what is smartroooms/i, /about (this|the) (app|site|platform)/i, /smart\s*roooms/i],
    answer:
      'SmartRoooms is Jaipur’s student room platform — verified PGs, hostels & flats with zero brokerage. Tenants browse, chat with owners, earn game points, and redeem for rent credit. Owners list free and manage enquiries from the dashboard.',
  },
  {
    id: 'areas',
    patterns: [/area|localit|malviya|mansarovar|vaishali|sodala|jagatpura|tonk|where.*(room|pg)|jaipur.*(area|local)/i],
    answer:
      'Popular SmartRoooms areas in Jaipur: Malviya Nagar, Mansarovar, Vaishali Nagar, Sodala, Khatipura, Jagatpura, Gopalpura, Vidhyadhar Nagar, Raja Park, C-Scheme, Tonk Road, Sanganer. Use Rooms → Area filter to narrow listings.',
  },
  {
    id: 'brokerage',
    patterns: [/broker|commission|free|zero\s*broker/i],
    answer:
      'SmartRoooms is zero brokerage for tenants. You chat directly with owners — no middleman fee from us for finding a room.',
  },
  {
    id: 'post-room',
    patterns: [/post.*(room|listing|pg)|list.*(room|property)|owner.*(how|start)|how.*(list|post)/i],
    answer:
      'Owners: Sign up as Owner → Post Your Room (or Dashboard → My Listings). Add photos, rent, deposit, amenities, and area. Listings are free. After login go to /post or Owner Dashboard.',
  },
  {
    id: 'find-room',
    patterns: [/find.*(room|pg|flat)|how.*(search|book)|browse|rent.*room/i],
    answer:
      'Open Rooms, filter by area, type (Boys/Girls PG, flat, shared, hostel), budget, furnishing, and verified. Open a listing → Contact / Chat with Owner. Compare up to a few listings with Compare.',
  },
  {
    id: 'wallet',
    patterns: [/wallet|points|redeem|discount|500|₹50|rs\.?\s*50/i],
    answer:
      'Wallet & Points: Play games or complete actions to earn points. Redeem 500 points for ₹50 rent credit in Tenant Dashboard → Wallet. You can also pay rent from wallet balance when available.',
  },
  {
    id: 'games',
    patterns: [/game|play\s*&?\s*earn|spin|leaderboard|mini\s*game/i],
    answer:
      'Play & Earn has 6 mini games (Spin Wheel, Tap Race, Memory, Dice, Reaction, Coin Flip). Points are small (about 1–3 pts per play). Open Tenant Dashboard → Play & Earn. Redeem 500 pts = ₹50 rent credit.',
  },
  {
    id: 'signup',
    patterns: [/sign\s*up|register|create\s*account|otp|verify\s*email/i],
    answer:
      'Go to Sign Up, choose Tenant or Owner, verify email with OTP, then complete your profile. Forgot password? Use Login → Forgot password for an email OTP reset.',
  },
  {
    id: 'chat',
    patterns: [/chat|message|whatsapp|contact\s*owner|enquire|inquiry/i],
    answer:
      'On a room page use Contact / Chat to message the owner inside SmartRoooms. Tenants see threads under Dashboard → Chat with Owners. Owners reply under Chat with Tenants.',
  },
  {
    id: 'services',
    patterns: [/tiffin|plumber|laundry|electrician|smart\s*service|service/i],
    answer:
      'Smart Services covers tiffin, plumber, electrician, laundry and more for your PG/flat in Jaipur. Browse /services or Tenant Dashboard → Smart Services. Bookings earn a few reward points.',
  },
  {
    id: 'partner',
    patterns: [/room\s*partner|roommate|share.*rent|split/i],
    answer:
      'Looking for a roommate? Use Tenant Dashboard → Room Partner to post or browse roommate needs, or filter Shared Rooms on the Rooms page.',
  },
  {
    id: 'safety',
    patterns: [/safe|verified|girl|security|cctv|trust/i],
    answer:
      'Prefer Verified listings (badge on cards). Girls PG filter is available. Always visit before paying large deposits, and use in-app chat so you keep a record. Report issues via Complaints in your dashboard.',
  },
  {
    id: 'pricing',
    patterns: [/price|budget|rent|deposit|cost|cheap|under\s*\d/i],
    answer:
      'Rents vary by area and type — many student PGs start around ₹3,000–₹8,000/month. Use Min/Max rent filters and budget quick pills on Rooms. Deposits are set by each owner on the listing.',
  },
  {
    id: 'compare',
    patterns: [/compare/i],
    answer:
      'Add rooms to Compare from listing cards, then open /compare to see side-by-side rent, amenities, and location.',
  },
  {
    id: 'referral',
    patterns: [/refer|referral|invite/i],
    answer:
      'Share your referral code from Dashboard → Referrals. When friends sign up with it, you can earn cash/rewards as configured on the platform.',
  },
  {
    id: 'admin',
    patterns: [/admin|suspend|voucher/i],
    answer:
      'Admins manage owners, tenants, listings, vouchers, analytics, and can suspend users from the Admin Dashboard. Regular users cannot access admin tools.',
  },
  {
    id: 'contact',
    patterns: [/contact|support|help|phone|email|hello@/i],
    answer:
      'Help Center: /help · Contact: /contact · Email: hello@smartroooms.in. For account issues use Complaints or Feedback in your dashboard.',
  },
];

function scoreMatch(text, patterns) {
  let score = 0;
  for (const p of patterns) {
    if (p.test(text)) score += 1;
  }
  return score;
}

function askSaathi(message) {
  const text = String(message || '').trim();
  if (!text) {
    return {
      reply: 'Ask me anything about SmartRoooms — rooms, wallet, games, or how to list a PG.',
      intent: 'empty',
    };
  }

  let best = null;
  let bestScore = 0;
  for (const entry of KB) {
    const s = scoreMatch(text, entry.patterns);
    if (s > bestScore) {
      bestScore = s;
      best = entry;
    }
  }

  if (!best || bestScore === 0) {
    return {
      reply:
        'I am not sure about that yet. Try asking about Jaipur areas, finding a PG, posting a room, wallet points, Play & Earn games, Smart Services, or contact support. You can also open Help (/help) or Contact (/contact).',
      intent: 'fallback',
      suggestions: ['How do I find a PG?', 'How do wallet points work?', 'How do I post a room?', 'What areas are covered?'],
    };
  }

  return {
    reply: best.answer,
    intent: best.id,
    suggestions:
      best.id === 'greeting'
        ? ['Find a room in Mansarovar', 'Wallet & redeem points', 'Play & Earn games', 'Post a listing']
        : undefined,
  };
}

module.exports = { askSaathi, KB };
