export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

/** Build WhatsApp link for Indian mobile numbers */
export function whatsappUrl(phone, message = '') {
  const digits = String(phone || '').replace(/\D/g, '');
  const full = digits.length === 10 ? `91${digits}` : digits;
  const base = `https://wa.me/${full}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function previousTenantWhatsAppMessage(roomTitle, location) {
  return `Hi! I found "${roomTitle}" on SmartRoooms (${location || 'Jaipur'}). You were the previous tenant — could you tell me about the room?`;
}

export function isRoomAvailableWithTenant(room) {
  return room?.listingStatus === 'available' && room?.lastTenant?.phone;
}

export const CITY = 'Jaipur';

export const TYPE_LABELS = {
  'pg-boys': 'Boys PG',
  'pg-girls': 'Girls PG',
  flat: 'Flat',
  'shared-room': 'Shared Room',
  hostel: 'Hostel',
};

export const JAIPUR_LOCATIONS = [
  'Malviya Nagar', 'Vaishali Nagar', 'Sodala', 'Mansarovar', 'Vidhyadhar Nagar',
  'Gopalpura', 'Khatipura', 'Raja Park', 'C Scheme', 'Bani Park',
  'Jagatpura', 'Tonk Phatak', 'Pratap Nagar', 'Sitapura', 'Jhotwara',
  'Shastri Nagar', 'Sanganer', 'Tonk Road', 'Ajmer Road',
  'Patrakar Colony', 'Gandhi Nagar', 'Subhash Nagar', 'Civil Lines',
];

/** Approximate map coordinates for Jaipur areas (for listing maps) */
export const JAIPUR_COORDS = {
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
  'jaipur': { lat: 26.9124, lng: 75.7873 },
};

export function getListingCoordinates(room) {
  if (room?.lat && room?.lng) {
    return { lat: Number(room.lat), lng: Number(room.lng) };
  }
  const haystack = `${room?.location || ''} ${room?.address || ''} ${room?.city || ''}`.toLowerCase();
  for (const [key, coords] of Object.entries(JAIPUR_COORDS)) {
    if (key !== 'jaipur' && haystack.includes(key)) return coords;
  }
  return JAIPUR_COORDS.jaipur;
}

export function getMapsDirectionsUrl(room) {
  const { lat, lng } = getListingCoordinates(room);
  const label = encodeURIComponent(`${room?.title || 'Property'}, ${room?.location || 'Jaipur'}`);
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${label}`;
}

export function getOpenStreetMapEmbedUrl(room, zoom = 0.012) {
  const { lat, lng } = getListingCoordinates(room);
  const bbox = [lng - zoom, lat - zoom, lng + zoom, lat + zoom].join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`;
}

/** Build a rich description when owner text is short */
export function enrichListingDescription(room) {
  const typeLabel = TYPE_LABELS[room?.type] || room?.type || 'Property';
  const area = room?.location || 'Jaipur';
  const raw = (room?.description || '').trim();
  const amenityList = room?.amenities?.length ? room.amenities.join(', ') : 'standard amenities';

  const highlights = [
    `${typeLabel} in ${area}, Jaipur`,
    room?.bedrooms ? `${room.bedrooms} bedroom${room.bedrooms > 1 ? 's' : ''} · ${room.bathrooms || 1} bathroom` : null,
    room?.area ? `${room.area} sq.ft living space` : null,
    room?.furnishing ? `${room.furnishing} setup` : null,
    room?.availableFor ? `Ideal for ${room.availableFor}` : null,
    room?.gender && room.type?.includes('pg') ? `${room.gender} occupancy` : null,
    `Monthly rent ${formatPrice(room?.price || 0)} · Deposit ${formatPrice(room?.deposit || 0)}`,
    room?.verified ? 'SmartRoooms verified listing' : 'Owner-posted on SmartRoooms',
  ].filter(Boolean);

  const nearby = [
    area.includes('Malviya') || area.toLowerCase().includes('malviya') ? 'Near MNIT & major coaching hubs' : null,
    area.includes('Mansarovar') || area.toLowerCase().includes('mansarovar') ? 'Close to JECRC & Mansarovar metro corridor' : null,
    area.includes('Jagatpura') || area.toLowerCase().includes('jagatpura') ? 'Popular with Poornima & Jagatpura students' : null,
    area.includes('Vaishali') || area.toLowerCase().includes('vaishali') ? 'Well connected to Vaishali Nagar markets' : null,
    'Auto, bus & cab connectivity across Jaipur',
    'Shops, tiffin services & ATMs in walking distance',
  ].filter(Boolean);

  const paragraphs = [];

  if (raw.length >= 80) {
    paragraphs.push(raw);
  } else {
    paragraphs.push(
      `Welcome to this ${typeLabel.toLowerCase()} located in ${area}, one of Jaipur's most sought-after areas for students and working professionals. ${raw.length > 3 ? raw : 'This property is listed on SmartRoooms with zero brokerage — connect directly with the owner or book instantly for free.'}`,
      `The space offers ${room?.furnishing?.toLowerCase() || 'comfortable'} living with ${amenityList.toLowerCase()}. Whether you're studying at a nearby college or working in the city, this location gives you easy access to daily essentials, public transport, and local markets.`,
      `Rent is ${formatPrice(room?.price || 0)} per month with a security deposit of ${formatPrice(room?.deposit || 0)}. SmartRoooms ensures verified photos, zero commission, and options to chat with the owner or contact our helpline before you visit.`,
    );
  }

  if (room?.amenities?.length) {
    paragraphs.push(
      `Included amenities: ${amenityList}. Use Chat with Owner to ask about meals, WiFi speed, laundry, parking, or visit timing before you finalize.`,
    );
  }

  return { paragraphs, highlights, nearby, summary: paragraphs[0] };
}

