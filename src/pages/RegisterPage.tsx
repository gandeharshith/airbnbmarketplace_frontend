import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight, Mail, RefreshCw } from 'lucide-react';
import api from '../lib/api';
import { setAuthData } from '../lib/auth';

interface RegisterForm {
  name: string; email: string; phone: string; password: string; confirmPassword: string;
}

const STATS = [
  { num: '500+', label: 'Properties' },
  { num: '12-18%', label: 'Avg ROI' },
  { num: '₹50Cr+', label: 'Deals Done' },
  { num: '1000+', label: 'Members' },
];

export default function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await api.post('/api/auth/register', {
        name: data.name, email: data.email, phone: data.phone, password: data.password
      });
      setRegisteredEmail(data.email);
      setStep('verify');
      toast.success('OTP sent to your email!');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: unknown } } };
      const detail = e.response?.data?.detail;
      const message = Array.isArray(detail) ? (detail as Array<{ msg: string }>).map(d => d.msg).join(', ') : (typeof detail === 'string' ? detail : 'Registration failed.');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) { toast.error('Enter the 6-digit OTP'); return; }
    setVerifying(true);
    try {
      const res = await api.post('/api/auth/verify-email', { email: registeredEmail, otp });
      setAuthData(res.data);
      toast.success(`Welcome, ${res.data.user.name}! Email verified ✓`);
      navigate('/');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      toast.error(e.response?.data?.detail || 'Invalid OTP');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      await api.post('/api/auth/resend-otp', { email: registeredEmail });
      toast.success('New OTP sent!');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      toast.error(e.response?.data?.detail || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex pt-16" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 100%)' }}>
        <div className="absolute -top-20 right-10 w-72 h-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #FF385C, transparent)' }} />
        <div className="absolute bottom-10 -left-10 w-56 h-56 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #FF6B81, transparent)' }} />
        <div className="relative flex flex-col justify-center px-16 text-white">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8 text-white font-black text-xl"
            style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>A</div>
          <h2 className="text-4xl font-black mb-4 leading-tight">
            Join India's Largest<br />
            <span style={{ background: 'linear-gradient(135deg, #FF385C, #FF6B81)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Airbnb Marketplace
            </span>
          </h2>
          <p className="text-white/50 text-lg mb-10">Free to join. Start buying or selling Airbnb properties today.</p>
          <div className="grid grid-cols-2 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="rounded-2xl p-4 border border-white/10"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                <p className="text-2xl font-black text-white">{s.num}</p>
                <p className="text-white/40 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">

          {step === 'register' ? (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Create account</h1>
                <p className="text-gray-400">Join thousands of Airbnb investors</p>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-100" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input className="input-field" placeholder="Your full name"
                      {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} />
                    {errors.name && <p className="error-text">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <input type="email" className="input-field" placeholder="you@example.com"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                      })} />
                    {errors.email && <p className="error-text">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="label">Phone Number</label>
                    <input type="tel" className="input-field" placeholder="+91 98765 43210"
                      {...register('phone', {
                        required: 'Phone is required',
                        minLength: { value: 10, message: 'Min 10 digits' },
                        pattern: { value: /^[0-9+\-\s]+$/, message: 'Invalid phone' }
                      })} />
                    {errors.phone && <p className="error-text">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="label">Password</label>
                    <div className="relative">
                      <input type={showPwd ? 'text' : 'password'} className="input-field pr-12" placeholder="Create a strong password"
                        {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
                      <button type="button" onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                        {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="error-text">{errors.password.message}</p>}
                  </div>
                  <div>
                    <label className="label">Confirm Password</label>
                    <input type="password" className="input-field" placeholder="Confirm your password"
                      {...register('confirmPassword', {
                        required: 'Please confirm password',
                        validate: v => v === password || 'Passwords do not match'
                      })} />
                    {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-primary w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-sm mt-2">
                    <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                    {!loading && <ArrowRight size={16} />}
                  </button>
                </form>
              </div>

              <p className="text-center text-sm text-gray-400 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="font-bold hover:underline" style={{ color: '#FF385C' }}>Sign in</Link>
              </p>
            </>
          ) : (
            /* OTP Verification Step */
            <>
              <div className="mb-6 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, #fff0f3, #ffe4ea)' }}>
                  <Mail size={28} style={{ color: '#FF385C' }} />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Verify your email</h1>
                <p className="text-gray-400 text-sm">
                  We sent a 6-digit OTP to<br />
                  <span className="font-bold text-gray-700">{registeredEmail}</span>
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-100" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                <div className="space-y-5">
                  <div>
                    <label className="label text-center block">Enter 6-digit OTP</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="input-field text-center text-2xl font-black tracking-[0.5em]"
                      placeholder="000000"
                    />
                  </div>

                  <button
                    onClick={handleVerify}
                    disabled={verifying || otp.length !== 6}
                    className="btn-primary w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-sm">
                    <span>{verifying ? 'Verifying...' : 'Verify Email'}</span>
                    {!verifying && <ArrowRight size={16} />}
                  </button>

                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Didn't receive the OTP?</p>
                    <button
                      onClick={handleResendOtp}
                      disabled={resending}
                      className="flex items-center space-x-1.5 mx-auto text-sm font-semibold hover:underline disabled:opacity-50"
                      style={{ color: '#FF385C' }}>
                      <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
                      <span>{resending ? 'Sending...' : 'Resend OTP'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setStep('register')}
                    className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors">
                    ← Back to registration
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}