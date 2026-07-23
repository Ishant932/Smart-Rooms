import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CompareBar from './components/CompareBar';
import InfoTicker from './components/InfoTicker';
import SlideTopPanel from './components/SlideTopPanel';
import FloatingSiteButton from './components/FloatingSiteButton';
import SaathiBot from './components/SaathiBot';
import ProtectedRoute from './components/ProtectedRoute';

const HomePage = lazy(() => import('./pages/HomePage'));
const RoomsPage = lazy(() => import('./pages/RoomsPage'));
const RoomDetailPage = lazy(() => import('./pages/RoomDetailPage'));
const PostRoomPage = lazy(() => import('./pages/PostRoomPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const PostRequirementPage = lazy(() => import('./pages/PostRequirementPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const PeopleNeedPage = lazy(() => import('./pages/PeopleNeedPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage'));

const TenantOverview = lazy(() => import('./pages/dashboard/tenant/TenantOverview'));
const TenantWalletPage = lazy(() => import('./pages/dashboard/tenant/TenantWalletPage'));
const TenantGamesPage = lazy(() => import('./pages/dashboard/tenant/TenantGamesPage'));
const TenantPGPage = lazy(() => import('./pages/dashboard/tenant/TenantPGPage'));
const TenantRoomPartnerPage = lazy(() => import('./pages/dashboard/tenant/TenantRoomPartnerPage'));
const TenantReviewsPage = lazy(() => import('./pages/dashboard/tenant/TenantReviewsPage'));
const TenantComplaintsPage = lazy(() => import('./pages/dashboard/tenant/TenantComplaintsPage'));
const TenantReferralsPage = lazy(() => import('./pages/dashboard/tenant/TenantReferralsPage'));
const TenantMessagesPage = lazy(() => import('./pages/dashboard/tenant/TenantMessagesPage'));
const TenantServicesPage = lazy(() => import('./pages/dashboard/tenant/TenantServicesPage'));
const FeedbackPage = lazy(() => import('./pages/dashboard/FeedbackPage'));

const OwnerOverview = lazy(() => import('./pages/dashboard/owner/OwnerOverview'));
const OwnerListingsPage = lazy(() => import('./pages/dashboard/owner/OwnerListingsPage'));
const OwnerWalletPage = lazy(() => import('./pages/dashboard/owner/OwnerWalletPage'));
const OwnerReviewsPage = lazy(() => import('./pages/dashboard/owner/OwnerReviewsPage'));
const OwnerBookingsPage = lazy(() => import('./pages/dashboard/owner/OwnerBookingsPage'));
const OwnerReferralsPage = lazy(() => import('./pages/dashboard/owner/OwnerReferralsPage'));
const OwnerMessagesPage = lazy(() => import('./pages/dashboard/owner/OwnerMessagesPage'));

const AdminOverview = lazy(() => import('./pages/dashboard/admin/AdminOverview'));
const AdminUsersPage = lazy(() => import('./pages/dashboard/admin/AdminUsersPage'));
const AdminOwnersPage = lazy(() => import('./pages/dashboard/admin/AdminOwnersPage'));
const AdminTenantsPage = lazy(() => import('./pages/dashboard/admin/AdminTenantsPage'));
const AdminVouchersPage = lazy(() => import('./pages/dashboard/admin/AdminVouchersPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/dashboard/admin/AdminAnalyticsPage'));
const AdminComplaintsPage = lazy(() => import('./pages/dashboard/admin/AdminComplaintsPage'));
const AdminTransactionsPage = lazy(() => import('./pages/dashboard/admin/AdminTransactionsPage'));
const AdminRequirementsPage = lazy(() => import('./pages/dashboard/admin/AdminRequirementsPage'));
const AdminBookingsPage = lazy(() => import('./pages/dashboard/admin/AdminBookingsPage'));
const AdminListingsPage = lazy(() => import('./pages/dashboard/admin/AdminListingsPage'));
const AdminFeedbackPage = lazy(() => import('./pages/dashboard/admin/AdminFeedbackPage'));
const AdminServicesPage = lazy(() => import('./pages/dashboard/admin/AdminServicesPage'));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        className="h-10 w-10 rounded-full border-2 border-brand-200 border-t-brand-500"
      />
    </div>
  );
}

