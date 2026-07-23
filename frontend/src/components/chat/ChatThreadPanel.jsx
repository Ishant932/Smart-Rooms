import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import ChatBubble from './ChatBubble';

export default function ChatThreadPanel({
  messages = [],
  loading = false,
  sending = false,
  onSend,
  ownRole = 'tenant',
  headerTitle,
  headerSubtitle,
  headerAvatar,
  emptyHint = 'Send a message to start the conversation.',
  animated = false,
}) {
  const [text, setText] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    const outgoing = text.trim();
    setText('');
    try {
      await onSend(outgoing);
    } catch {
      setText(outgoing);
    }
  };

  const Wrapper = animated ? motion.div : 'div';
  const wrapperProps = animated
    ? { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, className: 'flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100' }
    : { className: 'flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100' };

  return (
    <Wrapper {...wrapperProps}>
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-600 via-cyan-600 to-violet-600 px-5 py-4 text-white">
        {animated && (
          <motion.div
            className="absolute inset-0 opacity-25"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
            style={{ background: 'linear-gradient(90deg, transparent, white, transparent)', width: '45%' }}
          />
        )}
        <div className="relative flex items-center gap-3">
          <motion.div
            animate={animated ? { rotate: [0, 3, -3, 0] } : {}}
            transition={{ repeat: Infinity, duration: 6 }}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-lg font-bold ring-1 ring-white/30"
          >
            {headerAvatar || <MessageCircle size={20} />}
          </motion.div>
          <div className="min-w-0">
            <p className="truncate font-bold">{headerTitle}</p>
            {headerSubtitle && <p className="truncate text-xs text-white/80">{headerSubtitle}</p>}
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-brand-50/40 to-white p-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <Loader2 className="text-brand-500" size={32} />
            </motion.div>
          </div>
        ) : messages.length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center text-sm text-gray-500">{emptyHint}</motion.p>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <ChatBubble key={msg.id} msg={msg} isOwn={msg.fromRole === ownRole} />
            ))}
          </AnimatePresence>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-100 bg-white p-4">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message…"
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <motion.button
            type="submit"
            disabled={!text.trim() || sending}
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.92 }}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg disabled:opacity-50"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </motion.button>
        </div>
      </form>
    </Wrapper>
  );
}
