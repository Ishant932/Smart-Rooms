import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Home, Sparkles } from 'lucide-react';
import { JAIPUR_LOCATIONS, BUDGET_RANGES, CITY } from '../utils/helpers';

export default function SearchBar({ compact = false }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [gender, setGender] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ city: CITY });
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    if (type) params.set('type', type);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (gender) params.set('gender', gender);
    navigate(`/rooms?${params.toString()}`);
  };

  const quickArea = (area) => {
    navigate(`/rooms?city=${CITY}&location=${encodeURIComponent(area)}`);
  };

  return (
    <motion.form
      onSubmit={handleSearch}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.35, type: 'spring', stiffness: 120 }}
      whileHover={{ boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.15)' }}
      className={`glass w-full rounded-2xl shadow-2xl shadow-brand-500/10 ring-1 ring-white/60 ${compact ? 'p-3' : 'p-2 sm:p-3'}`}
    >
      <div className={`grid gap-2 ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6'}`}>
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            placeholder="Search PG, flats in Jaipur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border-0 bg-white py-3.5 pl-10 pr-4 text-sm shadow-sm ring-1 ring-gray-200 transition focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full appearance-none rounded-xl border-0 bg-white py-3.5 pl-10 pr-8 text-sm shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Jaipur Areas</option>
            {JAIPUR_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full appearance-none rounded-xl border-0 bg-white py-3.5 pl-10 pr-8 text-sm shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-500">
            <option value="">Any Type</option>
            <option value="pg-boys">Boys PG</option>
            <option value="pg-girls">Girls PG</option>
            <option value="flat">Flat</option>
            <option value="shared-room">Shared Room</option>
            <option value="hostel">Hostel</option>
          </select>
        </div>

        <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="rounded-xl border-0 bg-white py-3.5 px-3 text-sm shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-500">
          <option value="">Budget</option>
          {BUDGET_RANGES.map((b) => (
            <option key={b.max} value={b.max}>{b.label}</option>
          ))}
        </select>

        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(99,102,241,0.35)' }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 via-purple-600 to-pink-500 bg-[length:200%_100%] py-3.5 text-sm font-bold text-white shadow-lg animate-gradient-x"
        >
          <Sparkles size={18} />
          Search Jaipur
        </motion.button>
      </div>

      {!compact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-3 flex flex-wrap items-center gap-2 px-2"
        >
          <span className="text-xs font-medium text-gray-500">Hot areas:</span>
          {['Malviya Nagar', 'Mansarovar', 'Vaishali Nagar', 'Sodala', 'Khatipura'].map((area, i) => (
            <motion.button
              key={area}
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.05 }}
              whileHover={{ scale: 1.08, y: -2 }}
              onClick={() => quickArea(area)}
              className="rounded-full bg-gradient-to-r from-brand-50 to-purple-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100"
            >
              {area}
            </motion.button>
          ))}
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            <option value="">Any Gender</option>
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
          </select>
        </motion.div>
      )}
    </motion.form>
  );
}
