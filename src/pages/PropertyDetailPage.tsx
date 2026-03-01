import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, Mail, TrendingUp, IndianRupee, Home,
  Maximize2, ChevronLeft, ChevronRight, User, CheckCircle,
  ArrowLeft, Calendar, Percent, X
} from 'lucide-react';
import api, { getImageUrl } from '../lib/api';
import type { Property } from '../types';
import { formatPrice, formatRevenue } from '../lib/auth';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgIdx, setImgIdx] = useState(0);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    api.get(`/api/properties/${id}`)
      .then(r => setProperty(r.data))
      .catch(() => setError('Property not found or access denied.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen pt-16">
      <div className="spinner" />
    </div>
  );

  if (error || !property) return (
    <div className="max-w-4xl mx-auto px-4 pt-28 pb-16 text-center">
      <Home size={64} className="text-gray-200 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-500 mb-2">{error || 'Property not found'}</h2>
      <button onClick={() => navigate('/')} className="btn-primary mt-4">Back to listings</button>
    </div>
  );

  const images = property.images || [];

  return (
    <div className="pt-16 pb-24 lg:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Back button */}
        <button onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm font-medium">
          <ArrowLeft size={18} /><span>Back to listings</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">

            {/* Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="relative bg-gray-100" style={{ height: 'clamp(220px, 50vw, 420px)' }}>
                {images.length > 0 ? (
                  <>
                    <img src={getImageUrl(images[imgIdx])} alt={property.title}
                      className="w-full h-full object-cover" />
                    {images.length > 1 && (
                      <>
                        <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-md transition-colors">
                          <ChevronLeft size={18} />
                        </button>
                        <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-md transition-colors">
                          <ChevronRight size={18} />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5">
                          {images.map((_, i) => (
                            <button key={i} onClick={() => setImgIdx(i)}
                              className={`rounded-full transition-all ${i === imgIdx ? 'bg-white w-5 h-2' : 'bg-white/50 w-2 h-2'}`} />
                          ))}
                        </div>
                        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                          {imgIdx + 1}/{images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #fff5f7, #ffe4e8)' }}>
                    <Home size={64} style={{ color: '#FF385C', opacity: 0.2 }} />
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="thumb-scroll">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-[#FF385C]' : 'border-transparent opacity-60'}`}>
                      <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="section-card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full inline-block"
                    style={{ background: '#fff5f7', color: '#FF385C' }}>
                    {property.property_type}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2 leading-tight">{property.title}</h1>
                  <div className="flex items-center text-gray-400 mt-1 text-sm">
                    <MapPin size={13} className="mr-1 flex-shrink-0" style={{ color: '#FF385C' }} />
                    <span className="truncate">{property.area}, {property.city}, {property.state}</span>
                  </div>
                </div>
                <div className="sm:text-right flex-shrink-0">
                  <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#FF385C' }}>{formatPrice(property.asking_price)}</p>
                  <p className="text-xs text-gray-400">Asking Price</p>
                </div>
              </div>

              {/* Key stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-gray-50 mb-4">
                {property.monthly_revenue && (
                  <div className="text-center bg-green-50 rounded-xl p-3">
                    <IndianRupee size={16} className="mx-auto mb-1 text-green-500" />
                    <p className="text-sm font-bold text-gray-900">{formatRevenue(property.monthly_revenue)}</p>
                    <p className="text-xs text-gray-400">Monthly Revenue</p>
                  </div>
                )}
                {property.expected_roi && (
                  <div className="text-center bg-blue-50 rounded-xl p-3">
                    <TrendingUp size={16} className="mx-auto mb-1 text-blue-500" />
                    <p className="text-sm font-bold text-gray-900">{property.expected_roi}%</p>
                    <p className="text-xs text-gray-400">Expected ROI</p>
                  </div>
                )}
                {property.occupancy_rate && (
                  <div className="text-center bg-purple-50 rounded-xl p-3">
                    <Percent size={16} className="mx-auto mb-1 text-purple-500" />
                    <p className="text-sm font-bold text-gray-900">{property.occupancy_rate}%</p>
                    <p className="text-xs text-gray-400">Occupancy Rate</p>
                  </div>
                )}
                {(property.built_up_area || property.carpet_area) && (
                  <div className="text-center bg-orange-50 rounded-xl p-3">
                    <Maximize2 size={16} className="mx-auto mb-1 text-orange-500" />
                    <p className="text-sm font-bold text-gray-900">{property.built_up_area || property.carpet_area} sq.ft</p>
                    <p className="text-xs text-gray-400">{property.built_up_area ? 'Built-up' : 'Carpet'} Area</p>
                  </div>
                )}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Furnishing', value: property.furnishing_type },
                  { label: 'Property Type', value: property.property_type },
                  ...(property.carpet_area ? [{ label: 'Carpet Area', value: `${property.carpet_area} sq.ft` }] : []),
                  ...(property.built_up_area ? [{ label: 'Built-up Area', value: `${property.built_up_area} sq.ft` }] : []),
                ].map(d => (
                  <div key={d.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">{d.label}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{d.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="section-card">
                <h3 className="font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.amenities.map((a, i) => (
                    <div key={i} className="flex items-center space-x-2 text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2">
                      <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Investment summary — mobile only */}
            <div className="lg:hidden rounded-2xl p-4 border border-rose-100" style={{ background: 'linear-gradient(135deg, #fff5f7, #ffe4e8)' }}>
              <h3 className="font-semibold text-gray-900 mb-3">Investment Summary</h3>
              <div className="space-y-2">
                {[
                  { label: 'Asking Price', value: formatPrice(property.asking_price), color: '#FF385C' },
                  ...(property.monthly_revenue ? [{ label: 'Monthly Revenue', value: formatRevenue(property.monthly_revenue), color: '#10b981' }] : []),
                  ...(property.expected_roi ? [{ label: 'Expected ROI', value: `${property.expected_roi}%`, color: '#3b82f6' }] : []),
                  ...(property.occupancy_rate ? [{ label: 'Occupancy Rate', value: `${property.occupancy_rate}%`, color: '#8b5cf6' }] : []),
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact + Summary — desktop only */}
          <div className="hidden lg:block space-y-5">
            <div className="section-card sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Seller</h3>
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 flex-shrink-0">
                  <User size={20} className="text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{property.owner_name}</p>
                  <p className="text-xs text-gray-400">Property Owner</p>
                </div>
              </div>
              <div className="space-y-3">
                <a href={`tel:${property.owner_phone}`}
                  className="flex items-center space-x-3 text-white px-4 py-3 rounded-xl transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
                  <Phone size={18} />
                  <span className="font-semibold text-sm">{property.owner_phone}</span>
                </a>
                <a href={`mailto:${property.owner_email}`}
                  className="flex items-center space-x-3 text-gray-700 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Mail size={18} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm truncate">{property.owner_email}</span>
                </a>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-xs text-gray-400 space-x-1">
                <Calendar size={12} />
                <span>Listed {new Date(property.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="rounded-2xl p-5 border border-rose-100" style={{ background: 'linear-gradient(135deg, #fff5f7, #ffe4e8)' }}>
              <h3 className="font-semibold text-gray-900 mb-3">Investment Summary</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Asking Price', value: formatPrice(property.asking_price), color: '#FF385C' },
                  ...(property.monthly_revenue ? [{ label: 'Monthly Revenue', value: formatRevenue(property.monthly_revenue), color: '#10b981' }] : []),
                  ...(property.expected_roi ? [{ label: 'Expected ROI', value: `${property.expected_roi}%`, color: '#3b82f6' }] : []),
                  ...(property.occupancy_rate ? [{ label: 'Occupancy Rate', value: `${property.occupancy_rate}%`, color: '#8b5cf6' }] : []),
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky contact bar */}
      <div className="lg:hidden mobile-bottom-bar bg-white border-t border-gray-100 px-4 py-3"
        style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
        <div className="flex items-center space-x-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400">Contact Seller</p>
            <p className="text-sm font-bold text-gray-900 truncate">{property.owner_name}</p>
          </div>
          <a href={`mailto:${property.owner_email}`}
            className="flex items-center justify-center w-11 h-11 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 flex-shrink-0">
            <Mail size={18} />
          </a>
          <a href={`tel:${property.owner_phone}`}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl text-white font-semibold text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
            <Phone size={16} />
            <span>Call Now</span>
          </a>
        </div>
      </div>

      {/* Mobile contact modal */}
      {showContact && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 fade-in" onClick={() => setShowContact(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 slide-up"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">Contact Seller</h3>
              <button onClick={() => setShowContact(false)} className="p-2 rounded-xl bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center space-x-3 mb-5 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{property.owner_name}</p>
                <p className="text-xs text-gray-400">Property Owner</p>
              </div>
            </div>
            <div className="space-y-3">
              <a href={`tel:${property.owner_phone}`}
                className="flex items-center space-x-3 text-white px-4 py-4 rounded-xl w-full"
                style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
                <Phone size={20} />
                <div>
                  <p className="text-xs text-white/70">Phone</p>
                  <p className="font-bold">{property.owner_phone}</p>
                </div>
              </a>
              <a href={`mailto:${property.owner_email}`}
                className="flex items-center space-x-3 text-gray-700 px-4 py-4 rounded-xl border-2 border-gray-100 w-full">
                <Mail size={20} className="text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="font-semibold truncate">{property.owner_email}</p>
                </div>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}