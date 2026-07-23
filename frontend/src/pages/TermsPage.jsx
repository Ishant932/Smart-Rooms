import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThreeDBackground from '../components/ThreeDBackground';
import api from '../api/client';

export default function TermsPage() {
  const [terms, setTerms] = useState(null);

  useEffect(() => {
    api.get('/terms').then(({ data }) => setTerms(data)).catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 py-16">
      <ThreeDBackground variant="subtle" />
      <div className="relative mx-auto max-w-3xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white/95 p-8 shadow-xl ring-1 ring-gray-100 backdrop-blur">
          <h1 className="text-3xl font-bold text-gray-900">{terms?.title || 'Terms & Conditions'}</h1>
          {terms?.lastUpdated && <p className="mt-2 text-sm text-gray-500">Last updated: {terms.lastUpdated}</p>}
          <div className="mt-8 space-y-6">
            {(terms?.sections || []).map((s, i) => (
              <motion.section key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <h2 className="text-lg font-bold text-brand-700">{s.heading}</h2>
                <p className="mt-2 leading-relaxed text-gray-600">{s.content}</p>
              </motion.section>
            ))}
          </div>
          <div className="mt-10 flex gap-4">
            <Link to="/signup" className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white">Create Account</Link>
            <Link to="/privacy" className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Privacy Policy</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
