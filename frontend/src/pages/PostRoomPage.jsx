import { useEffect, useState } from 'react';

import { useNavigate, useParams, Link } from 'react-router-dom';

import { motion } from 'framer-motion';

import { CheckCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

import { getRoom, postRoom, updateRoom } from '../api/client';

import MediaUpload from '../components/MediaUpload';

import { FACILITY_OPTIONS, CITY, JAIPUR_LOCATIONS } from '../utils/helpers';



const AMENITIES_LIST = FACILITY_OPTIONS;



const emptyForm = {

  title: '',

  type: 'pg-boys',

  price: '',

  deposit: '',

  location: '',

  city: 'Jaipur',

  address: '',

  bedrooms: 1,

  bathrooms: 1,

  area: '',

  furnishing: 'Fully Furnished',

  gender: 'boys',

  availableFor: 'students',

  amenities: [],

  description: '',

  images: [],

  videos: [],

};



export default function PostRoomPage() {

  const { id: editId } = useParams();

  const isEdit = Boolean(editId);

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(isEdit);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState('');

  const [form, setForm] = useState(emptyForm);



  useEffect(() => {

    if (!editId) return;

    getRoom(editId)

      .then((room) => {

        setForm({

          title: room.title || '',

          type: room.type || 'pg-boys',

          price: String(room.price || ''),

          deposit: String(room.deposit || ''),

          location: room.location || '',

          city: room.city || 'Jaipur',

          address: room.address || '',

          bedrooms: room.bedrooms || 1,

          bathrooms: room.bathrooms || 1,

          area: String(room.area || ''),

          furnishing: room.furnishing || 'Fully Furnished',

          gender: room.gender || 'boys',

          availableFor: room.availableFor || 'students',

          amenities: room.amenities || [],

          description: room.description || '',

          images: room.images || [],

          videos: room.videos || [],

        });

      })

      .catch(() => setError('Could not load listing'))

      .finally(() => setPageLoading(false));

  }, [editId]);



  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));



  const toggleAmenity = (a) => {

    setForm((f) => ({

      ...f,

      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],

    }));

  };



  const handleMediaChange = ({ images, videos }) => {

    setForm((f) => ({ ...f, images, videos }));

  };



  const buildPayload = () => ({

    ...form,

    price: Number(form.price),

    deposit: Number(form.deposit),

    area: Number(form.area) || 0,

    bedrooms: Number(form.bedrooms),

    bathrooms: Number(form.bathrooms),

  });



  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError('');

    try {

      const payload = buildPayload();

      if (isEdit) {

        await updateRoom(editId, payload);

        navigate('/dashboard/owner/listings');

      } else {

        const room = await postRoom(payload);

        setSuccess(true);

        setTimeout(() => navigate(`/rooms/${room.id}`), 2000);

      }

    } catch (err) {

      setError(err.response?.data?.error || 'Failed to save listing.');

    } finally {

      setLoading(false);

    }

  };



  if (pageLoading) {

    return (

      <div className="flex min-h-[60vh] items-center justify-center">

        <Loader2 className="animate-spin text-brand-500" size={40} />

      </div>

    );

  }



  if (success) {

    return (

      <div className="flex min-h-[70vh] items-center justify-center px-4">

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">

          <CheckCircle className="mx-auto text-emerald-500" size={80} />

          <h2 className="mt-6 text-2xl font-bold text-gray-900">Room Posted Successfully!</h2>

          <p className="mt-2 text-gray-500">Redirecting to your listing...</p>

        </motion.div>

      </div>

    );

  }



  return (

    <div className="min-h-screen bg-gray-50 py-12">

      <div className="mx-auto max-w-2xl px-4">

        {isEdit && (

          <Link to="/dashboard/owner/listings" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600">

            <ArrowLeft size={16} /> Back to My Listings

          </Link>

        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">

          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">

            100% FREE · Zero Commission

          </span>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">{isEdit ? 'Edit Listing' : 'Post Your Room'}</h1>

          <p className="mt-2 text-gray-500">{isEdit ? 'Update details, location & media' : 'List your PG, flat or shared room in 2 easy steps'}</p>

        </motion.div>



        <div className="mx-auto mt-8 flex max-w-sm items-center justify-center gap-4">

          {[1, 2].map((s) => (

            <div key={s} className="flex items-center gap-2">

              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition ${step >= s ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>

              <span className={`text-sm font-medium ${step >= s ? 'text-brand-600' : 'text-gray-400'}`}>{s === 1 ? 'Details' : 'Photos & Media'}</span>

              {s === 1 && <div className={`h-0.5 w-12 ${step > 1 ? 'bg-brand-500' : 'bg-gray-200'}`} />}

            </div>

          ))}

        </div>



        <motion.form

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); setStep(2); }}

          className="mt-10 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-gray-100 sm:p-8"

        >

          {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}



          {step === 1 ? (

            <motion.div key="step1" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-5">

              <div>

                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Title *</label>

                <input required value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Premium Boys PG near MNIT" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">Type *</label>

                  <select value={form.type} onChange={(e) => update('type', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">

                    <option value="pg-boys">Boys PG</option>

                    <option value="pg-girls">Girls PG</option>

                    <option value="flat">Flat</option>

                    <option value="shared-room">Shared Room</option>

                    <option value="hostel">Hostel</option>

                  </select>

                </div>

                <div>

                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">City *</label>

                  <select value={form.city} onChange={(e) => update('city', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">

                    <option value={CITY}>{CITY}</option>

                  </select>

                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">Monthly Rent (₹) *</label>

                  <input required type="number" value={form.price} onChange={(e) => update('price', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />

                </div>

                <div>

                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">Deposit (₹) *</label>

                  <input required type="number" value={form.deposit} onChange={(e) => update('deposit', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />

                </div>

              </div>

              <div>

                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Area / Location *</label>

                <select required value={form.location} onChange={(e) => update('location', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">

                  <option value="">Select area in Jaipur</option>

                  {JAIPUR_LOCATIONS.map((loc) => (

                    <option key={loc} value={loc}>{loc}</option>

                  ))}

                </select>

                <p className="mt-1 text-xs text-gray-400">Map pin is set automatically from the selected area</p>

              </div>

              <div>

                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Full Address *</label>

                <input required value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Street, landmark, colony..." className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />

              </div>

              <div>

                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Description *</label>

                <textarea required minLength={20} rows={6} value={form.description} onChange={(e) => update('description', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm leading-relaxed" />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">Amenities</label>

                <div className="flex flex-wrap gap-2">

                  {AMENITIES_LIST.map((a) => (

                    <button key={a} type="button" onClick={() => toggleAmenity(a)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${form.amenities.includes(a) ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{a}</button>

                  ))}

                </div>

              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 font-semibold text-white">

                Continue <ArrowRight size={18} />

              </motion.button>

            </motion.div>

          ) : (

            <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-5">

              <MediaUpload images={form.images} videos={form.videos} onChange={handleMediaChange} />

              <div className="flex gap-3">

                <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-xl border border-gray-200 py-3 font-semibold text-gray-600">Back</button>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 py-3 font-semibold text-white disabled:opacity-50">

                  {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Post Room — FREE'}

                </motion.button>

              </div>

            </motion.div>

          )}

        </motion.form>

      </div>

    </div>

  );

}

