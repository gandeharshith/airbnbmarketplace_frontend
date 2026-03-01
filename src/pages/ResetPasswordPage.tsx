import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight, Lock, CheckCircle, XCircle } from 'lucide-react';
import api from '../lib/api';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { toast.error('Invalid reset link'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }

    setLoading(true);
    try {
      await api.post('/api/auth/reset-password', { token, new_password: newPassword });
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      toast.error(e.response?.data?.detail || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16"
        style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%)' }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-50">
            <XCircle size={36} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-3">Invalid Reset Link</h1>
          <p className="text-gray-400 text-sm mb-6">This password reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="btn-primary px-6 py-3 rounded-xl text-sm">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16"
      style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%)' }}>
      <div className="w-full max-w-md">

        {!success ? (
          <>
            <div className="mb-8 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #fff0f3, #ffe4ea)' }}>
                <Lock size={28} style={{ color: '#FF385C' }} />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">Set new password</h1>
              <p className="text-gray-400 text-sm">
                Choose a strong password for your account.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100"
              style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">New Password</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      className="input-field pr-12"
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {newPassword && newPassword.length < 6 && (
                    <p className="error-text">Password must be at least 6 characters</p>
                  )}
                </div>

                <div>
                  <label className="label">Confirm New Password</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="error-text">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
                  className="btn-primary w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-sm">
                  <span>{loading ? 'Resetting...' : 'Reset Password'}</span>
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'linear-gradient(135deg, #f0fff4, #dcfce7)' }}>
              <CheckCircle size={36} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3">Password reset!</h1>
            <p className="text-gray-400 text-sm mb-6">
              Your password has been reset successfully.<br />
              Redirecting to login in 3 seconds...
            </p>
            <Link to="/login" className="btn-primary px-8 py-3 rounded-xl text-sm inline-flex items-center space-x-2">
              <span>Go to Login</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}