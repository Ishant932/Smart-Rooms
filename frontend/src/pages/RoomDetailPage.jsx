import { useEffect, useState } from 'react';

import { useParams, Link, useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';

import {

  MapPin, Star, ShieldCheck, ArrowLeft, Heart,

  Bed, Bath, Maximize, Calendar, Check, Loader2, MessageCircle, Scale, UserCheck,

  Phone, Info,

} from 'lucide-react';

import { useCompare } from '../context/CompareContext';

import { useAuth } from '../context/AuthContext';

import { getRoom } from '../api/client';

import { formatPrice, TYPE_LABELS, AMENITY_ICONS, whatsappUrl, previousTenantWhatsAppMessage, isRoomAvailableWithTenant } from '../utils/helpers';

import ContactNowModal from '../components/ContactNowModal';

import ListingMap from '../components/ListingMap';

import ListingDescription from '../components/ListingDescription';



export default function RoomDetailPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [room, setRoom] = useState(null);

  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);

  const [contactOpen, setContactOpen] = useState(false);

  const { addToCompare, isInCompare } = useCompare();



  useEffect(() => {

    getRoom(id)

      .then(setRoom)

      .finally(() => setLoading(false));

  }, [id]);



  const openChat = () => {

    if (!user) {

      navigate(`/login?redirect=${encodeURIComponent(`/rooms/${id}`)}`);

      return;

    }

    if (user.role !== 'tenant') {

      alert('Only tenants can chat with owners. Please login as a tenant.');

      return;

    }

    navigate(`/dashboard/tenant/messages?room=${id}`);

  };



  if (loading) {

    return (

      <div className="flex min-h-[60vh] items-center justify-center">

        <Loader2 className="animate-spin text-brand-500" size={48} />

      </div>

    );

  }



  if (!room) {

    return (

      <div className="py-20 text-center">

        <p className="text-6xl">😕</p>

        <h2 className="mt-4 text-2xl font-bold">Room not found</h2>

        <Link to="/rooms" className="mt-4 inline-block text-brand-500 hover:underline">

          Back to listings

        </Link>

      </div>

    );

  }



  const showPreviousTenant = isRoomAvailableWithTenant(room);

  const prevTenantWa = showPreviousTenant

    ? whatsappUrl(room.lastTenant.phone, previousTenantWhatsAppMessage(room.title, room.location))

    : null;



  return (

    <div className="min-h-screen bg-gray-50 pb-16">

      <ContactNowModal room={room} open={contactOpen} onClose={() => setContactOpen(false)} />



      <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">

        <div className="mx-auto flex max-w-7xl items-center gap-4">

          <Link to="/rooms" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-500">

            <ArrowLeft size={16} /> Back

          </Link>

        </div>

      </div>



      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-100"

        >

          <div className="relative aspect-[16/9] max-h-[480px] overflow-hidden sm:aspect-[21/9]">

            <motion.img

              key={activeImage}

              initial={{ opacity: 0 }}

              animate={{ opacity: 1 }}

              src={room.images[activeImage]}

              alt={room.title}

              className="h-full w-full object-cover"

            />

            {room.featured && (

              <span className="absolute left-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">

                Featured

              </span>

            )}

            <button type="button" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-md hover:text-pink-500">

              <Heart size={20} />

            </button>

          </div>

          {room.images.length > 1 && (

            <div className="flex gap-2 overflow-x-auto p-4">

              {room.images.map((img, i) => (

                <button

                  key={i}

                  type="button"

                  onClick={() => setActiveImage(i)}

                  className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl ring-2 transition ${

                    activeImage === i ? 'ring-brand-500' : 'ring-transparent'

                  }`}

                >

                  <img src={img} alt="" className="h-full w-full object-cover" />

                </button>

              ))}

            </div>

          )}

        </motion.div>



        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          <div className="lg:col-span-2">

            <motion.div

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ delay: 0.1 }}

            >

              <div className="flex flex-wrap items-start gap-3">

                <span className="rounded-lg bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-600">

                  {TYPE_LABELS[room.type]}

                </span>

                <button

                  type="button"

                  onClick={() => {

                    const r = addToCompare(room);

                    if (!r.ok) alert(r.message);

                  }}

                  className={`flex items-center gap-1 rounded-lg px-3 py-1 text-sm font-semibold ${

                    isInCompare(room.id) ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-brand-50'

                  }`}

                >

                  <Scale size={14} /> {isInCompare(room.id) ? 'In Compare' : 'Compare'}

                </button>

                {room.verified && (

                  <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">

                    <ShieldCheck size={14} /> Verified

                  </span>

                )}

                <span className="flex items-center gap-1 text-amber-500">

                  <Star size={16} fill="currentColor" />

                  <span className="font-semibold text-gray-700">{room.rating}</span>

                  <span className="text-sm text-gray-400">({room.reviews} reviews)</span>

                </span>

              </div>



              <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">{room.title}</h1>



              <p className="mt-2 flex items-center gap-2 text-gray-500">

                <MapPin size={18} className="text-brand-400" />

                {room.address}

              </p>



              <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900 ring-1 ring-emerald-100">

                <Info size={18} className="mt-0.5 shrink-0" />

                <span>

                  <strong>Zero commission</strong> — chat with the owner or contact SmartRoooms to connect before you visit.

                </span>

              </div>



              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">

                {[

                  { icon: Bed, label: `${room.bedrooms} Room${room.bedrooms > 1 ? 's' : ''}` },

                  { icon: Bath, label: `${room.bathrooms} Bath` },

                  { icon: Maximize, label: `${room.area} sqft` },

                  { icon: Calendar, label: room.furnishing },

                ].map(({ icon: Icon, label }) => (

                  <div key={label} className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-100">

                    <Icon className="mx-auto text-brand-500" size={22} />

                    <p className="mt-2 text-sm font-medium text-gray-700">{label}</p>

                  </div>

                ))}

              </div>



              <ListingDescription room={room} />



              <div className="mt-6">

                <ListingMap room={room} />

              </div>



              <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">

                <h2 className="text-lg font-bold text-gray-900">Amenities</h2>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">

                  {room.amenities.map((a) => (

                    <div key={a} className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5">

                      <span>{AMENITY_ICONS[a] || '✓'}</span>

                      <span className="text-sm font-medium text-gray-700">{a}</span>

                      <Check size={14} className="ml-auto text-emerald-500" />

                    </div>

                  ))}

                </div>

              </div>

            </motion.div>

          </div>



          <div className="lg:col-span-1">

            <motion.div

              initial={{ opacity: 0, x: 20 }}

              animate={{ opacity: 1, x: 0 }}

              transition={{ delay: 0.2 }}

              className="sticky top-24 space-y-6"

            >

              <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100">

                <div className="flex items-baseline gap-1">

                  <span className="text-3xl font-bold text-gray-900">{formatPrice(room.price)}</span>

                  <span className="text-gray-400">/month</span>

                </div>

                <p className="mt-1 text-sm text-gray-500">

                  Security deposit: {formatPrice(room.deposit)}

                </p>



                <div className="mt-6 space-y-3">

                  <motion.button

                    type="button"

                    whileHover={{ scale: 1.02 }}

                    whileTap={{ scale: 0.98 }}

                    onClick={openChat}

                    className="flex w-full flex-col items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-brand-500 to-violet-600 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30"

                  >

                    <span className="flex items-center gap-2">

                      <MessageCircle size={18} />

                      Chat with Owner

                    </span>

                    <span className="text-xs font-normal opacity-90">Open your messages — ask about visit, rent & amenities</span>

                  </motion.button>



                  <motion.button

                    type="button"

                    whileHover={{ scale: 1.02 }}

                    whileTap={{ scale: 0.98 }}

                    onClick={() => setContactOpen(true)}

                    className="flex w-full flex-col items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/30"

                  >

                    <span className="flex items-center gap-2">

                      <Phone size={18} />

                      Contact Now

                    </span>

                    <span className="text-xs font-normal opacity-90">SmartRoooms helpline · owner connect</span>

                  </motion.button>



                  {showPreviousTenant && (

                    <a

                      href={prevTenantWa}

                      target="_blank"

                      rel="noreferrer"

                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-teal-200 bg-teal-50 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-100"

                    >

                      <UserCheck size={16} />

                      WhatsApp Previous Tenant

                    </a>

                  )}

                </div>



                {showPreviousTenant && (

                  <div className="mt-4 rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-100">

                    <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">

                      <UserCheck size={16} /> Room is available — talk to the last tenant

                    </p>

                    <p className="mt-1 text-xs text-emerald-700">

                      {room.lastTenant.name} stayed here recently. Chat on WhatsApp for honest feedback.

                    </p>

                  </div>

                )}



                <div className="mt-6 border-t border-gray-100 pt-4">

                  <p className="text-sm font-semibold text-gray-900">Listed by</p>

                  <div className="mt-2 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-600">

                      {room.owner.name[0]}

                    </div>

                    <div>

                      <p className="font-medium text-gray-900">{room.owner.name}</p>

                      {room.owner.verified && (

                        <p className="flex items-center gap-1 text-xs text-emerald-600">

                          <ShieldCheck size={12} /> Verified Owner

                        </p>

                      )}

                      <p className="mt-1 text-xs text-gray-400">Owner phone shared via SmartRoooms only</p>

                    </div>

                  </div>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </div>

    </div>

  );

}

