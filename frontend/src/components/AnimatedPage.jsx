import { motion } from 'framer-motion';

export const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function AnimatedPage({ children, className = '' }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[
        { size: 320, x: '85%', y: '5%', color: 'bg-brand-300/25', delay: 0 },
        { size: 260, x: '5%', y: '60%', color: 'bg-pink-300/20', delay: 1 },
        { size: 200, x: '50%', y: '80%', color: 'bg-purple-300/15', delay: 2 },
        { size: 140, x: '20%', y: '15%', color: 'bg-amber-300/20', delay: 0.5 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${orb.color}`}
          style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y }}
          animate={{
            y: [0, -20, 0, 15, 0],
            x: [0, 10, -8, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{ duration: 8 + i, repeat: Infinity, delay: orb.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export function PulseBadge({ children }) {
  return (
    <motion.span
      animate={{ boxShadow: ['0 0 0 0 rgba(99,102,241,0.4)', '0 0 0 8px rgba(99,102,241,0)', '0 0 0 0 rgba(99,102,241,0)'] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="inline-flex"
    >
      {children}
    </motion.span>
  );
}
