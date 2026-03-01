import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Upload, X } from 'lucide-react';
import api from '../lib/api';
import { PROPERTY_TYPES, FURNISHING_TYPES, INDIA_STATES } from '../types';

interface PropertyForm {
  title: string; state: string; city: string; area: string;
  property_type: string; asking_price: number; carpet_area?: number;
  built_up_area?: number; furnishing_type: string; monthly_revenue?: number;
  occupancy_rate?: number; expected_roi?: number; amenities?: string;
  description: string;
}

const F = 'input-field';
const S = 'select-field';

export default function PostPropertyPage() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<PropertyForm>();

  const addImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) { toast.error('Max 10 images'); return; }
    setImages(p => [...p, ...files]);
    setPreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (i: number) => {
    setImages(p => p.filter((_, idx) => idx !== i));
    setPreviews(p => p.filter((_, idx) => idx !== i));
  };

  const onSubmit = async (data: PropertyForm) => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== '' && v !== null && !Number.isNaN(v)) {
          fd.append(k, String(v));
        }
      });
      images.forEach(img => fd.append('images', img));
      await api.post('/api/properties/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Property listed successfully!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: unknown } } };
      const detail = e.response?.data?.detail;
      let message = 'Failed to post property.';
      if (typeof detail === 'string') {
        message = detail;
      } else if (Array.isArray(detail) && detail.length > 0) {
        message = (detail as Array<{ msg: string }>).map(d => d.msg).join(', ');
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">List Your Airbnb Property</h1>
        <p className="text-gray-400 mt-1">Fill in the details to list your property for sale</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="section-card">
          <h2 className="font-bold text-gray-900 mb-5 text-base">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Property Title *</label>
              <input className={F} placeholder="e.g., Luxury 2BHK Airbnb in Goa with Sea View"
                {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'Min 5 characters' } })} />
              {errors.title && <p className="error-text">{errors.title.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">State *</label>
                <select className={S} {...register('state', { required: 'Required' })}>
                  <option value="">Select State</option>
                  {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="error-text">{errors.state.message}</p>}
              </div>
              <div>
                <label className="label">City *</label>
                <input className={F} placeholder="e.g., Goa" {...register('city', { required: 'Required' })} />
                {errors.city && <p className="error-text">{errors.city.message}</p>}
              </div>
              <div>
                <label className="label">Area / Locality *</label>
                <input className={F} placeholder="e.g., Calangute" {...register('area', { required: 'Required' })} />
                {errors.area && <p className="error-text">{errors.area.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Property Type *</label>
                <select className={S} {...register('property_type', { required: 'Required' })}>
                  <option value="">Select Type</option>
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.property_type && <p className="error-text">{errors.property_type.message}</p>}
              </div>
              <div>
                <label className="label">Furnishing Type *</label>
                <select className={S} {...register('furnishing_type', { required: 'Required' })}>
                  <option value="">Select Furnishing</option>
                  {FURNISHING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.furnishing_type && <p className="error-text">{errors.furnishing_type.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="section-card">
          <h2 className="font-bold text-gray-900 mb-5 text-base">Pricing & Financials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Asking Price (₹) *</label>
              <input className={F} type="number" placeholder="e.g., 5000000"
                {...register('asking_price', { required: 'Required', min: { value: 1, message: 'Must be > 0' } })} />
              {errors.asking_price && <p className="error-text">{errors.asking_price.message}</p>}
            </div>
            <div>
              <label className="label">Monthly Revenue (₹)</label>
              <input className={F} type="number" placeholder="e.g., 80000" {...register('monthly_revenue')} />
            </div>
            <div>
              <label className="label">Occupancy Rate (%)</label>
              <input className={F} type="number" placeholder="e.g., 75"
                {...register('occupancy_rate', { min: { value: 0, message: '0-100' }, max: { value: 100, message: '0-100' } })} />
              {errors.occupancy_rate && <p className="error-text">{errors.occupancy_rate.message}</p>}
            </div>
            <div>
              <label className="label">Expected ROI (%)</label>
              <input className={F} type="number" placeholder="e.g., 12" {...register('expected_roi')} />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="section-card">
          <h2 className="font-bold text-gray-900 mb-5 text-base">Property Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Carpet Area (sq.ft)</label>
              <input className={F} type="number" placeholder="e.g., 800" {...register('carpet_area')} />
            </div>
            <div>
              <label className="label">Built-up Area (sq.ft)</label>
              <input className={F} type="number" placeholder="e.g., 1000" {...register('built_up_area')} />
            </div>
          </div>
          <div className="mb-4">
            <label className="label">Amenities (comma-separated)</label>
            <input className={F} placeholder="e.g., WiFi, Pool, Parking, AC, Kitchen" {...register('amenities')} />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea className={F} rows={5} placeholder="Describe your property, its features, location advantages..."
              style={{ resize: 'none' }}
              {...register('description', { required: 'Required', minLength: { value: 20, message: 'Min 20 characters' } })} />
            {errors.description && <p className="error-text">{errors.description.message}</p>}
          </div>
        </div>

        {/* Images */}
        <div className="section-card">
          <h2 className="font-bold text-gray-900 mb-5 text-base">Property Images</h2>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[#FF385C] transition-colors"
          >
            <Upload size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-medium">Click to upload images</p>
            <p className="text-xs text-gray-300 mt-1">PNG, JPG up to 10MB each (max 10)</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={addImages} className="hidden" />
          {previews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
              {previews.map((src, i) => (
                <div key={i} className="relative group">
                  <img src={src} alt="" className="w-full h-20 object-cover rounded-xl" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-4 rounded-xl text-base">
          {loading ? 'Posting Property...' : 'Post Property for Sale'}
        </button>
      </form>
    </div>
  );
}