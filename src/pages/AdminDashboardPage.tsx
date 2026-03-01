import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, LogOut, Home, FileText, Users, Shield, MapPin, IndianRupee, TrendingUp, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getImageUrl } from '../lib/api';

type Tab = 'properties' | 'requirements' | 'users';

interface AdminProperty {
  id: string; title: string; state: string; city: string; area: string;
  property_type: string; asking_price: number; monthly_revenue?: number;
  expected_roi?: number; furnishing_type: string; images: string[];
  owner_name: string; owner_email: string; owner_phone: string;
  description: string; created_at: string;
}

interface AdminRequirement {
  id: string; state: string; city: string; property_type: string;
  budget_min: number; budget_max: number; description: string;
  buyer_name: string; buyer_email: string; buyer_phone: string;
  created_at: string;
}

interface AdminUser {
  id: string; name: string; email: string; phone: string; created_at: string;
}

function formatPrice(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

function getAdminHeaders() {
  const token = localStorage.getItem('admin_token');
  return { Authorization: `Bearer ${token}` };
}

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>('properties');
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [requirements, setRequirements] = useState<AdminRequirement[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { navigate('/admin/login'); return false; }
    return true;
  }, [navigate]);

  const fetchAll = useCallback(async () => {
    if (!checkAuth()) return;
    setLoading(true);
    try {
      const headers = getAdminHeaders();
      const [pRes, rRes, uRes] = await Promise.all([
        api.get('/api/admin/properties', { headers }),
        api.get('/api/admin/requirements', { headers }),
        api.get('/api/admin/users', { headers }),
      ]);
      setProperties(pRes.data.properties);
      setRequirements(rRes.data.requirements);
      setUsers(uRes.data.users);
    } catch {
      toast.error('Session expired. Please login again.');
      localStorage.removeItem('admin_token');
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [checkAuth, navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const deleteProperty = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/admin/properties/${id}`, { headers: getAdminHeaders() });
      setProperties(p => p.filter(x => x.id !== id));
      toast.success('Property deleted');
    } catch { toast.error('Failed to delete'); }
    finally { setDeletingId(null); }
  };

  const deleteRequirement = async (id: string) => {
    if (!confirm('Delete this requirement? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/admin/requirements/${id}`, { headers: getAdminHeaders() });
      setRequirements(r => r.filter(x => x.id !== id));
      toast.success('Requirement deleted');
    } catch { toast.error('Failed to delete'); }
    finally { setDeletingId(null); }
  };

  const deleteUser = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/admin/users/${id}`, { headers: getAdminHeaders() });
      setUsers(u => u.filter(x => x.id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete'); }
    finally { setDeletingId(null); }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
    toast.success('Logged out');
  };

  const TABS = [
    { key: 'properties' as Tab, label: 'Properties', count: properties.length, icon: Home },
    { key: 'requirements' as Tab, label: 'Requirements', count: requirements.length, icon: FileText },
    { key: 'users' as Tab, label: 'Users', count: users.length, icon: Users },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#f4f5f7' }}>
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <span className="font-black text-gray-900 text-sm">Admin Panel</span>
              <span className="text-gray-400 text-xs ml-2">Airbnb Marketplace India</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={fetchAll}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors">
              <RefreshCw size={13} /><span>Refresh</span>
            </button>
            <button onClick={logout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
              <LogOut size={13} /><span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {TABS.map(t => (
            <div key={t.key} className="bg-white rounded-2xl p-4 border border-gray-100"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium">{t.label}</p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">{t.count}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #fff0f3, #ffe4ea)' }}>
                  <t.icon size={18} style={{ color: '#FF385C' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-2xl p-1 border border-gray-100 mb-6 w-fit"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === t.key ? 'text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
              style={tab === t.key ? { background: 'linear-gradient(135deg, #FF385C, #E31C5F)' } : {}}>
              <t.icon size={14} />
              <span>{t.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                tab === t.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="spinner" />
          </div>
        ) : (
          <>
            {/* Properties Tab */}
            {tab === 'properties' && (
              <div className="space-y-3">
                {properties.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                    <Home size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No properties listed yet</p>
                  </div>
                ) : properties.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-start gap-4">
                      {/* Image */}
                      <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        {p.images[0] ? (
                          <img src={getImageUrl(p.images[0])} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home size={20} className="text-gray-300" />
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm truncate">{p.title}</h3>
                            <div className="flex items-center text-gray-400 text-xs mt-0.5">
                              <MapPin size={11} className="mr-1" style={{ color: '#FF385C' }} />
                              {p.area}, {p.city}, {p.state}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteProperty(p.id, p.title)}
                            disabled={deletingId === p.id}
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 flex-shrink-0">
                            <Trash2 size={13} />
                            <span>{deletingId === p.id ? 'Deleting...' : 'Delete'}</span>
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{p.property_type}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{p.furnishing_type}</span>
                          <span className="text-xs font-bold text-gray-900 flex items-center">
                            <IndianRupee size={11} className="mr-0.5" />{formatPrice(p.asking_price).replace('₹', '')}
                          </span>
                          {p.monthly_revenue && (
                            <span className="text-xs text-green-600 font-semibold">
                              Rev: {formatPrice(p.monthly_revenue)}/mo
                            </span>
                          )}
                          {p.expected_roi && (
                            <span className="text-xs text-blue-600 font-semibold flex items-center">
                              <TrendingUp size={11} className="mr-0.5" />{p.expected_roi}% ROI
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span>By: <span className="font-semibold text-gray-600">{p.owner_name}</span></span>
                          <span>{p.owner_email}</span>
                          <span>{p.owner_phone}</span>
                          <span>{new Date(p.created_at).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Requirements Tab */}
            {tab === 'requirements' && (
              <div className="space-y-3">
                {requirements.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                    <FileText size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No requirements posted yet</p>
                  </div>
                ) : requirements.map(r => (
                  <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{r.property_type}</span>
                          <div className="flex items-center text-gray-400 text-xs">
                            <MapPin size={11} className="mr-1" style={{ color: '#FF385C' }} />
                            {r.city}, {r.state}
                          </div>
                        </div>
                        <p className="text-xs font-bold text-gray-900">
                          Budget: {formatPrice(r.budget_min)} – {formatPrice(r.budget_max)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{r.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span>By: <span className="font-semibold text-gray-600">{r.buyer_name}</span></span>
                          <span>{r.buyer_email}</span>
                          <span>{r.buyer_phone}</span>
                          <span>{new Date(r.created_at).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteRequirement(r.id)}
                        disabled={deletingId === r.id}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 flex-shrink-0">
                        <Trash2 size={13} />
                        <span>{deletingId === r.id ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Users Tab */}
            {tab === 'users' && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                {users.length === 0 ? (
                  <div className="p-12 text-center">
                    <Users size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No users registered yet</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-xs font-bold text-gray-400 px-5 py-3">Name</th>
                        <th className="text-left text-xs font-bold text-gray-400 px-5 py-3">Email</th>
                        <th className="text-left text-xs font-bold text-gray-400 px-5 py-3">Phone</th>
                        <th className="text-left text-xs font-bold text-gray-400 px-5 py-3">Joined</th>
                        <th className="text-right text-xs font-bold text-gray-400 px-5 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={u.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === users.length - 1 ? 'border-0' : ''}`}>
                          <td className="px-5 py-3">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-500">{u.email}</td>
                          <td className="px-5 py-3 text-sm text-gray-500">{u.phone}</td>
                          <td className="px-5 py-3 text-xs text-gray-400">
                            {new Date(u.created_at).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => deleteUser(u.id, u.name)}
                              disabled={deletingId === u.id}
                              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 ml-auto">
                              <Trash2 size={12} />
                              <span>{deletingId === u.id ? '...' : 'Delete'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}