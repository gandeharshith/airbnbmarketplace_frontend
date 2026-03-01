import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import api from '../lib/api';
import { setAuthData } from '../lib/auth';

interface LoginForm { email: string; password: string; }

const FEATURES = ['Browse 100+ Airbnb listings', 'Connect with verified sellers', 'Post buy requirements', 'Track ROI & revenue data'];

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', data);
      setAuthData(res.data);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      const from = (location.state as { from?: string })?.from || '/';
      navigate(from);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } }; status?: number };
      const status = (err as { response?: { status?: number } }).response?.status;
      const detail = e.response?.data?.detail;
      const message = Array.isArray(detail)
        ? (detail as Array<{ msg: string }>).map(d => d.msg).join(', ')
        : (typeof detail === 'string' ? detail : 'Login failed. Please try again.');
      toast.error(message, {
        duration: status === 403 ? 6000 : 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex pt-16" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%)' }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 100%)' }}>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #FF385C, transparent)' }} />
        <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #FF6B81, transparent)' }} />
        <div className="relative flex flex-col justify-center px-16 text-white">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8 text-white font-black text-xl"
            style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>A</div>
          <h2 className="text-4xl font-black mb-4 leading-tight">
            India's Premier<br />
            <span style={{ background: 'linear-gradient(135deg, #FF385C, #FF6B81)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Airbnb Marketplace
            </span>
          </h2>
          <p className="text-white/50 text-lg mb-10">Buy and sell profitable short-term rental properties across India</p>
          <div className="space-y-4">
            {FEATURES.map(f => (
              <div key={f} className="flex items-center space-x-3">
                <CheckCircle size={18} style={{ color: '#FF385C' }} className="flex-shrink-0" />
                <span className="text-white/70 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-400">Sign in to access your account</p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                  })}
                />
                {errors.email && <p className="error-text">{errors.email.message}</p>}
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="input-field pr-12"
                    placeholder="Enter your password"
                    {...register('password', { required: 'Password is required' })}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="error-text">{errors.password.message}</p>}
                <div className="text-right mt-1">
                  <Link to="/forgot-password" className="text-xs font-semibold hover:underline" style={{ color: '#FF385C' }}>
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-sm mt-2">
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold hover:underline" style={{ color: '#FF385C' }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}