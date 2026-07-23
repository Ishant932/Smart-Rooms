import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import ChatThreadPanel from '../../../components/chat/ChatThreadPanel';
import {
  getChatConversations,
  getChatThread,
  sendRoomChat,
  startChatThread,
} from '../../../api/client';
import { formatPrice } from '../../../utils/helpers';

export default function TenantMessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roomParam = searchParams.get('room');

  const [conversations, setConversations] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(roomParam || null);
  const [thread, setThread] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sendError, setSendError] = useState('');

  const loadConversations = useCallback(() => {
    setListLoading(true);
    return getChatConversations()
      .then((data) => setConversations(data.conversations || []))
      .catch((err) => {
        setError(err.response?.data?.error || 'Could not load conversations');
        setConversations([]);
      })
      .finally(() => setListLoading(false));
  }, []);

  const loadThread = useCallback(async (roomId, refreshList = true) => {
    if (!roomId) {
      setThread(null);
      return;
    }
    setThreadLoading(true);
    setError('');
    try {
      const data = await getChatThread(roomId);
      setThread(data);
    } catch (err) {
      try {
        const data = await startChatThread(roomId);
        setThread({ messages: data.messages || [], room: data.room, tenant: null });
      } catch (err2) {
        setThread(null);
        setError(err2.response?.data?.error || err.response?.data?.error || 'Could not open chat. Try again or browse listings.');
      }
    } finally {
      setThreadLoading(false);
      if (refreshList) await loadConversations();
    }
  }, [loadConversations]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  useEffect(() => {
    if (roomParam) setSelectedRoomId(roomParam);
  }, [roomParam]);

  useEffect(() => {
    loadThread(selectedRoomId);
  }, [selectedRoomId, loadThread]);

  useEffect(() => {
    if (!selectedRoomId) return undefined;
    const timer = setInterval(() => {
      getChatThread(selectedRoomId)
        .then((data) => setThread((prev) => ({ ...prev, messages: data.messages })))
        .catch(() => {});
      loadConversations();
    }, 8000);
    return () => clearInterval(timer);
  }, [selectedRoomId, loadConversations]);

  const selectConversation = (roomId) => {
    setSelectedRoomId(roomId);
    setSendError('');
    setSearchParams(roomId ? { room: roomId } : {}, { replace: true });
  };

  const handleSend = async (text) => {
    if (!selectedRoomId) return;
    setSending(true);
    setSendError('');
    try {
      const data = await sendRoomChat(selectedRoomId, text);
      setThread((prev) => ({ ...prev, messages: data.messages || [] }));
      await loadConversations();
    } catch (err) {
      setSendError(err.response?.data?.error || 'Failed to send message');
      throw err;
    } finally {
      setSending(false);
    }
  };

  const activeConv = conversations.find((c) => c.roomId === selectedRoomId);

  return (
    <DashboardLayout role="tenant" title="Chat with Owners">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-50 via-cyan-50 to-violet-50 p-4 text-sm text-brand-900 ring-1 ring-brand-100"
      >
        <motion.div
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-400/20 blur-2xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        <span className="relative">Message owners about rent, visits & amenities — zero commission. Chats auto-refresh every few seconds.</span>
      </motion.div>

      {error && !selectedRoomId && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={18} /> {error}
        </motion.div>
      )}

      <div className="grid gap-4 lg:grid-cols-[320px_1fr] lg:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <h2 className="font-bold text-gray-900">Your conversations</h2>
              <p className="text-xs text-gray-500">{conversations.length} active chat{conversations.length !== 1 ? 's' : ''}</p>
            </div>
            <motion.button
              type="button"
              whileTap={{ rotate: 180 }}
              onClick={loadConversations}
              className="rounded-lg p-2 text-brand-600 hover:bg-brand-50"
              aria-label="Refresh"
            >
              <RefreshCw size={16} />
            </motion.button>
          </div>

          <div className="max-h-[520px] overflow-y-auto">
            {listLoading ? (
              <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }} className="p-6 text-center text-sm text-gray-500">Loading…</motion.p>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center">
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <MessageCircle className="mx-auto text-gray-300" size={40} />
                </motion.div>
                <p className="mt-3 text-sm text-gray-500">No chats yet.</p>
                <Link to="/rooms" className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:underline">Browse listings →</Link>
              </div>
            ) : (
              conversations.map((conv, i) => (
                <motion.button
                  key={conv.roomId}
                  type="button"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ x: 4 }}
                  onClick={() => selectConversation(conv.roomId)}
                  className={`flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition ${
                    selectedRoomId === conv.roomId ? 'bg-brand-50 ring-1 ring-inset ring-brand-200' : 'hover:bg-brand-50/50'
                  }`}
                >
                  {conv.roomImage ? (
                    <img src={conv.roomImage} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover ring-2 ring-white" />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 font-bold text-brand-600">{conv.ownerName?.[0] || 'O'}</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900">{conv.ownerName}</p>
                    <p className="truncate text-xs text-gray-500">{conv.roomTitle}</p>
                    <p className="mt-1 truncate text-xs text-gray-400">{conv.lastMessage}</p>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="min-h-[480px]">
          <AnimatePresence mode="wait">
            {!selectedRoomId ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-md ring-1 ring-gray-100"
              >
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                  <MessageCircle className="text-brand-300" size={48} />
                </motion.div>
                <p className="mt-4 font-semibold text-gray-900">Select a conversation</p>
                <Link to="/rooms" className="mt-6 rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30">Browse rooms</Link>
              </motion.div>
            ) : (
              <motion.div key={selectedRoomId} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex h-full flex-col gap-3">
                {thread?.room && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm ring-1 ring-gray-100">
                    <span className="text-gray-600">{thread.room.title}{thread.room.price != null && ` · ${formatPrice(thread.room.price)}/mo`}</span>
                    <Link to={`/rooms/${selectedRoomId}`} className="flex items-center gap-1 font-medium text-brand-600 hover:underline">View listing <ExternalLink size={14} /></Link>
                  </div>
                )}
                {sendError && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{sendError}</p>}
                <ChatThreadPanel
                  messages={thread?.messages || []}
                  loading={threadLoading}
                  sending={sending}
                  onSend={handleSend}
                  ownRole="tenant"
                  headerTitle={activeConv?.ownerName || thread?.room?.owner?.name || 'Owner'}
                  headerSubtitle={activeConv?.roomTitle || thread?.room?.title}
                  headerAvatar={(activeConv?.ownerName || thread?.room?.owner?.name)?.[0] || 'O'}
                  animated
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
