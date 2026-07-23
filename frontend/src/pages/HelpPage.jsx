import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThreeDBackground from '../components/ThreeDBackground';

const FAQ = [
  { q: 'How do I post a room?', a: 'Register as an owner, go to Dashboard → My Listings or use Post Room from the header. Add photos, price, and facilities.' },
  { q: 'Is there any brokerage?', a: 'No. SmartRoooms connects tenants and owners directly — zero brokerage policy.' },
  { q: 'How do wallet points work?', a: 'Earn 80 welcome points on signup, play 11 mini games, and refer friends. Redeem 500 points for ₹50 rent credit in your wallet.' },
  { q: 'Which areas are covered?', a: 'We focus exclusively on Jaipur — Malviya Nagar, Mansarovar, Vaishali Nagar, Sodala, and 20+ more areas.' },
  { q: 'How to find a room partner?', a: 'Go to People\'s Need → Room Partners or Dashboard → Room Partner to post your profile.' },
  { q: 'How to compare properties?', a: 'Click Compare on any listing (up to 4), then open the Compare page from the bottom bar.' },
];

export default function HelpPage() {
  return (
    <div className="relative min-h-screen py-16">
      <ThreeDBackground variant="subtle" />
      <div className="relative mx-auto max-w-3xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white/95 p-8 shadow-xl ring-1 ring-gray-100 backdrop-blur">
          <h1 className="text-3xl font-bold">Help & FAQ</h1>
          <p className="mt-2 text-gray-500">Everything you need to get started with SmartRoooms</p>
          <div className="mt-8 space-y-4">
            {FAQ.map(({ q, a }, i) => (
              <details key={i} className="group rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
                <summary className="cursor-pointer font-semibold text-gray-900">{q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/post-requirement" className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white">Post Requirement</Link>
            <Link to="/contact" className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Contact Us</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
