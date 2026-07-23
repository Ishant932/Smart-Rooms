import { motion } from 'framer-motion';
import { ChevronUp, Info, X } from 'lucide-react';

export default function FloatingSiteButton({ open, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed bottom-6 left-6 z-[65] flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-xl transition-colors ${
        open
          ? 'bg-gray-900 text-white shadow-gray-900/30'
          : 'bg-gradient-to-r from-brand-500 to-purple-600 text-white shadow-brand-500/40'
      }`}
      aria-label={open ? 'Close site info panel' : 'Open site info panel'}
      title={open ? 'Close info' : 'About SmartRoooms & locations'}
    >
      <motion.div
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {open ? <X size={20} /> : <Info size={20} />}
      </motion.div>
      <span className="hidden sm:inline">{open ? 'Close' : 'Site Info'}</span>
      {!open && (
        <motion.span
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronUp size={16} />
        </motion.span>
      )}
    </motion.button>
  );
}
