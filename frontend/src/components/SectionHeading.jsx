import { motion } from 'framer-motion';

export default function SectionHeading({ badge, title, highlight, subtitle, align = 'center', dark = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-12 ${align === 'center' ? 'text-center' : ''}`}
    >
      {badge && (
        <motion.span
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className={`inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] shadow-sm ${
            dark
              ? 'border border-white/20 bg-white/10 text-cyan-200'
              : 'border border-brand-200/80 bg-gradient-to-r from-brand-50 via-fuchsia-50 to-amber-50 text-brand-700'
          }`}
        >
          {badge}
        </motion.span>
      )}
      <h2
        className={`mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl ${
          dark ? 'text-white' : 'title-multicolor'
        }`}
      >
        {title}{' '}
        {highlight && (
          <span className={dark ? 'text-cyan-300' : 'gradient-text animate-gradient-x bg-[length:200%_auto]'}>
            {highlight}
          </span>
        )}
      </h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className={`mt-3 ${align === 'center' ? 'mx-auto max-w-xl' : 'max-w-xl'} ${dark ? 'text-white/70' : 'text-gray-500'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
