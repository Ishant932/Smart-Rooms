import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, X } from 'lucide-react';
import { useCompare } from '../context/CompareContext';

export default function CompareBar() {
  const { items, removeFromCompare, clearCompare, max } = useCompare();

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2"
    >
      <div className="flex items-center gap-3 rounded-2xl bg-gray-900/95 px-4 py-3 text-white shadow-2xl backdrop-blur-xl">
        <Scale size={20} className="shrink-0 text-brand-400" />
        <div className="flex flex-1 flex-wrap items-center gap-2 overflow-hidden">
          {items.map((r) => (
            <span key={r.id} className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs">
              <span className="max-w-[100px] truncate">{r.title}</span>
              <button onClick={() => removeFromCompare(r.id)} className="text-gray-400 hover:text-white"><X size={12} /></button>
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-400">{items.length}/{max}</span>
        <Link to="/compare" className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold hover:bg-brand-600">Compare</Link>
        <button onClick={clearCompare} className="text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
    </motion.div>
  );
}
