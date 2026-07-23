import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Scale, ArrowRight } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { formatPrice, TYPE_LABELS } from '../utils/helpers';
import ThreeDBackground from '../components/ThreeDBackground';

export default function ComparePage() {
  const { items, removeFromCompare, clearCompare, max } = useCompare();

  const rows = [
    { label: 'Price', key: (r) => formatPrice(r.price) },
    { label: 'Type', key: (r) => TYPE_LABELS[r.type] || r.type },
    { label: 'Location', key: (r) => r.location },
    { label: 'Bedrooms', key: (r) => r.bedrooms },
    { label: 'Furnishing', key: (r) => r.furnishing },
    { label: 'Rating', key: (r) => r.rating ? `${r.rating} ★` : '—' },
    { label: 'Verified', key: (r) => r.verified ? '✓ Yes' : 'No' },
    { label: 'Amenities', key: (r) => (r.amenities || []).slice(0, 5).join(', ') },
  ];

  return (
    <div className="relative min-h-screen py-12">
      <ThreeDBackground variant="subtle" />
      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold">
                <Scale className="text-brand-500" /> Compare Properties
              </h1>
              <p className="text-sm text-gray-500">Compare up to {max} properties side by side</p>
            </div>
            {items.length > 0 && (
              <button onClick={clearCompare} className="text-sm text-red-500 hover:underline">Reset all</button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="mt-12 rounded-3xl bg-white/90 p-12 text-center shadow-lg ring-1 ring-gray-100 backdrop-blur">
              <p className="text-gray-500">No properties selected. Browse rooms and click &quot;Compare&quot; on listings.</p>
              <Link to="/rooms" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white">
                Browse Rooms <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="mt-8 overflow-x-auto rounded-3xl bg-white/95 shadow-xl ring-1 ring-gray-100 backdrop-blur">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-4 text-left font-medium text-gray-500">Feature</th>
                    {items.map((room) => (
                      <th key={room.id} className="p-4 text-left">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link to={`/rooms/${room.id}`} className="font-bold text-brand-600 hover:underline line-clamp-2">{room.title}</Link>
                            <p className="mt-1 text-xs text-gray-400">{room.city}</p>
                          </div>
                          <button onClick={() => removeFromCompare(room.id)} className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500">
                            <X size={16} />
                          </button>
                        </div>
                        {room.images?.[0] && (
                          <img src={room.images[0]} alt="" className="mt-2 h-24 w-full rounded-xl object-cover" />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ label, key }) => (
                    <tr key={label} className="border-b border-gray-50">
                      <td className="p-4 font-medium text-gray-600">{label}</td>
                      {items.map((room) => (
                        <td key={room.id} className="p-4 text-gray-800">{key(room)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-4" />
                    {items.map((room) => (
                      <td key={room.id} className="p-4">
                        <Link to={`/rooms/${room.id}`} className="rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white">View Details</Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