function AppShell() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const [sitePanelOpen, setSitePanelOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {!isDashboard && (
        <>
          <InfoTicker />
          <SlideTopPanel open={sitePanelOpen} onClose={() => setSitePanelOpen(false)} />
        </>
      )}
      {!isDashboard && <Header />}
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:id" element={<RoomDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ForgotPasswordPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/post-requirement" element={<PostRequirementPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/people-need" element={<PeopleNeedPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/post" element={<ProtectedRoute roles={['owner', 'admin']}><PostRoomPage /></ProtectedRoute>} />
              <Route path="/dashboard/owner/listings/:id/edit" element={<ProtectedRoute roles={['owner', 'admin']}><PostRoomPage /></ProtectedRoute>} />

              <Route path="/dashboard/tenant/profile" element={<ProtectedRoute roles={['tenant']}><ProfilePage role="tenant" /></ProtectedRoute>} />
              <Route path="/dashboard/owner/profile" element={<ProtectedRoute roles={['owner']}><ProfilePage role="owner" /></ProtectedRoute>} />
              <Route path="/dashboard/admin/profile" element={<ProtectedRoute roles={['admin']}><ProfilePage role="admin" /></ProtectedRoute>} />

              <Route path="/dashboard/tenant" element={<ProtectedRoute roles={['tenant']}><TenantOverview /></ProtectedRoute>} />
              <Route path="/dashboard/tenant/wallet" element={<ProtectedRoute roles={['tenant']}><TenantWalletPage /></ProtectedRoute>} />
              <Route path="/dashboard/tenant/games" element={<ProtectedRoute roles={['tenant']}><TenantGamesPage /></ProtectedRoute>} />
              <Route path="/dashboard/tenant/pg" element={<ProtectedRoute roles={['tenant']}><TenantPGPage /></ProtectedRoute>} />
              <Route path="/dashboard/tenant/room-partner" element={<ProtectedRoute roles={['tenant']}><TenantRoomPartnerPage /></ProtectedRoute>} />
              <Route path="/dashboard/tenant/reviews" element={<ProtectedRoute roles={['tenant']}><TenantReviewsPage /></ProtectedRoute>} />
              <Route path="/dashboard/tenant/complaints" element={<ProtectedRoute roles={['tenant']}><TenantComplaintsPage /></ProtectedRoute>} />
              <Route path="/dashboard/tenant/referrals" element={<ProtectedRoute roles={['tenant']}><TenantReferralsPage /></ProtectedRoute>} />
              <Route path="/dashboard/tenant/messages" element={<ProtectedRoute roles={['tenant']}><TenantMessagesPage /></ProtectedRoute>} />
              <Route path="/dashboard/tenant/services" element={<ProtectedRoute roles={['tenant']}><TenantServicesPage /></ProtectedRoute>} />
              <Route path="/dashboard/tenant/feedback" element={<ProtectedRoute roles={['tenant']}><FeedbackPage role="tenant" /></ProtectedRoute>} />

              <Route path="/dashboard/owner" element={<ProtectedRoute roles={['owner']}><OwnerOverview /></ProtectedRoute>} />
              <Route path="/dashboard/owner/listings" element={<ProtectedRoute roles={['owner']}><OwnerListingsPage /></ProtectedRoute>} />
              <Route path="/dashboard/owner/wallet" element={<ProtectedRoute roles={['owner']}><OwnerWalletPage /></ProtectedRoute>} />
              <Route path="/dashboard/owner/reviews" element={<ProtectedRoute roles={['owner']}><OwnerReviewsPage /></ProtectedRoute>} />
              <Route path="/dashboard/owner/bookings" element={<ProtectedRoute roles={['owner']}><OwnerBookingsPage /></ProtectedRoute>} />
              <Route path="/dashboard/owner/referrals" element={<ProtectedRoute roles={['owner']}><OwnerReferralsPage /></ProtectedRoute>} />
              <Route path="/dashboard/owner/messages" element={<ProtectedRoute roles={['owner']}><OwnerMessagesPage /></ProtectedRoute>} />
              <Route path="/dashboard/owner/feedback" element={<ProtectedRoute roles={['owner']}><FeedbackPage role="owner" /></ProtectedRoute>} />

              <Route path="/dashboard/admin" element={<ProtectedRoute roles={['admin']}><AdminOverview /></ProtectedRoute>} />
              <Route path="/dashboard/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
              <Route path="/dashboard/admin/owners" element={<ProtectedRoute roles={['admin']}><AdminOwnersPage /></ProtectedRoute>} />
              <Route path="/dashboard/admin/tenants" element={<ProtectedRoute roles={['admin']}><AdminTenantsPage /></ProtectedRoute>} />
              <Route path="/dashboard/admin/vouchers" element={<ProtectedRoute roles={['admin']}><AdminVouchersPage /></ProtectedRoute>} />
              <Route path="/dashboard/admin/analytics" element={<ProtectedRoute roles={['admin']}><AdminAnalyticsPage /></ProtectedRoute>} />
              <Route path="/dashboard/admin/listings" element={<ProtectedRoute roles={['admin']}><AdminListingsPage /></ProtectedRoute>} />
              <Route path="/dashboard/admin/requirements" element={<ProtectedRoute roles={['admin']}><AdminRequirementsPage /></ProtectedRoute>} />
              <Route path="/dashboard/admin/bookings" element={<ProtectedRoute roles={['admin']}><AdminBookingsPage /></ProtectedRoute>} />
              <Route path="/dashboard/admin/complaints" element={<ProtectedRoute roles={['admin']}><AdminComplaintsPage /></ProtectedRoute>} />
              <Route path="/dashboard/admin/transactions" element={<ProtectedRoute roles={['admin']}><AdminTransactionsPage /></ProtectedRoute>} />
              <Route path="/dashboard/admin/feedback" element={<ProtectedRoute roles={['admin']}><AdminFeedbackPage /></ProtectedRoute>} />
              <Route path="/dashboard/admin/services" element={<ProtectedRoute roles={['admin']}><AdminServicesPage /></ProtectedRoute>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      {!isDashboard && <Footer />}
      {!isDashboard && <CompareBar />}
      {!isDashboard && (
        <FloatingSiteButton
          open={sitePanelOpen}
          onClick={() => setSitePanelOpen((v) => !v)}
        />
      )}
      <SaathiBot />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </CompareProvider>
    </AuthProvider>
  );
}
