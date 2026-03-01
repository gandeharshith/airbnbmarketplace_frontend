import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { PROPERTY_TYPES, FURNISHING_TYPES, INDIA_STATES } from '../types';

interface RequirementForm {
  state: string; city: string; property_type: string;
  budget_min: number; budget_max: number;
  expected_monthly_revenue?: number; minimum_roi?: number;
  area_size?: number; furnishing_type?: string; description: string;
}

const F = 'input-field';
const S = 'select-field';

export default function PostRequirementPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RequirementForm>();

  const onSubmit = async (data: RequirementForm) => {
    setLoading(true);
    try {
      await api.post('/api/requirements/', {
        ...data,
        budget_min: Number(data.budget_min),
        budget_max: Number(data.budget_max),
        expected_monthly_revenue: data.expected_monthly_revenue ? Number(data.expected_monthly_revenue) : undefined,
        minimum_roi: data.minimum_roi ? Number(data.minimum_roi) : undefined,
        area_size: data.area_size ? Number(data.area_size) : undefined,
        furnishing_type: data.furnishing_type || undefined,
      });
      toast.success('Requirement posted successfully!');
      navigate('/requirements');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      const detail = e.response?.data?.detail;
      const message = Array.isArray(detail) ? (detail as Array<{msg:string}>).map(d=>d.msg).join(', ') : (typeof detail === 'string' ? detail : 'Failed to post requirement.');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Post a Buy Requirement</h1>
        <p className="text-gray-400 mt-1">Tell sellers what kind of Airbnb property you're looking for</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Location */}
        <div className="section-card">
          <h2 className="font-bold text-gray-900 mb-5 text-base">Location Preference</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Property Preferences */}
        <div className="section-card">
          <h2 className="font-bold text-gray-900 mb-5 text-base">Property Preferences</h2>
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
              <label className="label">Furnishing Preference</label>
              <select className={S} {...register('furnishing_type')}>
                <option value="">Any</option>
                {FURNISHING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Area Size (sq.ft)</label>
              <input className={F} type="number" placeholder="e.g., 1000" {...register('area_size')} />
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="section-card">
          <h2 className="font-bold text-gray-900 mb-5 text-base">Budget & Financial Expectations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Min Budget (₹) *</label>
              <input className={F} type="number" placeholder="e.g., 3000000"
                {...register('budget_min', { required: 'Required', min: { value: 1, message: 'Must be > 0' } })} />
              {errors.budget_min && <p className="error-text">{errors.budget_min.message}</p>}
            </div>
            <div>
              <label className="label">Max Budget (₹) *</label>
              <input className={F} type="number" placeholder="e.g., 8000000"
                {...register('budget_max', { required: 'Required', min: { value: 1, message: 'Must be > 0' } })} />
              {errors.budget_max && <p className="error-text">{errors.budget_max.message}</p>}
            </div>
            <div>
              <label className="label">Expected Monthly Revenue (₹)</label>
              <input className={F} type="number" placeholder="e.g., 60000" {...register('expected_monthly_revenue')} />
            </div>
            <div>
              <label className="label">Minimum ROI (%)</label>
              <input className={F} type="number" placeholder="e.g., 10" {...register('minimum_roi')} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="section-card">
          <h2 className="font-bold text-gray-900 mb-5 text-base">Additional Details</h2>
          <div>
            <label className="label">Description *</label>
            <textarea className={F} rows={4} placeholder="Describe what you're looking for, any specific requirements..."
              style={{ resize: 'none' }}
              {...register('description', { required: 'Required', minLength: { value: 20, message: 'Min 20 characters' } })} />
            {errors.description && <p className="error-text">{errors.description.message}</p>}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-4 rounded-xl text-base">
          {loading ? 'Posting Requirement...' : 'Post Buy Requirement'}
        </button>
      </form>
    </div>
  );
}