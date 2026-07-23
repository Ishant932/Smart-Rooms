import { motion } from 'framer-motion';
import { Copy, Gift, Users, IndianRupee } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';

export function ReferralsContent({ role = 'tenant' }) {
  const { wallet } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(wallet?.referralCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = `${window.location.origin}/signup?ref=${wallet?.referralCode}`;

  return (
    <DashboardLayout role={role} title="Refer & Earn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-8 text-white shadow-xl"
      >
        <Gift className="mb-4" size={40} />
        <h2 className="text-2xl font-bold">Refer friends & earn rewards</h2>
        <p className="mt-2 text-white/80">When someone registers with your code on SmartRoooms, you earn cash in your wallet plus bonus points.</p>
      </motion.div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Users, label: 'Share Code', desc: 'Send to friends' },
          { icon: IndianRupee, label: 'They Join', desc: 'Sign up on SmartRoooms' },
          { icon: Gift, label: 'You Earn', desc: 'Cash + bonus pts' },
        ].map(({ icon: Icon, label, desc }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-white p-5 text-center shadow-md ring-1 ring-gray-100">
            <Icon className="mx-auto text-brand-500" size={28} />
            <p className="mt-2 font-semibold">{label}</p>
            <p className="text-xs text-gray-500">{desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100">
        <p className="text-sm text-gray-500">Your Referral Code</p>
        <div className="mt-2 flex items-center gap-3">
          <code className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-2xl font-bold tracking-widest text-brand-600">{wallet?.referralCode}</code>
          <button onClick={copyCode} className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white">
            <Copy size={16} /> {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="mt-4 break-all text-xs text-gray-400">Share link: {shareLink}</p>
      </div>
    </DashboardLayout>
  );
}

export default function TenantReferralsPage() {
  return <ReferralsContent role="tenant" />;
}
