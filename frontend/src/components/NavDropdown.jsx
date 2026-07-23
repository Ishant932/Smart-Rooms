import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, LogOut } from 'lucide-react';

const panelVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.96, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 420, damping: 28, staggerChildren: 0.05 },
  },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
};

export function NavDropdownPanel({ menu, onClose, align = 'left' }) {
  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`nav-dropdown-panel absolute top-[calc(100%+8px)] z-50 w-[min(100vw-2rem,320px)] overflow-hidden rounded-2xl border border-white/80 bg-white/95 shadow-2xl shadow-brand-500/10 ring-1 ring-brand-100/80 backdrop-blur-xl ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      <div className={`bg-gradient-to-br ${menu.accent} px-5 py-4 text-white`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/30 backdrop-blur">
            <menu.icon size={20} />
          </div>
          <div>
            <p className="font-bold">{menu.label}</p>
            <p className="text-xs text-white/80">{menu.description}</p>
          </div>
        </div>
      </div>

      <div className="p-2">
        {menu.items.map((item) => (
          <motion.div key={item.to} variants={itemVariants}>
            <Link
              to={item.to}
              onClick={onClose}
              className="nav-dropdown-item group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-brand-50/80"
            >
              <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.color || menu.itemColor || 'from-brand-100 to-brand-50'} text-brand-600 transition group-hover:scale-110 group-hover:shadow-md`}>
                <item.icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-700">{item.label}</p>
                {item.desc && <p className="mt-0.5 text-xs leading-snug text-gray-500">{item.desc}</p>}
              </div>
              <ArrowRight size={14} className="mt-1 shrink-0 text-gray-300 opacity-0 transition group-hover:translate-x-0.5 group-hover:text-brand-500 group-hover:opacity-100" />
            </Link>
          </motion.div>
        ))}
      </div>

      {menu.footer && (
        <div className="border-t border-gray-100 bg-gray-50/80 px-4 py-3">
          {menu.footer.action ? (
            <button
              type="button"
              onClick={() => { menu.footer.action(); onClose(); }}
              className="flex w-full items-center justify-between text-xs font-semibold text-red-600 hover:text-red-700"
            >
              {menu.footer.label}
              <LogOut size={14} />
            </button>
          ) : (
            <Link
              to={menu.footer.to}
              onClick={onClose}
              className="flex items-center justify-between text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              {menu.footer.label}
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function NavDropdown({ menu, isOpen, onToggle, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => onToggle(menu.id, true)}
      onMouseLeave={() => onClose()}
    >
      <motion.button
        type="button"
        onClick={() => onToggle(menu.id, !isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`nav-dropdown-trigger flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-all ${
          isOpen
            ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
            : 'text-gray-700 hover:bg-brand-50 hover:text-brand-700'
        }`}
      >
        <menu.icon size={15} className={isOpen ? 'text-white' : 'text-brand-500'} />
        {menu.label}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={14} className={isOpen ? 'text-white/90' : 'text-gray-400'} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <NavDropdownPanel menu={menu} onClose={onClose} />
        )}
      </AnimatePresence>
    </div>
  );
}

export function MobileNavAccordion({ menu, isOpen, onToggle, onNavigate }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <motion.button
        type="button"
        onClick={() => onToggle(menu.id)}
        whileTap={{ scale: 0.99 }}
        className={`flex w-full items-center justify-between px-4 py-3.5 text-left transition ${
          isOpen ? 'bg-brand-50' : 'hover:bg-gray-50'
        }`}
      >
        <span className="flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${menu.accent} text-white`}>
            <menu.icon size={18} />
          </span>
          <span>
            <span className="block text-sm font-bold text-gray-900">{menu.label}</span>
            <span className="text-xs text-gray-500">{menu.description}</span>
          </span>
        </span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={18} className="text-brand-500" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-gray-100 bg-gradient-to-b from-brand-50/50 to-white"
          >
            <div className="space-y-0.5 p-2">
              {menu.items.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white"
                  >
                    <item.icon size={16} className="text-brand-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.label}</p>
                      {item.desc && <p className="text-xs text-gray-500">{item.desc}</p>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
