import { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext(null);
const STORAGE_KEY = 'sr_compare';
const MAX_COMPARE = 4;

export function CompareProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setItems(saved);
    } catch { /* ignore */ }
  }, []);

  const persist = (next) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addToCompare = (room) => {
    if (items.find((r) => r.id === room.id)) return { ok: false, message: 'Already in compare list' };
    if (items.length >= MAX_COMPARE) return { ok: false, message: `You can compare only ${MAX_COMPARE} properties` };
    persist([...items, room]);
    return { ok: true };
  };

  const removeFromCompare = (id) => persist(items.filter((r) => r.id !== id));
  const clearCompare = () => persist([]);
  const isInCompare = (id) => items.some((r) => r.id === id);

  return (
    <CompareContext.Provider value={{ items, addToCompare, removeFromCompare, clearCompare, isInCompare, max: MAX_COMPARE }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => useContext(CompareContext);
