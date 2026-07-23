import { motion } from 'framer-motion';
import { FileText, CheckCircle2, MapPinned } from 'lucide-react';
import { enrichListingDescription } from '../utils/helpers';

export default function ListingDescription({ room }) {
  const { paragraphs, highlights, nearby, summary } = enrichListingDescription(room);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <FileText size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Property Description</h2>
          <p className="mt-1 text-sm text-gray-500">Detailed overview of this listing in Jaipur</p>
        </div>
      </div>

      <p className="mt-6 text-base font-medium leading-relaxed text-gray-800">{summary}</p>

      <div className="mt-5 space-y-4">
        {paragraphs.slice(1).map((para, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="text-sm leading-relaxed text-gray-600 sm:text-base sm:leading-7"
          >
            {para}
          </motion.p>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-brand-50/60 p-5 ring-1 ring-brand-100">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand-700">
            <CheckCircle2 size={16} /> Property Highlights
          </h3>
          <ul className="mt-3 space-y-2">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-emerald-50/60 p-5 ring-1 ring-emerald-100">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-700">
            <MapPinned size={16} /> Location & Surroundings
          </h3>
          <ul className="mt-3 space-y-2">
            {nearby.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
