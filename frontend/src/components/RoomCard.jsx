import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, ShieldCheck, Heart, Scale, MessageCircle, UserCheck, Phone } from 'lucide-react';
import { formatPrice, TYPE_LABELS, whatsappUrl, previousTenantWhatsAppMessage, isRoomAvailableWithTenant } from '../utils/helpers';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import OwnerChatPanel from './OwnerChatPanel';
import ContactNowModal from './ContactNowModal';

export default function RoomCard({ room, index = 0 }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCompare, isInCompare, max } = useCompare();
  const [chatOpen, setChatOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = addToCompare(room);
    if (!result.ok) alert(result.message);
  };

  const showPrevTenant = isRoomAvailableWithTenant(room);
  const prevWa = showPrevTenant
    ? whatsappUrl(room.lastTenant.phone, previousTenantWhatsAppMessage(room.title, room.location))
    : null;

  const handlePrevTenant = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(prevWa, '_blank', 'noopener,noreferrer');
  };

  const handleChat = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/dashboard/tenant/messages?room=${room.id}`)}`);
      return;
    }
    if (user.role === 'tenant') {
      navigate(`/dashboard/tenant/messages?room=${room.id}`);
      return;
    }
    if (user.role === 'owner') {
      navigate('/dashboard/owner/messages');
      return;
    }
    setChatOpen(true);
  };

  const handleContact = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContactOpen(true);
  };

  return (
    <>
      <OwnerChatPanel room={room} open={chatOpen} onClose={() => setChatOpen(false)} />
      <ContactNowModal room={room} open={contactOpen} onClose={() => setContactOpen(false)} />

      <motion.article
        initial={{ opacity: 0, y: 40, rotateX: 8 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ delay: index * 0.06, duration: 0.55, type: 'spring', stiffness: 100 }}
        whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.25 } }}
        className="card-shine group overflow-hidden rounded-2xl bg-white shadow-md shadow-gray-200/60 ring-1 ring-gray-100 transition-shadow hover:shadow-2xl hover:shadow-brand-500/20 hover:ring-brand-200"
      >
        <Link to={`/rooms/${room.id}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={room.images[0]}
              alt={room.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {room.featured && (
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg"
              >
                Featured
              </motion.span>
            )}

            <div className="absolute right-3 top-3 flex gap-2">
              <button
                type="button"
                onClick={handleCompare}
                title={isInCompare(room.id) ? 'In compare list' : `Compare (max ${max})`}
                className={`flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur transition hover:scale-110 ${
                  isInCompare(room.id) ? 'bg-brand-500 text-white' : 'bg-white/90 text-gray-600 hover:text-brand-600'
                }`}
              >
                <Scale size={14} />
              </button>
              <button
                type="button"
                onClick={(e) => e.preventDefault()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-md backdrop-blur transition hover:scale-110 hover:text-pink-500"
              >
                <Heart size={16} />
              </button>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-end justify-between gap-2">
              <span className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-brand-600 backdrop-blur">
                {TYPE_LABELS[room.type] || room.type}
              </span>
              {room.verified && (
                <span className="flex items-center gap-1 rounded-lg bg-emerald-500/90 px-2 py-1 text-xs font-medium text-white backdrop-blur">
                  <ShieldCheck size={12} /> Verified
                </span>
              )}
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 font-semibold text-gray-900 group-hover:text-brand-600">{room.title}</h3>
              <div className="flex shrink-0 items-center gap-0.5 text-amber-500">
                <Star size={14} fill="currentColor" />
                <span className="text-xs font-semibold text-gray-700">{room.rating}</span>
              </div>
            </div>

            <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
              <MapPin size={14} className="shrink-0 text-brand-400" />
              {room.location}, {room.city}
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <div>
                <span className="text-xl font-bold text-gray-900">{formatPrice(room.price)}</span>
                <span className="text-sm text-gray-400"> /month</span>
              </div>
            </div>
          </div>
        </Link>

        <div className="flex gap-2 border-t border-gray-100 bg-gray-50/80 px-4 py-3">
          <button
            type="button"
            onClick={handleChat}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-brand-500 py-2 text-xs font-semibold text-white hover:bg-brand-600"
          >
            <MessageCircle size={13} /> Chat
          </button>
          <button
            type="button"
            onClick={handleContact}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-500 py-2 text-xs font-semibold text-white hover:bg-emerald-600"
          >
            <Phone size={13} /> Contact
          </button>
          {showPrevTenant && (
            <button
              type="button"
              onClick={handlePrevTenant}
              className="flex items-center justify-center rounded-lg border border-teal-200 bg-teal-50 px-2 py-2 text-teal-700 hover:bg-teal-100"
              title="WhatsApp previous tenant"
            >
              <UserCheck size={14} />
            </button>
          )}
        </div>
      </motion.article>
    </>
  );
}
