import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Building2, TrendingUp, IndianRupee,
  ArrowRight, Sparkles, SlidersHorizontal, X, ChevronDown, ChevronUp
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import type { PropertyListItem, PropertyFilters } from '../types';
import { PROPERTY_TYPES, FURNISHING_TYPES, INDIA_STATES } from '../types';
import api from '../lib/api';

const POPULAR = ['Goa', 'Mumbai', 'Bangalore', 'Manali', 'Udaipur', 'Coorg', 'Rishikesh', 'Ooty'];

export default function HomePage() {
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchProperties = useCallback(async (f: PropertyFilters, s: number, append = false) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { skip: s, limit: 20 };
      if (f.state) params.state = f.state;
      if (f.city) params.city = f.city;
      if (f.property_type) params.property_type = f.property_type;
      if (f.price_min) params.price_min = f.price_min;
      if (f.price_max) params.price_max = f.price_max;
      if (f.revenue_min) params.revenue_min = f.revenue_min;
      if (f.roi_min) params.roi_min = f.roi_min;
      if (f.furnishing_type) params.furnishing_type = f.furnishing_type;
      const res = await api.get('/api/properties/', { params });
      setProperties(prev => append ? [...prev, ...res.data.properties] : res.data.properties);
      setTotal(res.data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSkip(0);
    fetchProperties(filters, 0);
  }, [filters, fetchProperties]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) setFilters(f => ({ ...f, city: search.trim() }));
  };

  const setFilter = (key: keyof PropertyFilters, val: string | number | undefined) => {
    setFilters(f => ({ ...f, [key]: val === '' ? undefined : val }));
  };

  const activeCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  return (
    <div className="pt-16">
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #FF385C 0%, transparent 70%)' }} />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #FF6B81 0%, transparent 70%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full px-4 py-2 mb-6 border border-white/20"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-white/80 text-sm font-medium">India's #1 Airbnb Resale Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
            Buy & Sell{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FF385C, #FF6B81)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Airbnb
            </span>
            {' '}Properties
          </h1>
          <p className="text-white/50 text-lg sm:text-xl mb-10 max-w-xl mx-auto font-light">
            Discover profitable short-term rental businesses across India
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="flex items-center bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex items-center flex-1 px-3">
                <MapPin size={18} className="text-gray-300 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by city, state or area..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 text-gray-800 bg-transparent text-sm font-medium placeholder-gray-300 focus:outline-none py-2"
                />
                {search && (
                  <button type="button" onClick={() => { setSearch(''); setFilters(f => ({ ...f, city: undefined })); }}>
                    <X size={16} className="text-gray-300 hover:text-gray-500" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="flex items-center space-x-2 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}
              >
                <Search size={16} />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Popular cities */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-white/30 text-xs font-medium">Popular:</span>
            {POPULAR.map(city => (
              <button
                key={city}
                onClick={() => { setSearch(city); setFilters(f => ({ ...f, city })); }}
                className="text-white/60 hover:text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/15 hover:border-white/40 hover:bg-white/10 transition-all"
              >
                {city}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-12">
            {[
              { icon: Building2, label: 'Listed', value: total > 0 ? `${total}+` : '0' },
              { icon: TrendingUp, label: 'Avg ROI', value: '12-18%' },
              { icon: IndianRupee, label: 'Deals', value: '₹50Cr+' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 border border-white/10 text-center"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                <s.icon size={20} className="mx-auto mb-2" style={{ color: '#FF385C' }} />
                <p className="text-white font-bold text-lg">{s.value}</p>
                <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filter Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 mb-6 overflow-hidden"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <div className="flex items-center justify-between px-5 py-4">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: activeCount > 0 ? 'linear-gradient(135deg,#FF385C,#E31C5F)' : '#F7F7F7' }}>
                <SlidersHorizontal size={15} className={activeCount > 0 ? 'text-white' : 'text-gray-500'} />
              </div>
              <span className="font-semibold text-gray-800 text-sm">Filters</span>
              {activeCount > 0 && (
                <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
                  style={{ background: 'linear-gradient(135deg,#FF385C,#E31C5F)' }}>
                  {activeCount}
                </span>
              )}
              <span className="text-gray-400">{filtersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
            </button>
            {activeCount > 0 && (
              <button
                onClick={() => setFilters({})}
                className="flex items-center space-x-1.5 text-xs font-semibold text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <X size={12} /><span>Clear All</span>
              </button>
            )}
          </div>

          {/* Active pills */}
          {activeCount > 0 && !filtersOpen && (
            <div className="flex flex-wrap gap-2 px-5 pb-4">
              {filters.city && <Pill label={filters.city} onRemove={() => setFilter('city', undefined)} />}
              {filters.state && <Pill label={filters.state} onRemove={() => setFilter('state', undefined)} />}
              {filters.property_type && <Pill label={filters.property_type} onRemove={() => setFilter('property_type', undefined)} />}
              {filters.roi_min && <Pill label={`ROI ≥ ${filters.roi_min}%`} color="green" onRemove={() => setFilter('roi_min', undefined)} />}
            </div>
          )}

          {filtersOpen && (
            <div className="px-5 pb-5 border-t border-gray-50 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="label">State</label>
                  <select className="select-field" value={filters.state || ''} onChange={e => setFilter('state', e.target.value)}>
                    <option value="">All States</option>
                    {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">City</label>
                  <input className="input-field" placeholder="e.g. Goa" value={filters.city || ''} onChange={e => setFilter('city', e.target.value)} />
                </div>
                <div>
                  <label className="label">Property Type</label>
                  <select className="select-field" value={filters.property_type || ''} onChange={e => setFilter('property_type', e.target.value)}>
                    <option value="">All Types</option>
                    {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Furnishing</label>
                  <select className="select-field" value={filters.furnishing_type || ''} onChange={e => setFilter('furnishing_type', e.target.value)}>
                    <option value="">Any</option>
                    {FURNISHING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Min Price (₹)</label>
                  <input className="input-field" type="number" placeholder="e.g. 2000000" value={filters.price_min || ''} onChange={e => setFilter('price_min', e.target.value ? Number(e.target.value) : undefined)} />
                </div>
                <div>
                  <label className="label">Max Price (₹)</label>
                  <input className="input-field" type="number" placeholder="e.g. 10000000" value={filters.price_max || ''} onChange={e => setFilter('price_max', e.target.value ? Number(e.target.value) : undefined)} />
                </div>
                <div>
                  <label className="label">Min Revenue/mo (₹)</label>
                  <input className="input-field" type="number" placeholder="e.g. 50000" value={filters.revenue_min || ''} onChange={e => setFilter('revenue_min', e.target.value ? Number(e.target.value) : undefined)} />
                </div>
                <div>
                  <label className="label">Min ROI (%)</label>
                  <input className="input-field" type="number" placeholder="e.g. 10" value={filters.roi_min || ''} onChange={e => setFilter('roi_min', e.target.value ? Number(e.target.value) : undefined)} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {loading && properties.length === 0 ? 'Loading...' : (
                <><span style={{ color: '#FF385C' }}>{total}</span> {total === 1 ? 'Property' : 'Properties'} Available</>
              )}
            </h2>
            {activeCount > 0 && <p className="text-sm text-gray-400 mt-0.5">Filtered results</p>}
          </div>
          <Link to="/requirements" className="hidden sm:flex items-center space-x-1.5 text-sm font-medium hover:underline" style={{ color: '#FF385C' }}>
            <span>View Buy Requests</span><ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        {loading && properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="spinner mb-4" />
            <p className="text-gray-400 text-sm">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg,#fff5f7,#ffe4e8)' }}>
              <Building2 size={36} style={{ color: '#FF385C', opacity: 0.4 }} />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters</p>
            <button onClick={() => setFilters({})} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {properties.map((p, i) => (
                <div key={p.id} className="fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
            {properties.length < total && (
              <div className="text-center mt-10">
                <button
                  onClick={() => { const ns = skip + 20; setSkip(ns); fetchProperties(filters, ns, true); }}
                  disabled={loading}
                  className="px-8 py-3.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 disabled:opacity-50"
                  style={{ borderColor: '#FF385C', color: '#FF385C' }}
                  onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = '#FF385C'; (e.target as HTMLButtonElement).style.color = 'white'; }}
                  onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = 'transparent'; (e.target as HTMLButtonElement).style.color = '#FF385C'; }}
                >
                  {loading ? 'Loading...' : `Load More (${total - properties.length} remaining)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── CTA ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 100%)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #FF385C, transparent)' }} />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Looking to Buy an Airbnb?</h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto">Post your requirements and let sellers come to you</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/post-requirement" className="btn-primary px-8 py-3.5 rounded-xl text-sm">
                Post a Buy Requirement
              </Link>
              <Link to="/requirements"
                className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white/70 border border-white/20 hover:bg-white/10 transition-all">
                Browse Buy Requests
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ label, onRemove, color = 'rose' }: { label: string; onRemove: () => void; color?: string }) {
  const colors: Record<string, string> = {
    rose: 'bg-rose-50 text-[#FF385C] border-rose-100',
    green: 'bg-green-50 text-green-600 border-green-100',
  };
  return (
    <span className={`flex items-center space-x-1 text-xs font-medium px-3 py-1 rounded-full border ${colors[color] || colors.rose}`}>
      <span>{label}</span>
      <button onClick={onRemove}><X size={10} /></button>
    </span>
  );
}