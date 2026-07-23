import { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';

import { MessageCircle, Phone } from 'lucide-react';

import DashboardLayout from '../../../components/DashboardLayout';

import ContactNowModal from '../../../components/ContactNowModal';

import { getRooms } from '../../../api/client';

import { formatPrice, TYPE_LABELS } from '../../../utils/helpers';



export default function TenantPGPage() {

  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);

  const [contactRoom, setContactRoom] = useState(null);



  useEffect(() => {

    Promise.all([

      getRooms({ type: 'pg-boys' }).then((d) => d.rooms),

      getRooms({ type: 'pg-girls' }).then((d) => d.rooms),

      getRooms({ type: 'hostel' }).then((d) => d.rooms),

    ]).then(([boys, girls, hostels]) => {

      setRooms([...boys, ...girls, ...hostels]);

    });

  }, []);



  const openChat = (room) => {

    navigate(`/dashboard/tenant/messages?room=${room.id}`);

  };



  return (

    <DashboardLayout role="tenant" title="PG & Hostel Listings">

      <ContactNowModal room={contactRoom} open={!!contactRoom} onClose={() => setContactRoom(null)} />



      <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-cyan-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-100">

        <strong>Zero commission</strong> — chat with owners or contact SmartRoooms anytime. All your chats are in{' '}

        <Link to="/dashboard/tenant/messages" className="font-semibold text-brand-600 hover:underline">

          Chat with Owners

        </Link>

        .

      </div>



      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {rooms.map((room, i) => (

          <motion.div

            key={room.id}

            initial={{ opacity: 0, y: 20 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ delay: i * 0.05 }}

            className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100"

          >

            <img src={room.images[0]} alt="" className="h-40 w-full object-cover" />

            <div className="p-4">

              <span className="text-xs font-semibold text-brand-600">{TYPE_LABELS[room.type]}</span>

              <h3 className="mt-1 line-clamp-2 font-semibold">{room.title}</h3>

              <p className="text-sm text-gray-500">{room.location}, {room.city}</p>

              <p className="mt-2 text-lg font-bold">{formatPrice(room.price)}/mo</p>

              <div className="mt-3 grid grid-cols-2 gap-2">

                <Link to={`/rooms/${room.id}`} className="col-span-2 rounded-xl border border-gray-200 py-2 text-center text-xs font-medium hover:bg-gray-50">

                  View Details

                </Link>

                <button type="button" onClick={() => openChat(room)} className="flex items-center justify-center gap-1 rounded-xl bg-brand-500 py-2 text-xs font-semibold text-white">

                  <MessageCircle size={12} /> Chat

                </button>

                <button type="button" onClick={() => setContactRoom(room)} className="flex items-center justify-center gap-1 rounded-xl bg-emerald-500 py-2 text-xs font-semibold text-white">

                  <Phone size={12} /> Contact

                </button>

              </div>

            </div>

          </motion.div>

        ))}

      </div>

    </DashboardLayout>

  );

}

