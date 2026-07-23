import { JAIPUR_LOCATIONS, FURNISHING_OPTIONS, AMENITY_FILTERS, BUDGET_RANGES } from '../utils/helpers';

export default function FilterControls({ filters, updateFilter, toggleAmenity }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Sort By</label>
        <select
          value={filters.sort || ''}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
        >
          <option value="">Relevance</option>
          <option value="price-asc">Rent: Low to High</option>
          <option value="price-desc">Rent: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Budget Quick Pick</label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'Under ₹5K', max: '5000' },
            { label: 'Under ₹8K', max: '8000' },
            { label: 'Under ₹12K', max: '12000' },
            { label: '₹8K+', min: '8000' },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => {
                updateFilter('minPrice', b.min || '');
                updateFilter('maxPrice', b.max || '');
              }}
              className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-brand-50 hover:text-brand-700"
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Jaipur Area</label>
        <select
          value={filters.location}
          onChange={(e) => updateFilter('location', e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="">All Areas in Jaipur</option>
          {JAIPUR_LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Property Type</label>
        <select
          value={filters.type}
          onChange={(e) => updateFilter('type', e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
        >
          <option value="">All Types</option>
          <option value="pg-boys">Boys PG</option>
          <option value="pg-girls">Girls PG</option>
          <option value="flat">Flat / Apartment</option>
          <option value="shared-room">Shared Room</option>
          <option value="hostel">Hostel</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">For</label>
        <select
          value={filters.gender}
          onChange={(e) => updateFilter('gender', e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
        >
          <option value="">Boys & Girls</option>
          <option value="boys">Boys Only</option>
          <option value="girls">Girls Only</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Min Rent</label>
          <select value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm">
            <option value="">Any</option>
            <option value="3000">₹3,000+</option>
            <option value="5000">₹5,000+</option>
            <option value="8000">₹8,000+</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Max Rent</label>
          <select value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm">
            <option value="">Any</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b.max} value={b.max}>{b.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Furnishing</label>
        <select value={filters.furnishing} onChange={(e) => updateFilter('furnishing', e.target.value)} className="w-full rounded-xl border px-3 py-2.5 text-sm">
          <option value="">Any</option>
          {FURNISHING_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Bedrooms</label>
        <select value={filters.bedrooms} onChange={(e) => updateFilter('bedrooms', e.target.value)} className="w-full rounded-xl border px-3 py-2.5 text-sm">
          <option value="">Any</option>
          <option value="1">1 Room</option>
          <option value="2">2 Rooms</option>
          <option value="3">3+ Rooms</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Min Rating</label>
        <select value={filters.minRating} onChange={(e) => updateFilter('minRating', e.target.value)} className="w-full rounded-xl border px-3 py-2.5 text-sm">
          <option value="">Any Rating</option>
          <option value="4.5">4.5+ ★</option>
          <option value="4">4+ ★</option>
          <option value="3.5">3.5+ ★</option>
        </select>
      </div>

      <div>
        <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <input
            type="checkbox"
            checked={filters.verified === 'true'}
            onChange={(e) => updateFilter('verified', e.target.checked ? 'true' : '')}
            className="rounded border-gray-300 text-brand-500"
          />
          Verified Only
        </label>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Must Have</label>
        <div className="flex flex-wrap gap-1.5">
          {AMENITY_FILTERS.slice(0, 8).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity?.(a)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                filters.amenity === a
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-brand-50'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
