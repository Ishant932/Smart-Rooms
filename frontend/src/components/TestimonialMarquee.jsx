import { Star, Quote } from 'lucide-react';
import SectionHeading from './SectionHeading';

const TESTIMONIALS = [
  {
    name: 'Suresh Kumar',
    role: 'Property Owner · Sodala, Jaipur',
    photo: 'https://images.unsplash.com/photo-1595152772835-c660002565be?w=160&h=160&fit=crop&crop=face',
    text: 'I listed my 2 BHK on SmartRoooms and got a genuine tenant within 24 hours. No broker took a single rupee — honest and fast.',
  },
  {
    name: 'Priya Sharma',
    role: 'B.Tech Student · JECRC',
    photo: 'https://images.unsplash.com/photo-1601455763557-db1aca8a56a0?w=160&h=160&fit=crop&crop=face',
    text: 'Found a safe girls PG in Mansarovar in under 10 minutes. Redeemed game points for ₹50 rent credit on SmartRoooms — super easy!',
  },
  {
    name: 'Mukesh Choudhary',
    role: 'PG Owner · Vaishali Nagar',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=160&h=160&fit=crop&crop=face',
    text: 'Posted my PG for free and received 12 verified student enquiries in 2 days. Very transparent platform for Jaipur owners.',
  },
  {
    name: 'Ananya Gupta',
    role: 'MBA Student · Amity University',
    photo: 'https://images.unsplash.com/photo-1531123897722-8bb1310f7853?w=160&h=160&fit=crop&crop=face',
    text: 'Room partner feature helped me split rent with another Amity student near Tonk Road. Admin verified listing — felt completely safe.',
  },
  {
    name: 'Sunil Jain',
    role: 'Flat Owner · Malviya Nagar',
    photo: 'https://images.unsplash.com/photo-1599566150163-2fa96129a832?w=160&h=160&fit=crop&crop=face',
    text: 'Faster than any local broker in Jaipur. Direct WhatsApp to tenants — SmartRoooms understands how owners actually work.',
  },
  {
    name: 'Rahul Meena',
    role: 'Student · Poornima University',
    photo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=160&h=160&fit=crop&crop=face',
    text: 'Real photos, real prices, zero hidden charges. Compared 4 PGs side-by-side and booked the best one in Mansarovar.',
  },
  {
    name: 'Kavita Rathore',
    role: 'Working Professional · C-Scheme',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&h=160&fit=crop&crop=face',
    text: 'As a working woman, security mattered most. Girls PG with CCTV and verified owners gave me peace of mind from day one.',
  },
  {
    name: 'Vikram Singh',
    role: 'Hostel Owner · Jagatpura',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=face',
    text: 'My hostel stays full because students trust SmartRoooms over random Facebook posts. Referral system keeps tenants engaged.',
  },
  {
    name: 'Neha Agarwal',
    role: 'Student · MNIT Jaipur',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=face',
    text: 'Booked a shared room near MNIT campus with zero brokerage. Previous tenant WhatsApp connect helped me ask real questions.',
  },
  {
    name: 'Arjun Patel',
    role: 'Engineering Student · Manipal Jaipur',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face',
    text: 'Play & Earn games are fun! Stack points and redeem for rent savings. Best student platform I have used in Rajasthan.',
  },
];

function TestimonialStripCard({ t }) {
  const initial = (t.name || '?').charAt(0).toUpperCase();
  return (
    <div className="testimonial-strip-card mx-4 flex w-[min(90vw,420px)] shrink-0 items-start gap-4 rounded-2xl border border-white/80 bg-white/95 p-5 shadow-lg shadow-brand-500/10 ring-1 ring-brand-100/60 backdrop-blur-sm">
      <div className="relative shrink-0">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-violet-500 to-rose-500 text-xl font-black text-white ring-2 ring-brand-200 ring-offset-2">
          {initial}
        </div>
        <Quote size={14} className="absolute -bottom-1 -right-1 rounded-full bg-brand-500 p-0.5 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} fill="currentColor" />
          ))}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          &ldquo;{t.text}&rdquo;
        </p>
        <div className="mt-3 border-t border-gray-100 pt-2">
          <p className="text-sm font-bold text-gray-900">{t.name}</p>
          <p className="text-xs font-medium text-brand-600">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialMarquee() {
  const row = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/40 via-cyan-50/20 to-white" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Testimonials"
          title="Trusted by"
          highlight="Jaipur Students & Owners"
          subtitle="Real stories from tenants and owners across Pink City — scroll to read more"
        />
      </div>

      <div className="relative mt-4">
        <div className="marquee-mask">
          <div className="marquee-track marquee-left testimonial-strip flex items-stretch py-3">
            {row.map((t, i) => (
              <TestimonialStripCard key={`${t.name}-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustStrip() {
  const items = [
    '✓ Zero Brokerage Forever', '✓ Owner-Posted Listings', '✓ Smart Wallet & Rewards',
    '✓ 6 Play & Earn Games', '✓ Room Partner Matching', '✓ Ask Saathi AI',
    '✓ Jaipur Only — 12+ Areas', '✓ Boys & Girls PG', '✓ Previous Tenant Connect',
    '✓ Complaint Resolution', '✓ Refer & Earn', '✓ 500 pts = ₹50 Off Rent',
  ];
  const doubled = [...items, ...items];

  return (
    <div className="border-y border-brand-100/80 bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 py-3">
      <div className="marquee-track marquee-left trust-strip flex items-center text-sm font-semibold tracking-wide text-white">
        {doubled.map((item, i) => (
          <span key={i} className="mx-8 shrink-0 whitespace-nowrap opacity-90">{item}</span>
        ))}
      </div>
    </div>
  );
}
