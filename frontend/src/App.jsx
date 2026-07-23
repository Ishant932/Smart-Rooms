import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CompareBar from './components/CompareBar';
import InfoTicker from './components/InfoTicker';
import SlideTopPanel from './components/SlideTopPanel';
import FloatingSiteButton from './components/FloatingSiteButton';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import PostRoomPage from './pages/PostRoomPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import PostRequirementPage from './pages/PostRequirementPage';
import ComparePage from './pages/ComparePage';
import PeopleNeedPage from './pages/PeopleNeedPage';
import HelpPage from './pages/HelpPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/dashboard/ProfilePage';

import TenantOverview from './pages/dashboard/tenant/TenantOverview';
import TenantWalletPage from './pages/dashboard/tenant/TenantWalletPage';
import TenantGamesPage from './pages/dashboard/tenant/TenantGamesPage';
import TenantPGPage from './pages/dashboard/tenant/TenantPGPage';
import TenantRoomPartnerPage from './pages/dashboard/tenant/TenantRoomPartnerPage';
import TenantReviewsPage from './pages/dashboard/tenant/TenantReviewsPage';
import TenantComplaintsPage from './pages/dashboard/tenant/TenantComplaintsPage';
import TenantReferralsPage from './pages/dashboard/tenant/TenantReferralsPage';
import TenantMessagesPage from './pages/dashboard/tenant/TenantMessagesPage';
import TenantServicesPage from './pages/dashboard/tenant/TenantServicesPage';
import FeedbackPage from './pages/dashboard/FeedbackPage';

import OwnerOverview from './pages/dashboard/owner/OwnerOverview';
import OwnerListingsPage from './pages/dashboard/owner/OwnerListingsPage';
import OwnerWalletPage from './pages/dashboard/owner/OwnerWalletPage';
import OwnerReviewsPage from './pages/dashboard/owner/OwnerReviewsPage';
import OwnerBookingsPage from './pages/dashboard/owner/OwnerBookingsPage';
import OwnerReferralsPage from './pages/dashboard/owner/OwnerReferralsPage';
import OwnerMessagesPage from './pages/dashboard/owner/OwnerMessagesPage';

import AdminOverview from './pages/dashboard/admin/AdminOverview';
import AdminUsersPage from './pages/dashboard/admin/AdminUsersPage';
import AdminComplaintsPage from './pages/dashboard/admin/AdminComplaintsPage';
import AdminTransactionsPage from './pages/dashboard/admin/AdminTransactionsPage';
import AdminRequirementsPage from './pages/dashboard/admin/AdminRequirementsPage';
import AdminBookingsPage from './pages/dashboard/admin/AdminBookingsPage';
import AdminListingsPage from './pages/dashboard/admin/AdminListingsPage';
import AdminFeedbackPage from './pages/dashboard/admin/AdminFeedbackPage';
import AdminServicesPage from './pages/dashboard/admin/AdminServicesPage';
import ServicesPage from './pages/ServicesPage';

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

          {/* Profile — all roles */}
          <Route path="/dashboard/tenant/profile" element={<ProtectedRoute roles={['tenant']}><ProfilePage role="tenant" /></ProtectedRoute>} />
          <Route path="/dashboard/owner/profile" element={<ProtectedRoute roles={['owner']}><ProfilePage role="owner" /></ProtectedRoute>} />
          <Route path="/dashboard/admin/profile" element={<ProtectedRoute roles={['admin']}><ProfilePage role="admin" /></ProtectedRoute>} />

          {/* Tenant Dashboard */}
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

          {/* Owner Dashboard */}
          <Route path="/dashboard/owner" element={<ProtectedRoute roles={['owner']}><OwnerOverview /></ProtectedRoute>} />
          <Route path="/dashboard/owner/listings" element={<ProtectedRoute roles={['owner']}><OwnerListingsPage /></ProtectedRoute>} />
          <Route path="/dashboard/owner/wallet" element={<ProtectedRoute roles={['owner']}><OwnerWalletPage /></ProtectedRoute>} />
          <Route path="/dashboard/owner/reviews" element={<ProtectedRoute roles={['owner']}><OwnerReviewsPage /></ProtectedRoute>} />
          <Route path="/dashboard/owner/bookings" element={<ProtectedRoute roles={['owner']}><OwnerBookingsPage /></ProtectedRoute>} />
          <Route path="/dashboard/owner/referrals" element={<ProtectedRoute roles={['owner']}><OwnerReferralsPage /></ProtectedRoute>} />
          <Route path="/dashboard/owner/messages" element={<ProtectedRoute roles={['owner']}><OwnerMessagesPage /></ProtectedRoute>} />
          <Route path="/dashboard/owner/feedback" element={<ProtectedRoute roles={['owner']}><FeedbackPage role="owner" /></ProtectedRoute>} />

          {/* Admin Dashboard */}
          <Route path="/dashboard/admin" element={<ProtectedRoute roles={['admin']}><AdminOverview /></ProtectedRoute>} />
          <Route path="/dashboard/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/dashboard/admin/listings" element={<ProtectedRoute roles={['admin']}><AdminListingsPage /></ProtectedRoute>} />
          <Route path="/dashboard/admin/requirements" element={<ProtectedRoute roles={['admin']}><AdminRequirementsPage /></ProtectedRoute>} />
          <Route path="/dashboard/admin/bookings" element={<ProtectedRoute roles={['admin']}><AdminBookingsPage /></ProtectedRoute>} />
          <Route path="/dashboard/admin/complaints" element={<ProtectedRoute roles={['admin']}><AdminComplaintsPage /></ProtectedRoute>} />
          <Route path="/dashboard/admin/transactions" element={<ProtectedRoute roles={['admin']}><AdminTransactionsPage /></ProtectedRoute>} />
          <Route path="/dashboard/admin/feedback" element={<ProtectedRoute roles={['admin']}><AdminFeedbackPage /></ProtectedRoute>} />
          <Route path="/dashboard/admin/services" element={<ProtectedRoute roles={['admin']}><AdminServicesPage /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isDashboard && <Footer />}
      {!isDashboard && <CompareBar />}
      {!isDashboard && (
        <FloatingSiteButton
          open={sitePanelOpen}
          onClick={() => setSitePanelOpen((v) => !v)}
        />
      )}
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
