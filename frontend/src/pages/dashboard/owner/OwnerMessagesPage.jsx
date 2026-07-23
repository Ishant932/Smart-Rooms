import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import ChatThreadPanel from '../../../components/chat/ChatThreadPanel';
import { getChatConversations, getChatThread, sendOwnerChatReply } from '../../../api/client';

export default function OwnerMessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roomParam = searchParams.get('room');
  const tenantParam = searchParams.get('tenant');

  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(roomParam && tenantParam ? { roomId: roomParam, tenantId: tenantParam } : null);
  const [thread, setThread] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sendError, setSendError] = useState('');

  const threadKey = selected ? `${selected.roomId}:${selected.tenantId}` : null;

  const loadConversations = useCallback(() => {
    setListLoading(true);
    return getChatConversations()
      .then((data) => setConversations(data.conversations || []))
      .catch((err) => {
        setError(err.response?.data?.error || 'Could not load messages');
        setConversations([]);
      })
      .finally(() => setListLoading(false));
  }, []);

  const loadThread = useCallback(async (roomId, tenantId) => {
    if (!roomId || !tenantId) {
      setThread(null);
      return;
    }
    setThreadLoading(true);
    setError('');
    try {
      const data = await getChatThread(roomId, tenantId);
      setThread(data);
    } catch (err) {
      setThread(null);
      setError(err.response?.data?.error || 'Could not load conversation');
    } finally {
      setThreadLoading(false);
    }
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  useEffect(() => {
    if (roomParam && tenantParam) setSelected({ roomId: roomParam, tenantId: tenantParam });
  }, [roomParam, tenantParam]);

  useEffect(() => {
    if (selected) loadThread(selected.roomId, selected.tenantId);
    else setThread(null);
  }, [selected, loadThread]);

  useEffect(() => {
    if (!selected) return undefined;
    const timer = setInterval(() => {
      getChatThread(selected.roomId, selected.tenantId)
        .then((data) => setThread((prev) => ({ ...prev, messages: data.messages })))
        .catch(() => {});
      loadConversations();
    }, 8000);
    return () => clearInterval(timer);
  }, [selected, loadConversations]);

  const selectConversation = (conv) => {
    setSelected({ roomId: conv.roomId, tenantId: conv.tenantId });
    setSendError('');
    setSearchParams({ room: conv.roomId, tenant: conv.tenantId }, { replace: true });
  };

  const handleSend = async (text) => {
    if (!selected) return;
    setSending(true);
    setSendError('');
    try {
      const data = await sendOwnerChatReply(selected.roomId, selected.tenantId, text);
      setThread((prev) => ({ ...prev, messages: data.messages || [] }));
      await loadConversations();
    } catch (err) {
      setSendError(err.response?.data?.error || 'Failed to send reply');
      throw err;
    } finally {
      setSending(false);
    }
  };

  const activeConv = conversations.find((c) => c.roomId === selected?.roomId && c.tenantId === selected?.tenantId);

  return (
    <DashboardLayout role="owner" title="Chat with Tenants">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50 via-cyan-50 to-violet-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-100"
      >
        <motion.div className="pointer-events-none absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-emerald-400/20 blur-2xl" animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 3.5 }} />
        <span className="relative">Reply to tenant inquiries on your listings. Messages refresh automatically.</span>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr] lg:gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <h2 className="font-bold text-gray-900">Tenant messages</h2>
              <p className="text-xs text-gray-500">{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</p>
            </div>
            <motion.button type="button" whileTap={{ rotate: 180 }} onClick={loadConversations} className="rounded-lg p-2 text-brand-600 hover:bg-brand-50"><RefreshCw size={16} /></motion.button>
          </div>
          <div className="max-h-[520px] overflow-y-auto">
            {listLoading ? (
              <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }} className="p-6 text-center text-sm text-gray-500">Loading…</motion.p>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center">
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2 }}><MessageCircle className="mx-auto text-gray-300" size={40} /></motion.div>
                <p className="mt-3 text-sm text-gray-500">No tenant messages yet.</p>
                <Link to="/dashboard/owner/listings" className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:underline">My listings →</Link>
              </div>
            ) : (
              conversations.map((conv, i) => {
                const isActive = threadKey === `${conv.roomId}:${conv.tenantId}`;
                return (
                  <motion.button
                    key={`${conv.roomId}:${conv.tenantId}`}
                    type="button"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ x: 4 }}
                    onClick={() => selectConversation(conv)}
                    className={`flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition ${isActive ? 'bg-brand-50 ring-1 ring-inset ring-brand-200' : 'hover:bg-brand-50/50'}`}
                  >
                    <motion.div animate={conv.lastFromRole === 'tenant' ? { scale: [1, 1.08, 1] } : {}} transition={{ repeat: Infinity, duration: 2 }} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 font-bold text-violet-600">{conv.tenantName?.[0] || 'T'}</motion.div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-gray-900">{conv.tenantName}</p>
                      <p className="truncate text-xs text-gray-500">{conv.roomTitle}</p>
                      <p className="mt-1 truncate text-xs text-gray-400">{conv.lastMessage}</p>
                      {conv.lastFromRole === 'tenant' && <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Awaiting reply</span>}
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="min-h-[480px]">
          <AnimatePresence mode="wait">
            {!selected ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-md ring-1 ring-gray-100">
                <MessageCircle className="text-brand-300" size={48} />
                <p className="mt-4 font-semibold text-gray-900">Select a tenant chat</p>
                {error && <p className="mt-2 flex items-center gap-1 text-sm text-red-600"><AlertCircle size={14} /> {error}</p>}
              </motion.div>
            ) : (
              <motion.div key={threadKey} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex h-full flex-col gap-3">
                {thread?.room && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm ring-1 ring-gray-100">
                    <span className="text-gray-600">{thread.room.title}</span>
                    <Link to={`/rooms/${selected.roomId}`} className="flex items-center gap-1 font-medium text-brand-600 hover:underline">View listing <ExternalLink size={14} /></Link>
                  </div>
                )}
                {sendError && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{sendError}</p>}
                <ChatThreadPanel
                  messages={thread?.messages || []}
                  loading={threadLoading}
                  sending={sending}
                  onSend={handleSend}
                  ownRole="owner"
                  headerTitle={activeConv?.tenantName || thread?.tenant?.name || 'Tenant'}
                  headerSubtitle={activeConv?.roomTitle || thread?.room?.title}
                  headerAvatar={(activeConv?.tenantName || thread?.tenant?.name)?.[0] || 'T'}
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
