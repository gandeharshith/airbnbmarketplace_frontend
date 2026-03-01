import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, FileText, Plus, Trash2, MapPin, TrendingUp, LogOut } from 'lucide-react';
import api, { getImageUrl } from '../lib/api';
import type { PropertyListItem, Requirement } from '../types';
import { formatPrice, formatRevenue, getUser, logout } from '../lib/auth';
import toast from 'react-hot-toast';

type Tab = 'listings' | 'requirements';

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('listings');
  const [listings, setListings] = useState<PropertyListItem[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    Promise.all([
      api.get('/api/properties/user/my-listings'),
      api.get('/api/requirements/user/my-requirements'),
    ]).then(([l, r]) => {
      setListings(l.data);
      setRequirements(r.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const deleteListing = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.delete(`/api/properties/${id}`);
      setListings(p => p.filter(x => x.id !== id));
      toast.success('Listing deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const deleteRequirement = async (id: string) => {
    if (!confirm('Delete this requirement?')) return;
    try {
      await api.delete(`/api/requirements/${id}`);
      setRequirements(p => p.filter(x => x.id !== id));
      toast.success('Requirement deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen pt-16">
      <div className="spinner" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl font-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-black text-gray-900 truncate">{user?.name}</h1>
            <p className="text-gray-400 text-xs sm:text-sm truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium flex-shrink-0 ml-2">
          <LogOut size={16} /><span className="hidden sm:block">Sign Out</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="section-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#fff5f7' }}>
            <Home size={22} style={{ color: '#FF385C' }} />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{listings.length}</p>
            <p className="text-sm text-gray-400">My Listings</p>
          </div>
        </div>
        <div className="section-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50">
            <FileText size={22} className="text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{requirements.length}</p>
            <p className="text-sm text-gray-400">My Requirements</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-2xl p-1 mb-6">
        {(['listings', 'requirements'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t === 'listings' ? <Home size={16} /> : <FileText size={16} />}
            <span>{t === 'listings' ? `Listings (${listings.length})` : `Requirements (${requirements.length})`}</span>
          </button>
        ))}
      </div>

      {/* Listings Tab */}
      {tab === 'listings' && (
        <div>
          <div className="flex justify-end mb-4">
            <Link to="/post-property"
              className="flex items-center space-x-2 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
              <Plus size={16} /><span>Add Listing</span>
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-16 section-card">
              <Home size={48} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">No listings yet</p>
              <Link to="/post-property" className="btn-primary px-6 py-2.5 rounded-xl text-sm">List Your First Property</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map(l => {
                const img = l.images?.[0] ? getImageUrl(l.images[0]) : null;
                return (
                  <div key={l.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 hover:shadow-sm transition-shadow">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {img ? <img src={img} alt="" className="w-full h-full object-cover" /> :
                        <div className="w-full h-full flex items-center justify-center">
                          <Home size={20} className="text-gray-300" />
                        </div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{l.title}</h3>
                          <div className="flex items-center text-gray-400 text-xs mt-0.5">
                            <MapPin size={10} className="mr-1" />{l.city}, {l.state}
                          </div>
                        </div>
                        <button onClick={() => deleteListing(l.id)}
                          className="p-1.5 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm font-bold" style={{ color: '#FF385C' }}>{formatPrice(l.asking_price)}</span>
                        {l.monthly_revenue && <span className="text-xs text-green-600">{formatRevenue(l.monthly_revenue)}/mo</span>}
                        {l.expected_roi && (
                          <span className="text-xs text-blue-600 flex items-center">
                            <TrendingUp size={10} className="mr-0.5" />{l.expected_roi}% ROI
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full mt-1 inline-block">{l.property_type}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Requirements Tab */}
      {tab === 'requirements' && (
        <div>
          <div className="flex justify-end mb-4">
            <Link to="/post-requirement"
              className="flex items-center space-x-2 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
              <Plus size={16} /><span>Add Requirement</span>
            </Link>
          </div>

          {requirements.length === 0 ? (
            <div className="text-center py-16 section-card">
              <FileText size={48} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">No requirements yet</p>
              <Link to="/post-requirement" className="btn-primary px-6 py-2.5 rounded-xl text-sm">Post a Requirement</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {requirements.map(req => (
                <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600">{req.property_type}</span>
                        {req.furnishing_type && <span className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-500">{req.furnishing_type}</span>}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <MapPin size={12} className="mr-1" style={{ color: '#FF385C' }} />{req.city}, {req.state}
                      </div>
                      <p className="text-sm font-bold text-gray-900 mb-1">
                        Budget: {formatPrice(req.budget_min)} – {formatPrice(req.budget_max)}
                      </p>
                      <p className="text-sm text-gray-400 line-clamp-2">{req.description}</p>
                    </div>
                    <button onClick={() => deleteRequirement(req.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition-colors ml-3 flex-shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
                    Posted {new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}