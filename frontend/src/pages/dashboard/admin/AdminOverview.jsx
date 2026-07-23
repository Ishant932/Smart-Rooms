import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';

import {

  Users, Building2, AlertCircle, Wallet, Home, FileText,

  BookOpen, Shield, ArrowRight, Gift, Wrench, MessageSquare,

} from 'lucide-react';

import { StaggerGrid, AnimatedItem } from '../../../components/animations';

import DashboardLayout from '../../../components/DashboardLayout';

import StatCard from '../../../components/StatCard';

import { getAdminDashboard } from '../../../api/client';



const QUICK_LINKS = [

  { to: '/dashboard/admin/analytics', label: 'Analytics', icon: Shield, color: 'bg-cyan-500' },

  { to: '/dashboard/admin/owners', label: 'Owners', icon: Building2, color: 'bg-violet-500' },

  { to: '/dashboard/admin/tenants', label: 'Tenants', icon: Users, color: 'bg-brand-500' },

  { to: '/dashboard/admin/vouchers', label: 'Vouchers', icon: Gift, color: 'bg-amber-500' },

  { to: '/dashboard/admin/listings', label: 'All Listings', icon: Home, color: 'bg-indigo-500' },

  { to: '/dashboard/admin/requirements', label: 'Requirements', icon: FileText, color: 'bg-emerald-500' },

  { to: '/dashboard/admin/complaints', label: 'Complaints', icon: AlertCircle, color: 'bg-red-500' },

  { to: '/dashboard/admin/services', label: 'Smart Services', icon: Wrench, color: 'bg-orange-500' },

  { to: '/dashboard/admin/feedback', label: 'Feedback', icon: MessageSquare, color: 'bg-pink-500' },

  { to: '/dashboard/admin/bookings', label: 'Bookings', icon: BookOpen, color: 'bg-amber-600' },

  { to: '/dashboard/admin/transactions', label: 'Activity', icon: Wallet, color: 'bg-purple-500' },

  { to: '/post', label: 'Post Room (Free)', icon: Building2, color: 'bg-teal-500' },

];



export default function AdminOverview() {

  const [data, setData] = useState(null);



  useEffect(() => { getAdminDashboard().then(setData).catch(() => {}); }, []);



  const s = data?.stats || {};



  return (

    <DashboardLayout role="admin" title="Admin Control Center">

      <motion.div

        initial={{ opacity: 0, y: -20, scale: 0.96 }}

        animate={{ opacity: 1, y: 0, scale: 1 }}

        className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-indigo-950 p-6 text-white shadow-xl"

      >

        <motion.div

          animate={{ opacity: [0.1, 0.25, 0.1] }}

          transition={{ repeat: Infinity, duration: 4 }}

          className="absolute inset-0 bg-gradient-to-r from-brand-500/20 via-purple-500/20 to-transparent"

        />

        <div className="relative flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 5 }}>

              <Shield size={28} className="text-brand-400" />

            </motion.div>

            <div>

              <h2 className="text-lg font-bold">Full Platform Access</h2>

              <p className="text-sm text-indigo-200">Edit & delete users, listings, bookings, complaints & more</p>

            </div>

          </div>

          <div className="flex flex-wrap gap-2">

            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-200 ring-1 ring-emerald-400/30">Zero commission</span>

            <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-200 ring-1 ring-cyan-400/30">FREE Property Post</span>

            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-200 ring-1 ring-amber-400/30">Zero Commission</span>

          </div>

        </div>

      </motion.div>



      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard label="Registered Users" value={s.totalUsers || 0} icon={Users} />

        <StatCard label="Tenants" value={s.tenants || 0} icon={Users} color="green" delay={0.05} />

        <StatCard label="Owners" value={s.owners || 0} icon={Building2} color="purple" delay={0.1} />

        <StatCard label="Listings" value={s.totalListings || 0} icon={Home} color="amber" delay={0.15} />

        <StatCard label="Open Complaints" value={s.openComplaints || 0} icon={AlertCircle} color="pink" delay={0.2} />

        <StatCard label="Open Requirements" value={s.openRequirements || 0} icon={FileText} color="green" delay={0.25} />

        <StatCard label="Active Bookings" value={s.activeBookings || 0} icon={BookOpen} color="amber" delay={0.3} />

        <StatCard label="Platform Points" value={s.totalPoints || 0} icon={Gift} color="purple" delay={0.35} />

      </div>



      <h3 className="mb-4 mt-8 font-bold text-gray-900">Quick Actions</h3>

      <StaggerGrid className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

        {QUICK_LINKS.map(({ to, label, icon: Icon, color }, i) => (

          <AnimatedItem key={to} index={i}>

            <Link to={to} className="dash-card glow-border group flex items-center gap-3 rounded-2xl bg-white p-4 shadow-md ring-1 ring-gray-100">

              <motion.div whileHover={{ scale: 1.15, rotate: 5 }} className={`flex h-10 w-10 items-center justify-center rounded-xl ${color} text-white`}>

                <Icon size={20} />

              </motion.div>

              <span className="flex-1 font-semibold text-gray-800">{label}</span>

              <ArrowRight size={16} className="text-gray-400 transition group-hover:translate-x-2 group-hover:text-brand-500" />

            </Link>

          </AnimatedItem>

        ))}

      </StaggerGrid>



      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl bg-white/90 p-6 shadow-md ring-1 ring-gray-100 backdrop-blur">

          <div className="flex items-center justify-between">

            <h3 className="font-bold">Recently Registered</h3>

            <Link to="/dashboard/admin/users" className="text-sm text-brand-600 hover:underline">View all</Link>

          </div>

          <div className="mt-4 space-y-3">

            {(data?.recentUsers || []).length === 0 ? (

              <p className="text-sm text-gray-500">No registered users yet.</p>

            ) : (

              data.recentUsers.map((u) => (

                <Link key={u.id} to="/dashboard/admin/users" className="flex items-center justify-between rounded-xl bg-gray-50 p-3 transition hover:bg-brand-50">

                  <div>

                    <p className="text-sm font-medium">{u.name}</p>

                    <p className="text-xs capitalize text-gray-500">{u.role} · {u.email}</p>

                  </div>

                  <span className={`text-xs font-semibold ${u.status === 'suspended' ? 'text-red-500' : 'text-emerald-600'}`}>

                    {u.status || 'active'}

                  </span>

                </Link>

              ))

            )}

          </div>

        </motion.div>



        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl bg-white/90 p-6 shadow-md ring-1 ring-gray-100 backdrop-blur">

          <div className="flex items-center justify-between">

            <h3 className="font-bold">Recent Complaints</h3>

            <Link to="/dashboard/admin/complaints" className="text-sm text-brand-600 hover:underline">Manage all</Link>

          </div>

          <div className="mt-4 space-y-3">

            {(data?.recentComplaints || []).length === 0 ? (

              <p className="text-sm text-gray-500">No tenant complaints yet.</p>

            ) : (

              data.recentComplaints.map((c) => (

                <Link key={c.id} to="/dashboard/admin/complaints" className="block rounded-xl bg-gray-50 p-3 transition hover:bg-red-50">

                  <p className="text-sm font-medium">{c.subject}</p>

                  <p className="text-xs text-gray-500">{c.tenantName} · {c.status}</p>

                </Link>

              ))

            )}

          </div>

        </motion.div>

      </div>

    </DashboardLayout>

  );

}


