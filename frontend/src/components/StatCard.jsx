import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon: Icon, color = 'brand', delay = 0 }) {
  const colors = {
    brand: 'from-brand-500 to-indigo-600',
    green: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    pink: 'from-pink-500 to-rose-600',
    purple: 'from-purple-500 to-violet-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, type: 'spring', stiffness: 120 }}
      whileHover={{ y: -6, scale: 1.03, rotateX: 0 }}
      className="dash-card premium-card glow-border relative overflow-hidden rounded-2xl p-5"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100"
        whileHover={{ opacity: 1 }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.15, type: 'spring' }}
            className="mt-1 text-2xl font-bold text-gray-900"
          >
            {value}
          </motion.p>
        </div>
        {Icon && (
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: delay * 2 }}
            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg`}
          >
            <Icon size={20} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
