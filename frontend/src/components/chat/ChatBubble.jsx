import { motion } from 'framer-motion';

export default function ChatBubble({ msg, isOwn }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
          isOwn
            ? 'rounded-br-md bg-gradient-to-br from-brand-500 to-brand-600 text-white'
            : 'rounded-bl-md bg-white text-gray-800 ring-1 ring-gray-100'
        }`}
      >
        {!isOwn && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-brand-600">
            {msg.senderName || 'User'}
          </p>
        )}
        <p className="text-sm leading-relaxed">{msg.text}</p>
        <p className={`mt-1 text-[10px] ${isOwn ? 'text-white/70' : 'text-gray-400'}`}>
          {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}
