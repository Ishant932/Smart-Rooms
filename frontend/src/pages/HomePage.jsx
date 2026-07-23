import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Heart, Building2, Share2, GraduationCap,
  Shield, BadgeCheck, ArrowRight, MapPin, Sparkles,
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import RoomCard from '../components/RoomCard';
import ThreeDBackground from '../components/ThreeDBackground';
import TestimonialMarquee, { TrustStrip } from '../components/TestimonialMarquee';
import AnimatedCounter from '../components/AnimatedCounter';
import SectionHeading from '../components/SectionHeading';
import FeaturesGrid from '../components/FeaturesGrid';
import FacilitiesSection from '../components/FacilitiesSection';
import SmartServicesHero from '../components/SmartServicesHero';
import AudienceSections from '../components/AudienceSections';
import { PulseBadge } from '../components/AnimatedPage';
import { getRooms, getStats, getLocations } from '../api/client';
import { CITY } from '../utils/helpers';

const categoryIcons = {
  'pg-boys': Users,
  'pg-girls': Heart,
  flat: Building2,
  'shared-room': Share2,
  hostel: GraduationCap,
};

const categories = [
  { id: 'pg-boys', label: 'Boys PG', desc: 'Safe hostels for boys', color: 'from-indigo-500 to-blue-600' },
  { id: 'pg-girls', label: 'Girls PG', desc: 'Secure girls hostels', color: 'from-pink-500 to-rose-600' },
  { id: 'flat', label: 'Flats', desc: '1-3 BHK apartments', color: 'from-violet-500 to-purple-600' },
  { id: 'shared-room', label: 'Shared Rooms', desc: 'Find room partners', color: 'from-teal-500 to-emerald-600' },
  { id: 'hostel', label: 'Hostels', desc: 'Student hostels', color: 'from-amber-500 to-orange-600' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getRooms({ featured: 'true', city: 'Jaipur' }),
      getStats(),
      getLocations(),
    ]).then(([roomsData, statsData, locData]) => {
      setFeatured(roomsData.rooms.slice(0, 6));
      setStats(statsData);
      setLocations(locData.slice(0, 8));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter overflow-hidden">
      {/* Hero with 3D background */}
      <section className="relative min-h-[90vh] overflow-hidden px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <ThreeDBackground variant="hero" />

        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <PulseBadge>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full glass-premium px-5 py-2.5 text-sm font-semibold text-brand-700"
              >
                <Sparkles size={16} className="text-amber-500" />
                Jaipur&apos;s #1 Student Room Platform
              </motion.div>
            </PulseBadge>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="mx-auto max-w-5xl text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
            >
              Find Your Dream{' '}
              <span className="gradient-text">Room in Jaipur</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 sm:text-xl"
            >
              Verified PGs, hostels & flats across Malviya Nagar, Mansarovar, Vaishali Nagar & more — chat with owners, zero brokerage, and earn reward points you can redeem for rent savings.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link to="/rooms" className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-700">
              Find a Room
            </Link>
            <Link to="/post" className="rounded-full border-2 border-brand-200 bg-white/80 px-6 py-3 text-sm font-semibold text-brand-700 backdrop-blur hover:bg-white">
              List Your Property
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 }}
            className="glow-border mx-auto mt-10 max-w-4xl rounded-3xl"
          >
            <SearchBar />
          </motion.div>

          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {[
                { label: 'Jaipur Listings', value: stats.totalRooms, suffix: '+', icon: Building2 },
                { label: 'Areas Covered', value: locations.length || 8, suffix: '+', icon: MapPin },
                { label: 'Verified', value: stats.verifiedListings, suffix: '', icon: Shield },
                { label: 'Avg Rating', value: stats.avgRating, suffix: '★', icon: BadgeCheck },
              ].map(({ label, value, suffix, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="premium-card rounded-2xl p-5 text-center"
                >
                  <Icon className="mx-auto mb-2 text-brand-500" size={22} />
                  <p className="text-2xl font-extrabold text-gray-900">
                    <AnimatedCounter value={value} suffix={suffix} />
                  </p>
                  <p className="text-xs font-medium text-gray-500">{label}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <TrustStrip />

      {/* Crazy spotlight — Saathi + Games + Zero brokerage */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 crazy-mesh" />
        <motion.div
          className="pointer-events-none absolute left-1/4 top-10 h-40 w-40 rounded-full bg-cyan-400/40 blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
        />
        <motion.div
          className="pointer-events-none absolute bottom-10 right-1/4 h-48 w-48 rounded-full bg-rose-400/35 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <div className="relative mx-auto max-w-7xl text-white">
          <SectionHeading
            dark
            badge="Next Level"
            title="This is where it gets"
            highlight="crazy"
            subtitle="Saathi AI answers your questions · 6 arcade games with tiny rewards · zero brokerage forever"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: 'Ask Saathi',
                desc: 'Floating AI guide trained on SmartRoooms — rooms, wallet, games, posting a PG.',
                cta: 'Open chat →',
                to: '/help',
                accent: 'from-cyan-400 to-blue-500',
              },
              {
                icon: Users,
                title: 'Play & Earn',
                desc: 'Six fully animated mini games. Low points (1–3) — stack slowly to ₹50 rent credit.',
                cta: 'Play now →',
                to: '/dashboard/tenant/games',
                accent: 'from-violet-400 to-fuchsia-500',
              },
              {
                icon: Shield,
                title: '₹0 Brokerage',
                desc: 'Chat owners directly. Compare listings. Filter like a pro across 12+ Jaipur areas.',
                cta: 'Browse rooms →',
                to: '/rooms',
                accent: 'from-rose-400 to-orange-500',
              },
            ].map(({ icon: Icon, title, desc, cta, to, accent }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, type: 'spring' }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl"
              >
                <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${accent} p-3 shadow-lg`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-extrabold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{desc}</p>
                <Link to={to} className="mt-5 inline-flex text-sm font-bold text-cyan-200 group-hover:text-white">
                  {cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SmartServicesHero />

      {/* Categories */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            badge="Categories"
            title="What are you"
            highlight="looking for?"
            subtitle="Browse by property type — all listings in Jaipur only"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((cat, i) => {
              const Icon = categoryIcons[cat.id];
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 40, rotateX: 15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, type: 'spring' }}
                  whileHover={{ y: -12, scale: 1.04, rotateY: 5 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Link
                    to={`/rooms?type=${cat.id}&city=${CITY}`}
                    className={`group relative flex flex-col items-center overflow-hidden rounded-3xl bg-gradient-to-br ${cat.color} p-7 text-white shadow-xl transition hover:shadow-2xl`}
                  >
                    <div className="absolute inset-0 bg-white/0 transition group-hover:bg-white/10" />
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur ring-1 ring-white/30"
                    >
                      <Icon size={30} />
                    </motion.div>
                    <h3 className="relative font-bold">{cat.label}</h3>
                    <p className="relative mt-1 text-center text-xs text-white/80">{cat.desc}</p>
                    <ArrowRight size={16} className="relative mt-3 translate-x-0 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <FeaturesGrid />

      <AudienceSections />

      <FacilitiesSection />

      {/* Popular Locations — bento grid */}
      <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8">
        <ThreeDBackground variant="subtle" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading badge="Localities" title="Popular Areas in" highlight="Jaipur" subtitle="Tap any area to browse student rooms nearby" />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(locations.length > 0 ? locations : [
              { slug: 'malviya-nagar', area: 'Malviya Nagar', count: 0 },
              { slug: 'mansarovar', area: 'Mansarovar', count: 0 },
              { slug: 'vaishali-nagar', area: 'Vaishali Nagar', count: 0 },
              { slug: 'sodala', area: 'Sodala', count: 0 },
              { slug: 'khatipura', area: 'Khatipura', count: 0 },
              { slug: 'jagatpura', area: 'Jagatpura', count: 0 },
              { slug: 'gopalpura', area: 'Gopalpura', count: 0 },
              { slug: 'vidhyadhar-nagar', area: 'Vidhyadhar Nagar', count: 0 },
            ]).map((loc, i) => (
              <motion.div
                key={loc.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className={i === 0 ? 'lg:col-span-2 lg:row-span-1' : ''}
              >
                <Link
                  to={`/rooms?city=Jaipur&location=${encodeURIComponent(loc.area || loc.name.split(',')[0])}`}
                  className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-brand-50/50 p-5 shadow-sm transition hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10"
                >
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-brand-600">
                      {loc.area || loc.name.split(',')[0]}
                    </h3>
                    <p className="text-sm text-gray-500">{loc.count ? `${loc.count} properties · ` : ''}Jaipur</p>
                  </div>
                  <motion.div whileHover={{ x: 4 }} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <ArrowRight size={18} />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-600">Featured</span>
              <h2 className="mt-3 text-3xl font-extrabold text-gray-900">Top Picks in <span className="gradient-text">Jaipur</span></h2>
            </div>
            <Link to="/rooms" className="hidden items-center gap-1 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-100 sm:flex">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                  className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-gray-200 to-gray-100"
                />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-12 text-center"
            >
              <p className="text-lg font-semibold text-gray-800">No listings yet</p>
              <p className="mt-2 text-sm text-gray-500">Owners can post rooms free — be the first in Jaipur!</p>
              <Link to="/signup" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg">
                Post as Owner <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((room, i) => (
                <RoomCard key={room.id} room={room} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-purple-700 to-indigo-900" />
        <div className="absolute inset-0 opacity-30">
          <ThreeDBackground variant="subtle" />
        </div>
        <div className="relative mx-auto max-w-7xl text-white">
          <SectionHeading badge="For Owners" title="List Your Room in" highlight="2 Steps" subtitle="Free forever. No brokerage. Reach thousands of Jaipur students." />
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up as owner in under a minute — welcome reward points included.' },
              { step: '02', title: 'Add Property', desc: 'Upload photos & videos, pick your Jaipur area, set rent — tenants find you instantly.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="glass-dark rounded-3xl p-8"
              >
                <span className="text-6xl font-black text-white/10">{item.step}</span>
                <h3 className="mt-2 text-2xl font-bold">{item.title}</h3>
                <p className="mt-2 text-white/70">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 font-bold text-brand-600 shadow-2xl transition hover:scale-105 hover:shadow-white/20"
            >
              Get Started — FREE <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonial marquee strip */}
      <TestimonialMarquee />

      {/* CTA */}
      <section className="mx-4 mb-20 sm:mx-6 lg:mx-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.01 }}
          className="glow-border mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gray-900 p-10 text-center sm:p-16"
        >
          <ThreeDBackground variant="subtle" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Looking for a room partner?</h2>
            <p className="mx-auto mt-4 max-w-lg text-gray-400">
              Split rent with verified students near MNIT, JECRC, Amity & more — only in Jaipur. Compare rooms side-by-side before you chat with owners.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/rooms?type=shared-room" className="rounded-full bg-brand-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/40 transition hover:bg-brand-400">
                Find Room Partners
              </Link>
              <Link to="/signup" className="rounded-full border border-white/20 px-8 py-3.5 font-semibold text-white transition hover:bg-white/10">
                Join SmartRoooms Free
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
