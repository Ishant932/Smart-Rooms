import { motion } from 'framer-motion';
import {
  Wifi, Wind, UtensilsCrossed, Shirt, ShieldCheck, Car,
  Droplets, Zap, Dumbbell, BookOpen, Camera, Headphones,
} from 'lucide-react';
import SectionHeading from './SectionHeading';

const FACILITIES = [
  { icon: Wifi, title: 'High-Speed WiFi', desc: 'Filter listings with WiFi included — stay connected for classes & work.' },
  { icon: Wind, title: 'AC & Coolers', desc: 'Beat Jaipur heat with AC rooms, coolers & well-ventilated spaces.' },
  { icon: UtensilsCrossed, title: 'Meals & Tiffin', desc: 'PGs with breakfast, lunch & dinner — veg & non-veg options.' },
  { icon: Shirt, title: 'Laundry Service', desc: 'Washing machines & ironing in most verified hostels & PGs.' },
  { icon: ShieldCheck, title: '24×7 Security', desc: 'CCTV, guards & secure entry — especially in girls PG listings.' },
  { icon: Car, title: 'Parking', desc: 'Two-wheeler & car parking available in select Mansarovar & Sodala flats.' },
  { icon: Droplets, title: 'RO Water', desc: 'Clean drinking water & hot water geysers in premium listings.' },
  { icon: Zap, title: 'Power Backup', desc: 'Inverter & generator backup for uninterrupted study hours.' },
  { icon: Dumbbell, title: 'Gym & Sports', desc: 'Some hostels offer gym, cricket nets & indoor games.' },
  { icon: BookOpen, title: 'Study Room', desc: 'Quiet study zones perfect for MNIT, JECRC & Amity students.' },
  { icon: Camera, title: 'Verified Photos', desc: 'Real room photos only — what you see is what you get.' },
  { icon: Headphones, title: 'Tenant Support', desc: 'Complaints, admin help & previous-tenant WhatsApp connect.' },
];

export default function FacilitiesSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50/30 to-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          badge="Facilities"
          title="Everything You Need"
          highlight="Under One Roof"
          subtitle="Most listings include these amenities — filter on browse page or ask owners directly via WhatsApp"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {FACILITIES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/10"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white">
                <f.icon size={22} />
              </div>
              <h3 className="font-bold text-gray-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
