import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Loader2, MapPin } from 'lucide-react';
import RoomCard from '../components/RoomCard';
import SearchBar from '../components/SearchBar';
import FilterControls from '../components/FilterControls';
import AnimatedPage from '../components/AnimatedPage';
import ThreeDBackground from '../components/ThreeDBackground';
import { getRooms } from '../api/client';
import { CITY } from '../utils/helpers';

const QUICK_FILTERS = [
  { key: 'type', value: 'pg-boys', label: 'Boys PG' },
  { key: 'type', value: 'pg-girls', label: 'Girls PG' },
  { key: 'verified', value: 'true', label: 'Verified' },
  { key: 'maxPrice', value: '6000', label: 'Under ₹6K' },
  { key: 'furnishing', value: 'Fully Furnished', label: 'Furnished' },
];

export default function RoomsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const filters = {
    city: searchParams.get('city') || CITY,
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    gender: searchParams.get('gender') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
    location: searchParams.get('location') || '',
    furnishing: searchParams.get('furnishing') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    minRating: searchParams.get('minRating') || '',
    verified: searchParams.get('verified') || '',
    amenity: searchParams.get('amenity') || '',
  };

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    getRooms(params)
      .then((data) => { setRooms(data.rooms); setTotal(data.total); })
      .finally(() => setLoading(false));
  }, [searchParams.toString()]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!next.get('city')) next.set('city', CITY);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const toggleAmenity = (a) => updateFilter('amenity', filters.amenity === a ? '' : a);

  const applyQuick = (key, value) => updateFilter(key, filters[key] === value ? '' : value);

  const clearFilters = () => setSearchParams({ city: CITY });

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => v && k !== 'city').length;

  return (
    <AnimatedPage className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-brand-50/20">
      <ThreeDBackground variant="subtle" />
      <div className="relative border-b border-gray-200/80 bg-white/60 px-4 py-8 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 text-sm font-medium text-brand-600">
              <MapPin size={16} /> Jaipur, Rajasthan
            </div>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">Rooms in Jaipur</h1>
            <p className="mt-2 text-gray-500">
              {loading ? 'Searching Jaipur listings...' : `${total} student rooms & PGs in Jaipur`}
            </p>
          </motion.div>
          <div className="mt-6"><SearchBar compact /></div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {QUICK_FILTERS.map((q) => (
              <motion.button
                key={q.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => applyQuick(q.key, q.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  filters[q.key] === q.value
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-brand-300'
                }`}
              >
                {q.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden w-72 shrink-0 lg:block"
          >
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Jaipur Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs font-semibold text-brand-500 hover:underline">Clear ({activeFilterCount})</button>
                )}
              </div>
              <FilterControls filters={filters} updateFilter={updateFilter} toggleAmenity={toggleAmenity} />
            </div>
          </motion.aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <button onClick={() => setShowFilters(true)} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm lg:hidden">
                <SlidersHorizontal size={16} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              <motion.select
                whileTap={{ scale: 0.98 }}
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm"
              >
                <option value="">Newest First</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </motion.select>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-20">
                  <Loader2 className="animate-spin text-brand-500" size={44} />
                  <p className="mt-4 animate-pulse text-gray-500">Finding rooms in Jaipur...</p>
                </motion.div>
              ) : rooms.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl bg-white py-20 text-center shadow-md">
                  <p className="text-6xl">🏜️</p>
                  <h3 className="mt-4 text-xl font-semibold">No rooms in this area</h3>
                  <p className="mt-2 text-gray-500">Try another Jaipur locality or clear filters</p>
                  <button onClick={clearFilters} className="mt-6 rounded-full bg-brand-500 px-6 py-2 text-sm font-semibold text-white">Show All Jaipur</button>
                </motion.div>
              ) : (
                <motion.div key="grid" layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {rooms.map((room, i) => (
                    <RoomCard key={room.id} room={room} index={i} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setShowFilters(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28 }} className="fixed right-0 top-0 z-50 h-full w-80 overflow-y-auto bg-white p-6 shadow-2xl lg:hidden">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-bold">Jaipur Filters</h3>
                <button onClick={() => setShowFilters(false)}><X size={20} /></button>
              </div>
              <FilterControls filters={filters} updateFilter={updateFilter} toggleAmenity={toggleAmenity} />
              <button onClick={() => setShowFilters(false)} className="mt-6 w-full rounded-xl bg-brand-500 py-3 font-semibold text-white">Apply</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
