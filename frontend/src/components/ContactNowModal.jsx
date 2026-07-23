import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Phone, MessageCircle, Copy, Check, Shield, Clock, Mail,
} from 'lucide-react';
import { getRoomContact } from '../api/client';
import { whatsappUrl } from '../utils/helpers';

export default function ContactNowModal({ room, open, onClose }) {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !room?.id) return;
    setLoading(true);
    getRoomContact(room.id)
      .then(setContact)
      .catch(() => setContact(null))
      .finally(() => setLoading(false));
  }, [open, room?.id]);

  const copyRef = async () => {
    if (!contact?.listingRef) return;
    await navigator.clipboard.writeText(contact.listingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-[95] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-brand-100"
          >
            <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 px-6 py-5 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-100">Contact Now</p>
                  <h3 className="mt-1 text-xl font-bold">SmartRoooms Helpline</h3>
                  <p className="mt-1 text-sm text-white/85">We connect you with {contact?.ownerName || 'the owner'}</p>
                </div>
                <button type="button" onClick={onClose} className="rounded-full bg-white/20 p-2 hover:bg-white/30">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="py-8 text-center text-sm text-gray-500">Loading contact details…</div>
              ) : contact ? (
                <div className="space-y-5">
                  <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
                    <p className="flex items-start gap-2 text-sm text-amber-900">
                      <Shield size={16} className="mt-0.5 shrink-0" />
                      {contact.note}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Call SmartRoooms</p>
                    <motion.a
                      href={`tel:${contact.tel}`}
                      whileHover={{ scale: 1.02 }}
                      className="mt-2 inline-flex items-center gap-2 text-3xl font-extrabold text-gray-900"
                    >
                      <Phone className="text-emerald-500" size={28} />
                      {contact.display}
                    </motion.a>
                    <p className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-500">
                      <Clock size={12} /> {contact.hours}
                    </p>
                  </div>

                  <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/50 p-4">
                    <p className="text-xs font-semibold text-brand-700">Quote this listing reference</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <code className="text-lg font-bold tracking-widest text-brand-900">{contact.listingRef}</code>
                      <button
                        type="button"
                        onClick={copyRef}
                        className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 ring-1 ring-brand-100 hover:bg-brand-50"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">{contact.roomTitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`tel:${contact.tel}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white"
                    >
                      <Phone size={16} /> Call Now
                    </a>
                    <a
                      href={whatsappUrl(contact.tel.replace('+', ''), contact.whatsappMessage)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-500 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </a>
                  </div>

                  <a href={`mailto:${contact.email}`} className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-brand-600">
                    <Mail size={14} /> {contact.email}
                  </a>
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-red-600">Could not load contact details.</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
