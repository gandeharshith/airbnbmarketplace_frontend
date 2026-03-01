import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Shield } from 'lucide-react';
import api from '../lib/api';

interface AdminLoginForm { email: string; password: string; }

export default function AdminLoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginForm>();

  const onSubmit = async (data: AdminLoginForm) => {
    setLoading(true);
    try {
      const res = await api.post('/api/admin/login', data);
      localStorage.setItem('admin_token', res.data.access_token);
      toast.success('Welcome, Admin!');
      navigate('/admin');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      toast.error(e.response?.data?.detail || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)', boxShadow: '0 8px 24px rgba(255,56,92,0.4)' }}>
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">Admin Panel</h1>
          <p className="text-white/40 mt-1 text-sm">Airbnb Marketplace India</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8 border border-white/10"
          style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">Admin Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all border border-white/10 text-white placeholder-white/30"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                placeholder="admin@example.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm font-medium outline-none transition-all border border-white/10 text-white placeholder-white/30"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                  placeholder="Enter admin password"
                  {...register('password', { required: 'Password is required' })}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)', boxShadow: '0 4px 16px rgba(255,56,92,0.4)' }}>
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Restricted access — authorized personnel only
        </p>
      </div>
    </div>
  );
}