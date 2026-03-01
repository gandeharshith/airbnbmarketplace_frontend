import { useNavigate } from 'react-router-dom';
import { MapPin, Zap, IndianRupee, TrendingUp, Home } from 'lucide-react';
import type { PropertyListItem } from '../types';
import { formatPrice, formatRevenue, isAuthenticated } from '../lib/auth';
import { getImageUrl } from '../lib/api';

export default function PropertyCard({ property }: { property: PropertyListItem }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    navigate(`/properties/${property.id}`);
  };

  const img = property.images?.[0] ? getImageUrl(property.images[0]) : null;

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer card-hover border border-gray-100"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
    >
      {/* Image */}
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #fff5f7, #ffe4e8)' }}
          >
            <Home size={40} style={{ color: '#FF385C', opacity: 0.25 }} />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/95 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
            {property.property_type}
          </span>
        </div>

        {/* ROI badge */}
        {property.expected_roi && (
          <div className="absolute top-3 right-3">
            <span
              className="flex items-center space-x-1 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm"
              style={{ background: '#10b981' }}
            >
              <Zap size={10} />
              <span>{property.expected_roi}% ROI</span>
            </span>
          </div>
        )}

        {/* Hover CTA */}
        <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 hover:opacity-100 transition-opacity duration-200">
          <span className="bg-white text-gray-900 text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
            {isAuthenticated() ? 'View Details →' : 'Login to View →'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xl font-bold" style={{ color: '#FF385C' }}>
            {formatPrice(property.asking_price)}
          </span>
          {property.monthly_revenue && (
            <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-lg">
              <IndianRupee size={11} className="text-green-600" />
              <span className="text-xs font-semibold text-green-700">
                {formatRevenue(property.monthly_revenue)}/mo
              </span>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 leading-snug">
          {property.title}
        </h3>

        <div className="flex items-center text-gray-400 text-xs mb-3">
          <MapPin size={11} className="mr-1 flex-shrink-0" style={{ color: '#FF385C' }} />
          <span className="truncate">{property.area}, {property.city}, {property.state}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md font-medium">
            {property.furnishing_type}
          </span>
          {property.owner_name && (
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <TrendingUp size={11} />
              <span>by {property.owner_name.split(' ')[0]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}