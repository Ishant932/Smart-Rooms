import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Search, FileText, Handshake, ArrowRight } from 'lucide-react';
import ThreeDBackground from '../components/ThreeDBackground';

const CARDS = [
  {
    to: '/post-requirement',
    icon: FileText,
    title: 'Post Requirement',
    desc: 'Tell owners what you need — area, budget, move-in date. Get direct calls from verified landlords.',
    color: 'from-brand-500 to-indigo-600',
  },
  {
    to: '/login?redirect=/dashboard/tenant/room-partner',
    icon: Handshake,
    title: 'Room Partners',
    desc: 'Looking to share a room? Find compatible roommates in Jaipur — split rent, make friends.',
    color: 'from-purple-500 to-pink-600',
  },
  {
    to: '/rooms?type=shared-room',
    icon: Search,
    title: 'Room Seekers',
    desc: 'Browse shared rooms and PG options across Malviya Nagar, Mansarovar, Vaishali Nagar & more.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    to: '/signup',
    icon: Users,
    title: 'Join Community',
    desc: 'Register free — welcome points, referral rewards, and wallet rent credits on SmartRoooms.',
    color: 'from-amber-500 to-orange-600',
  },
];

export default function PeopleNeedPage() {
  return (
    <div className="relative min-h-screen py-16">
      <ThreeDBackground variant="subtle" />
      <div className="relative mx-auto max-w-5xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">People&apos;s Need</h1>
          <p className="mt-2 text-gray-500">Room seekers, room partners & requirements — Jaipur&apos;s student rental hub</p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {CARDS.map(({ to, icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={to} className="group block overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-100 transition hover:shadow-xl">
                <div className={`bg-gradient-to-r ${color} p-6 text-white`}>
                  <Icon size={32} />
                  <h2 className="mt-3 text-xl font-bold">{title}</h2>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-600">{desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-2 transition-all">
                    Explore <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
