import { motion } from 'framer-motion';

export default function GameShell({
  title, emoji, subtitle, gradient, children, delay = 0, pointsHint,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ delay, type: 'spring', stiffness: 120, damping: 14 }}
      className={`game-card glow-border relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-2xl`}
    >
      <motion.div
        className="pointer-events-none absolute -right-8 -top-8 text-8xl opacity-20"
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 6 }}
      >
        {emoji}
      </motion.div>
      <div className="relative">
        <motion.h3
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: delay + 0.1 }}
          className="text-xl font-bold"
        >
          {emoji} {title}
        </motion.h3>
        <p className="mt-1 text-sm opacity-90">{subtitle}</p>
        {pointsHint && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring' }}
            className="mt-2 inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur"
          >
            {pointsHint}
          </motion.span>
        )}
        <div className="mt-4">{children}</div>
      </div>
    </motion.div>
  );
}
