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
      animate={{ boxShadow: ['0 0 0 0 rgba(99,102,241,0.4)', '0 0 0 12px rgba(99,102,241,0)', '0 0 0 0 rgba(99,102,241,0)'] }}
      transition={{ repeat: Infinity, duration: 2.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
