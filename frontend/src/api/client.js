import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

const token = localStorage.getItem('sr_token');
if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;

export const getRooms = (params) => api.get('/rooms', { params }).then((r) => r.data);
export const getRoom = (id) => api.get(`/rooms/${id}`).then((r) => r.data);
export const postRoom = (data) => api.post('/rooms', data).then((r) => r.data);
export const updateRoom = (id, data) => api.patch(`/rooms/${id}`, data).then((r) => r.data);
export const uploadMedia = (formData) => api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const updateRoomAvailability = (id, data) => api.patch(`/rooms/${id}/availability`, data).then((r) => r.data);
export const getRoomPastTenants = (id) => api.get(`/rooms/${id}/past-tenants`).then((r) => r.data);
export const getOwnerTenantDirectory = () => api.get('/owner/tenant-directory').then((r) => r.data);
export const getStats = () => api.get('/stats').then((r) => r.data);
export const getLocations = () => api.get('/locations').then((r) => r.data);
export const getCategories = () => api.get('/categories').then((r) => r.data);
export const postInquiry = (data) => api.post('/inquiries', data).then((r) => r.data);
export const getRoomContact = (id) => api.get(`/rooms/${id}/contact`).then((r) => r.data);
export const getRoomChat = (id) => api.get(`/rooms/${id}/chat`).then((r) => r.data);
export const sendRoomChat = (id, text) => api.post(`/rooms/${id}/chat`, { text }).then((r) => r.data);
export const getChatConversations = () => api.get('/chat/conversations').then((r) => r.data);
export const getChatThread = (roomId, tenantId) => api.get(`/chat/rooms/${roomId}`, { params: tenantId ? { tenantId } : {} }).then((r) => r.data);
export const startChatThread = (roomId) => api.post(`/chat/rooms/${roomId}/start`).then((r) => r.data);
export const sendOwnerChatReply = (roomId, tenantId, text) => api.post(`/chat/rooms/${roomId}/reply`, { tenantId, text }).then((r) => r.data);

export const getWallet = () => api.get('/wallet').then((r) => r.data);
export const redeemPoints = () => api.post('/wallet/redeem-points').then((r) => r.data);
export const payRentFromWallet = (data) => api.post('/wallet/pay-rent', data).then((r) => r.data);

export const playGame = (gameId, score) => api.post(`/games/${gameId}/play`, { score }).then((r) => r.data);
export const getLeaderboard = () => api.get('/games/leaderboard').then((r) => r.data);

export const getReviews = (params) => api.get('/reviews', { params }).then((r) => r.data);
export const postReview = (data) => api.post('/reviews', data).then((r) => r.data);

export const getComplaints = () => api.get('/complaints').then((r) => r.data);
export const postComplaint = (data) => api.post('/complaints', data).then((r) => r.data);
export const updateComplaint = (id, data) => api.patch(`/complaints/${id}`, data).then((r) => r.data);

export const getPartnerships = () => api.get('/partnerships').then((r) => r.data);
export const postPartnership = (data) => api.post('/partnerships', data).then((r) => r.data);

export const getRoomPartners = (params) => api.get('/room-partners', { params }).then((r) => r.data);
export const postRoomPartner = (data) => api.post('/room-partners', data).then((r) => r.data);

export const getBookings = () => api.get('/bookings').then((r) => r.data);
export const postBooking = (data) => api.post('/bookings', data).then((r) => r.data);

export const getAdminDashboard = () => api.get('/admin/dashboard').then((r) => r.data);
export const getAdminUsers = () => api.get('/admin/users').then((r) => r.data);
export const getAdminUserListings = (userId) => api.get(`/admin/users/${userId}/listings`).then((r) => r.data);
export const updateAdminUser = (id, data) => api.patch(`/admin/users/${id}`, data).then((r) => r.data);
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`).then((r) => r.data);
export const updateAdminWallet = (userId, data) => api.patch(`/admin/wallets/${userId}`, data).then((r) => r.data);
export const getAdminRooms = () => api.get('/admin/rooms').then((r) => r.data);
export const updateAdminRoom = (id, data) => api.patch(`/admin/rooms/${id}`, data).then((r) => r.data);
export const deleteAdminRoom = (id) => api.delete(`/admin/rooms/${id}`).then((r) => r.data);
export const getAdminBookings = () => api.get('/admin/bookings').then((r) => r.data);
export const updateAdminBooking = (id, data) => api.patch(`/admin/bookings/${id}`, data).then((r) => r.data);
export const deleteAdminBooking = (id) => api.delete(`/admin/bookings/${id}`).then((r) => r.data);
export const deleteAdminComplaint = (id) => api.delete(`/admin/complaints/${id}`).then((r) => r.data);
export const deleteAdminRequirement = (id) => api.delete(`/admin/requirements/${id}`).then((r) => r.data);
export const getAdminRequirements = () => api.get('/requirements').then((r) => r.data);
export const updateAdminRequirement = (id, data) => api.patch(`/admin/requirements/${id}`, data).then((r) => r.data);
export const updateAdminPartnership = (id, data) => api.patch(`/admin/partnerships/${id}`, data).then((r) => r.data);
export const getAdminInquiries = () => api.get('/admin/inquiries').then((r) => r.data);
export const updateProfile = (data) => api.patch('/auth/profile', data).then((r) => r.data);
export const getTerms = () => api.get('/terms').then((r) => r.data);
export const postRequirement = (data) => api.post('/requirements', data).then((r) => r.data);

export const getServicesCatalog = () => api.get('/services/catalog').then((r) => r.data);
export const getServiceBookings = () => api.get('/services/bookings').then((r) => r.data);
export const bookService = (data) => api.post('/services/book', data).then((r) => r.data);
export const getFeedback = () => api.get('/feedback').then((r) => r.data);
export const postFeedback = (data) => api.post('/feedback', data).then((r) => r.data);
export const getAdminFeedback = () => api.get('/admin/feedback').then((r) => r.data);
export const updateAdminFeedback = (id, data) => api.patch(`/admin/feedback/${id}`, data).then((r) => r.data);
export const getAdminServiceBookings = () => api.get('/admin/service-bookings').then((r) => r.data);
export const updateAdminServiceBooking = (id, data) => api.patch(`/admin/service-bookings/${id}`, data).then((r) => r.data);

export default api;
