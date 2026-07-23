import { motion } from 'framer-motion';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { getListingCoordinates, getMapsDirectionsUrl, getOpenStreetMapEmbedUrl } from '../utils/helpers';

export default function ListingMap({ room }) {
  const coords = getListingCoordinates(room);
  const embedUrl = getOpenStreetMapEmbedUrl(room);
  const directionsUrl = getMapsDirectionsUrl(room);
  const displayArea = room?.location
    ? `${room.location.charAt(0).toUpperCase()}${room.location.slice(1)}, Jaipur`
    : 'Jaipur, Rajasthan';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <MapPin size={20} className="text-brand-500" />
            Location on Map
          </h2>
          <p className="mt-1 text-sm text-gray-500">{room?.address || displayArea}</p>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-brand-600"
        >
          <Navigation size={16} />
          Get Directions
          <ExternalLink size={14} className="opacity-80" />
        </a>
      </div>

      <div className="relative aspect-[16/10] min-h-[280px] w-full bg-gray-100 sm:aspect-[21/9]">
        <iframe
          title={`Map — ${room?.title || 'Listing'}`}
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <motion.div
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', delay: 0.3 }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full"
        >
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-brand-500 p-2 shadow-lg ring-4 ring-white">
              <MapPin size={22} className="text-white" fill="currentColor" />
            </div>
            <span className="mt-1 max-w-[160px] truncate rounded-lg bg-gray-900/90 px-2 py-1 text-xs font-semibold text-white shadow-lg">
              {displayArea}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-3 border-t border-gray-100 bg-gray-50/80 px-6 py-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Area</p>
          <p className="text-sm font-medium text-gray-800">{displayArea}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">City</p>
          <p className="text-sm font-medium text-gray-800">{room?.city || 'Jaipur'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Coordinates</p>
          <p className="text-sm font-medium text-gray-800">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</p>
        </div>
      </div>
    </motion.div>
  );
}
