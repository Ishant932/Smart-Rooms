import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThreeDBackground from '../components/ThreeDBackground';

const SECTIONS = [
  { heading: 'Information We Collect', content: 'Name, email, phone number, college, preferred Jaipur area, role (tenant/owner), property preferences, and usage data when you browse listings or use wallet/games features.' },
  { heading: 'How We Use Your Data', content: 'To match tenants with owners, display your profile to relevant users, process wallet transactions, send booking notifications, and improve our Jaipur-focused marketplace.' },
  { heading: 'Data Sharing', content: 'We share contact details between matched tenants and owners for rental inquiries. We do not sell your personal information to third-party advertisers.' },
  { heading: 'Security', content: 'Passwords are encrypted. JWT tokens secure API access. We recommend strong passwords and not sharing login credentials.' },
  { heading: 'Cookies & Analytics', content: 'We use local storage for auth tokens and compare lists. Analytics help us understand popular areas and listing types in Jaipur.' },
  { heading: 'Your Rights', content: 'You may update your profile anytime from the dashboard. Contact hello@smartroooms.in to request account deletion.' },
  { heading: 'Children', content: 'SmartRoooms is intended for students aged 18+. Users under 18 should register with parental consent.' },
  { heading: 'Contact', content: 'SmartRoooms, Katewa Nagar, New Sanganer Road, Jaipur - 302020. Email: hello@smartroooms.in' },
];

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-gray-50 py-16">
      <ThreeDBackground variant="subtle" />
      <div className="relative mx-auto max-w-3xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white/95 p-8 shadow-xl ring-1 ring-gray-100 backdrop-blur">
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: May 31, 2026</p>
          <div className="mt-8 space-y-6">
            {SECTIONS.map((s, i) => (
              <section key={i}>
                <h2 className="text-lg font-bold text-brand-700">{s.heading}</h2>
                <p className="mt-2 leading-relaxed text-gray-600">{s.content}</p>
              </section>
            ))}
          </div>
          <Link to="/terms" className="mt-10 inline-block rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
            View Terms & Conditions
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
