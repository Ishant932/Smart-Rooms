import { motion } from 'framer-motion';

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 18 } },
};

export const slideIn = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export function StaggerGrid({ children, className = '' }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedItem({ children, className = '', index = 0 }) {
  return (
    <motion.div custom={index} variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

export function PulseGlow({ children, className = '' }) {
  return (
    <motion.div
      animate={{ boxShadow: ['0 0 0 0 rgba(6,182,212,0.4)', '0 0 0 12px rgba(6,182,212,0)', '0 0 0 0 rgba(6,182,212,0)'] }}
      transition={{ repeat: Infinity, duration: 2.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function TabMotion({ active, children, className = '' }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`relative ${className}`}
    >
      {active && (
        <motion.span
          layoutId="tab-pill"
          className="absolute inset-0 rounded-xl bg-brand-500 shadow-md shadow-brand-500/30"
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

export function RevealSection({ children, className = '', delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
