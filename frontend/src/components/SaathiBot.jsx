import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, Sparkles, X, MessageCircle } from 'lucide-react';
import { askSaathi } from '../api/client';

const QUICK = [
  'How do I find a PG?',
  'Wallet & redeem points',
  'Play & Earn games',
  'Post a room as owner',
];

export default function SaathiBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hi, I am Saathi — your SmartRoooms guide. Ask about rooms, wallet, games, or listing a PG in Jaipur.',
    },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async (text) => {
    const q = String(text || input).trim();
    if (!q || busy) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setBusy(true);
    try {
      const data = await askSaathi(q);
      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text: data.reply,
          suggestions: data.suggestions,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: 'Saathi is offline for a moment. Try Help (/help) or Contact (/contact).' },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        aria-label="Open Saathi"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 via-violet-500 to-rose-500 text-white shadow-xl shadow-violet-500/40 md:bottom-6 md:right-6"
      >
        <Bot size={26} />
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-gray-900">
          AI
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="fixed bottom-24 right-4 z-[70] flex h-[min(70vh,520px)] w-[min(94vw,380px)] flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-cyan-600 via-violet-600 to-rose-500 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Sparkles size={18} />
                <div>
                  <p className="font-bold leading-tight">Saathi</p>
                  <p className="text-[11px] text-white/85">SmartRoooms AI guide</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-white/15" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
              {messages.map((m, i) => (
                <div key={`${i}-${m.role}`} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-brand-500 text-white'
                        : 'border border-brand-100 bg-gradient-to-br from-slate-50 to-cyan-50 text-gray-800'
                    }`}
                  >
                    {m.role === 'bot' && (
                      <span className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-600">
                        <MessageCircle size={10} /> Saathi
                      </span>
                    )}
                    {m.text}
                    {m.suggestions?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.suggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => send(s)}
                            className="rounded-full border border-brand-200 bg-white px-2 py-0.5 text-[11px] font-medium text-brand-700"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="border-t border-gray-100 px-3 py-2">
              <div className="mb-2 flex flex-wrap gap-1">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Saathi anything…"
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-xl bg-brand-500 px-3 text-white disabled:opacity-50"
                  aria-label="Send"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
