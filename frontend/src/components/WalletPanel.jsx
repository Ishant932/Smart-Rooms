import { motion } from 'framer-motion';
import { Wallet, Star, Gift, RefreshCw } from 'lucide-react';
import { redeemPoints } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function WalletPanel({ walletData, onUpdate }) {
  const { setWallet } = useAuth();
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const wallet = walletData?.wallet || walletData;
  const rules = walletData?.rules || { pointsForDiscount: 500, discountAmount: 50, referralCash: 150, signupPoints: 80 };

  const handleRedeem = async () => {
    setLoading(true);
    setMsg('');
    try {
      const data = await redeemPoints();
      setWallet(data.wallet);
      onUpdate?.(data);
      setMsg(`Redeemed! ₹${data.discount} added to wallet for rent.`);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Redemption failed');
    } finally {
      setLoading(false);
    }
  };

  if (!wallet) return null;

  const progress = Math.min(100, (wallet.points / rules.pointsForDiscount) * 100);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl bg-gradient-to-br from-brand-600 to-purple-700 p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-2 text-white/80">
          <Wallet size={20} />
          <span className="text-sm font-medium">Wallet Balance</span>
        </div>
        <p className="mt-2 text-4xl font-bold">₹{wallet.balance}</p>
        <p className="mt-1 text-sm text-white/70">Use for paying rent directly</p>
        <div className="mt-4 rounded-xl bg-white/10 p-3 text-xs">
          <p>Referral bonus: ₹{rules.referralCash} when someone books via your code</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100"
      >
        <div className="flex items-center gap-2 text-gray-500">
          <Star size={20} className="text-amber-500" />
          <span className="text-sm font-medium">Reward Points</span>
        </div>
        <p className="mt-2 text-4xl font-bold text-gray-900">{wallet.points}</p>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress to ₹{rules.discountAmount} discount</span>
            <span>{wallet.points}/{rules.pointsForDiscount}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
            />
          </div>
        </div>
        <button
          onClick={handleRedeem}
          disabled={loading || wallet.points < rules.pointsForDiscount}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-40"
        >
          <Gift size={16} />
          Redeem {rules.pointsForDiscount} pts → ₹{rules.discountAmount}
        </button>
        {msg && <p className="mt-2 text-center text-xs text-emerald-600">{msg}</p>}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2 rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100"
      >
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <RefreshCw size={16} className="text-brand-500" /> Recent Activity
        </h3>
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {(walletData?.transactions || []).slice(0, 8).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
              <span className="text-gray-600">{tx.reason}</span>
              <span className={`font-semibold ${tx.type === 'spend' ? 'text-red-500' : 'text-emerald-600'}`}>
                {tx.amount > 0 ? `+₹${tx.amount}` : tx.pointsUsed ? `-${tx.pointsUsed} pts` : tx.amount}
                {tx.type === 'points' && tx.amount ? ` +${tx.amount} pts` : ''}
              </span>
            </div>
          ))}
          {(!walletData?.transactions || walletData.transactions.length === 0) && (
            <p className="text-center text-sm text-gray-400">No transactions yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
