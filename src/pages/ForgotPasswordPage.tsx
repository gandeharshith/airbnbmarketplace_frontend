import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRight, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSent(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      toast.error(e.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16"
      style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%)' }}>
      <div className="w-full max-w-md">

        {!sent ? (
          <>
            <div className="mb-8 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #fff0f3, #ffe4ea)' }}>
                <Mail size={28} style={{ color: '#FF385C' }} />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">Forgot password?</h1>
              <p className="text-gray-400 text-sm">
                No worries! Enter your email and we'll send you a reset link.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100"
              style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-sm">
                  <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            </div>

            <div className="text-center mt-6">
              <Link to="/login"
                className="flex items-center justify-center space-x-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                <ArrowLeft size={14} />
                <span>Back to login</span>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg, #f0fff4, #dcfce7)' }}>
                <CheckCircle size={36} className="text-green-500" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-3">Check your email</h1>
              <p className="text-gray-400 text-sm mb-2">
                We sent a password reset link to
              </p>
              <p className="font-bold text-gray-700 mb-6">{email}</p>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-6 text-left"
                style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Click the link in the email to reset your password.
                  The link will expire in <strong>1 hour</strong>.
                  Check your spam folder if you don't see it.
                </p>
              </div>

              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="text-sm font-semibold hover:underline"
                style={{ color: '#FF385C' }}>
                Try a different email
              </button>

              <div className="mt-4">
                <Link to="/login"
                  className="flex items-center justify-center space-x-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                  <ArrowLeft size={14} />
                  <span>Back to login</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}