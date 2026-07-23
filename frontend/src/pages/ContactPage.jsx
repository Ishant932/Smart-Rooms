import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import ThreeDBackground from '../components/ThreeDBackground';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="relative min-h-screen py-16">
      <ThreeDBackground variant="subtle" />
      <div className="relative mx-auto max-w-4xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white/95 p-8 shadow-xl ring-1 ring-gray-100 backdrop-blur">
            <h1 className="text-2xl font-bold">Contact Us</h1>
            <p className="mt-2 text-sm text-gray-500">We&apos;re here to help with listings, bookings, and partnerships.</p>
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-brand-500" size={18} />
                <span>Katewa Nagar, New Sanganer Road, Jaipur - 302020</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="shrink-0 text-brand-500" size={18} />
                <a href="mailto:hello@smartroooms.in" className="text-brand-600 hover:underline">hello@smartroooms.in</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="shrink-0 text-brand-500" size={18} />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white/95 p-8 shadow-xl ring-1 ring-gray-100 backdrop-blur">
            {sent ? (
              <div className="text-center py-8">
                <p className="text-4xl">✉️</p>
                <p className="mt-4 font-bold">Message sent!</p>
                <p className="mt-2 text-sm text-gray-500">We&apos;ll get back within 24 hours.</p>
                <Link to="/" className="mt-6 inline-block text-brand-600 hover:underline">Back to Home</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-bold">Send a message</h2>
                <input required placeholder="Your name" className="input-field" />
                <input required type="email" placeholder="Email" className="input-field" />
                <input placeholder="Phone" className="input-field" />
                <textarea required rows={4} placeholder="How can we help?" className="input-field resize-none" />
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 font-semibold text-white">
                  <Send size={18} /> Send Message
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
