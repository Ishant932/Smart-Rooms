import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, MessageCircle, Shield, Loader2, ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getRoomChat, sendRoomChat } from '../api/client';
import ChatBubble from './chat/ChatBubble';

export default function OwnerChatPanel({ room, open, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const loginRedirect = `/login?redirect=${encodeURIComponent(`/dashboard/tenant/messages?room=${room?.id}`)}`;

  useEffect(() => {
    if (!open || !room?.id || !user) return;
    setLoading(true);
    getRoomChat(room.id)
      .then((data) => setMessages(data.messages || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [open, room?.id, user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    const outgoing = text.trim();
    setText('');
    try {
      const data = await sendRoomChat(room.id, outgoing);
      setMessages(data.messages || []);
    } catch {
      setText(outgoing);
    } finally {
      setSending(false);
    }
  };

  if (!room) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 z-[95] mx-auto flex max-h-[min(92vh,680px)] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-gradient-to-b from-slate-50 to-white shadow-2xl ring-1 ring-brand-100 sm:bottom-6 sm:left-auto sm:right-6 sm:rounded-3xl"
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-brand-600 via-cyan-600 to-violet-600 px-5 py-4 text-white">
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                style={{ background: 'linear-gradient(90deg, transparent, white, transparent)', width: '40%' }}
              />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-lg font-bold ring-1 ring-white/30">
                    {room.owner?.name?.[0] || 'O'}
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 font-bold">
                      <MessageCircle size={16} />
                      Chat with {room.owner?.name || 'Owner'}
                    </p>
                    <p className="text-xs text-white/80 line-clamp-1">{room.title}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-white/20 p-2 transition hover:bg-white/30"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!user ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <Shield className="text-brand-500" size={40} />
                <p className="mt-4 font-semibold text-gray-900">Login to chat with the owner</p>
                <p className="mt-2 text-sm text-gray-500">Sign in to ask about rent, visit timing & amenities.</p>
                <Link
                  to={loginRedirect}
                  onClick={onClose}
                  className="mt-6 rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg"
                >
                  Login to continue
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 border-b border-brand-100 bg-brand-50/80 px-4 py-2 text-xs text-brand-800">
                  <Link
                    to={`/dashboard/tenant/messages?room=${room.id}`}
                    onClick={onClose}
                    className="flex items-center gap-1 font-semibold hover:underline"
                  >
                    Open full messages <ExternalLink size={12} />
                  </Link>
                </div>

                <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-brand-50/40 to-white p-4">
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="animate-spin text-brand-500" size={32} />
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <ChatBubble key={msg.id} msg={msg} isOwn={msg.fromRole === 'tenant'} />
                    ))
                  )}

                </div>

                <form onSubmit={handleSend} className="border-t border-gray-100 bg-white p-4">
                  <div className="flex gap-2">
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Ask about rent, deposit, visit time…"
                      className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                    <motion.button
                      type="submit"
                      disabled={!text.trim() || sending}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg disabled:opacity-50"
                    >
                      {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </motion.button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