export const COLLEGES = [
  'MNIT Jaipur', 'JECRC University', 'Amity University', 'Poornima University',
  'Jaipur National University', 'IIIM Jaipur', 'St. Xavier\'s College',
  'Allen Coaching Hub', 'Resonance Coaching', 'University of Rajasthan',
];

export const FURNISHING_OPTIONS = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];

export const AMENITY_FILTERS = [
  'WiFi', 'Meals', 'AC', 'CCTV', 'Parking', 'Laundry', 'Power Backup',
  'Study Table', 'RO Water', 'Bike Parking', 'Security', 'Lift',
  'Gym', 'Housekeeping', 'Balcony', 'Fridge', 'Washing Machine', 'Warden',
  'Geyser', 'TV', 'Attached Bathroom', 'Food Included', 'House Rules',
];

export const FACILITY_OPTIONS = AMENITY_FILTERS;

export const LOOKING_FOR_OPTIONS = [
  { value: 'pg', label: 'PG / Hostel' },
  { value: 'shared-room', label: 'Shared Room' },
  { value: 'flat', label: 'Flat / BHK' },
  { value: 'room-partner', label: 'Room Partner' },
];

export const PROPERTY_TYPE_OPTIONS = [
  { value: 'pg-boys', label: 'Boys PG' },
  { value: 'pg-girls', label: 'Girls PG' },
  { value: 'flat', label: 'Flat / BHK' },
  { value: 'shared-room', label: 'Shared Room' },
  { value: 'hostel', label: 'Hostel' },
];

export const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export const BUDGET_RANGES = [
  { label: 'Under ₹4,000', max: 4000 },
  { label: 'Under ₹6,000', max: 6000 },
  { label: 'Under ₹8,000', max: 8000 },
  { label: 'Under ₹10,000', max: 10000 },
  { label: 'Under ₹15,000', max: 15000 },
];

// backward compat
export const CITIES = [CITY];

export const AMENITY_ICONS = {
  WiFi: '📶',
  Meals: '🍽️',
  AC: '❄️',
  CCTV: '📹',
  Parking: '🅿️',
  Laundry: '🧺',
  'Power Backup': '🔋',
  'Study Table': '📚',
  Warden: '👮',
  Gym: '💪',
  Housekeeping: '🧹',
  'Bike Parking': '🏍️',
  'RO Water': '💧',
  Balcony: '🌅',
  Fridge: '🧊',
  'Washing Machine': '🫧',
  Security: '🔒',
  Lift: '🛗',
};
