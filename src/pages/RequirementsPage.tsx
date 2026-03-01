import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MapPin, Phone, Mail, Plus, IndianRupee, TrendingUp } from 'lucide-react';
import api from '../lib/api';
import type { Requirement } from '../types';
import { formatPrice } from '../lib/auth';

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/requirements/')
      .then(r => { setRequirements(r.data.requirements); setTotal(r.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen pt-16">
      <div className="spinner" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Buy Requests</h1>
          <p className="text-gray-400 mt-1">
            <span className="font-bold text-gray-900">{total}</span> buyers looking for Airbnb properties
          </p>
        </div>
        <Link to="/post-requirement"
          className="flex items-center space-x-2 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)', boxShadow: '0 4px 12px rgba(255,56,92,0.3)' }}>
          <Plus size={16} /><span>Post Requirement</span>
        </Link>
      </div>

      {requirements.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #f0f4ff, #e8eeff)' }}>
            <FileText size={36} className="text-blue-400 opacity-50" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No requirements posted yet</h3>
          <p className="text-gray-400 mb-6">Be the first to post what you're looking for</p>
          <Link to="/post-requirement" className="btn-primary px-6 py-3 rounded-xl text-sm">Post a Requirement</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requirements.map(req => (
            <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                {/* Left: Details */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                      {req.property_type}
                    </span>
                    {req.furnishing_type && (
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-50 text-gray-600">
                        {req.furnishing_type}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin size={14} className="mr-1.5 flex-shrink-0" style={{ color: '#FF385C' }} />
                    <span className="font-medium">{req.city}, {req.state}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Budget Range</p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatPrice(req.budget_min)} – {formatPrice(req.budget_max)}
                      </p>
                    </div>
                    {req.expected_monthly_revenue && (
                      <div className="bg-green-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Expected Revenue</p>
                        <p className="text-sm font-bold text-green-700 flex items-center">
                          <IndianRupee size={12} className="mr-0.5" />
                          {req.expected_monthly_revenue.toLocaleString('en-IN')}/mo
                        </p>
                      </div>
                    )}
                    {req.minimum_roi && (
                      <div className="bg-blue-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Min ROI</p>
                        <p className="text-sm font-bold text-blue-700 flex items-center">
                          <TrendingUp size={12} className="mr-0.5" />
                          {req.minimum_roi}%
                        </p>
                      </div>
                    )}
                    {req.area_size && (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Area Size</p>
                        <p className="text-sm font-bold text-gray-900">{req.area_size} sq.ft</p>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2">{req.description}</p>
                </div>

                {/* Right: Buyer Contact */}
                <div className="sm:w-52 flex-shrink-0 bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center space-x-2.5 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
                      {req.buyer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{req.buyer_name}</p>
                      <p className="text-xs text-gray-400">Buyer</p>
                    </div>
                  </div>
                  <a href={`tel:${req.buyer_phone}`}
                    className="flex items-center space-x-2 text-sm font-medium mb-2 hover:underline"
                    style={{ color: '#FF385C' }}>
                    <Phone size={13} /><span>{req.buyer_phone}</span>
                  </a>
                  <a href={`mailto:${req.buyer_email}`}
                    className="flex items-center space-x-2 text-xs text-gray-500 hover:underline truncate">
                    <Mail size={12} /><span className="truncate">{req.buyer_email}</span>
                  </a>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400">
                Posted {new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}