import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, PlusCircle, LayoutDashboard, FileText, LogOut, Home, Search } from 'lucide-react';
import { getUser, logout } from '../lib/auth';

export default function Navbar() {
  const [user, setUser] = useState(getUser());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUser(getUser());
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  // Hide navbar on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.97)' : 'white',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.08)' : '0 1px 0 #F0F0F0',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 flex-shrink-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}
              >
                A
              </div>
              <div>
                <span className="font-bold text-gray-900 text-[15px]">AirBnB</span>
                <span className="font-bold text-[15px]" style={{ color: '#FF385C' }}> Marketplace</span>
              </div>
            </Link>

            {/* Center Nav — desktop */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { to: '/', label: 'Browse', icon: Home },
                { to: '/requirements', label: 'Buy Requests', icon: Search },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive(to)
                      ? 'bg-rose-50 text-[#FF385C]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right — desktop */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  <Link
                    to="/post-property"
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{
                      background: 'linear-gradient(135deg, #FF385C, #E31C5F)',
                      boxShadow: '0 4px 12px rgba(255,56,92,0.3)',
                    }}
                  >
                    <PlusCircle size={15} />
                    <span>List Property</span>
                  </Link>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all bg-white"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700 max-w-[90px] truncate">
                        {user.name.split(' ')[0]}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 slide-down">
                        <div className="px-4 py-3 border-b border-gray-50">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <LayoutDashboard size={15} className="text-gray-400" />
                          <span>My Dashboard</span>
                        </Link>
                        <Link to="/post-requirement" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <FileText size={15} className="text-gray-400" />
                          <span>Post Requirement</span>
                        </Link>
                        <div className="border-t border-gray-50 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <LogOut size={15} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors">
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)', boxShadow: '0 4px 12px rgba(255,56,92,0.3)' }}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile right side */}
            <div className="flex md:hidden items-center space-x-2">
              {user && (
                <Link
                  to="/post-property"
                  className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}
                >
                  <PlusCircle size={13} />
                  <span>List</span>
                </Link>
              )}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden fade-in"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 md:hidden w-72 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>A</div>
            <span className="font-bold text-gray-900 text-sm">AirBnB Marketplace</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <div className="px-3 py-3 space-y-1 overflow-y-auto flex-1">
          <Link to="/"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isActive('/') ? 'bg-rose-50 text-[#FF385C]' : 'text-gray-700 hover:bg-gray-50'
            }`}>
            <Home size={18} className={isActive('/') ? 'text-[#FF385C]' : 'text-gray-400'} />
            <span>Browse Properties</span>
          </Link>

          <Link to="/requirements"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isActive('/requirements') ? 'bg-rose-50 text-[#FF385C]' : 'text-gray-700 hover:bg-gray-50'
            }`}>
            <Search size={18} className={isActive('/requirements') ? 'text-[#FF385C]' : 'text-gray-400'} />
            <span>Buy Requests</span>
          </Link>

          {user ? (
            <>
              <Link to="/dashboard"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive('/dashboard') ? 'bg-rose-50 text-[#FF385C]' : 'text-gray-700 hover:bg-gray-50'
                }`}>
                <LayoutDashboard size={18} className={isActive('/dashboard') ? 'text-[#FF385C]' : 'text-gray-400'} />
                <span>My Dashboard</span>
              </Link>

              <Link to="/post-requirement"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive('/post-requirement') ? 'bg-rose-50 text-[#FF385C]' : 'text-gray-700 hover:bg-gray-50'
                }`}>
                <FileText size={18} className={isActive('/post-requirement') ? 'text-[#FF385C]' : 'text-gray-400'} />
                <span>Post Requirement</span>
              </Link>

              <Link to="/post-property"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-white mt-2"
                style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
                <PlusCircle size={18} />
                <span>List a Property</span>
              </Link>

              <div className="border-t border-gray-100 mt-3 pt-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link to="/login"
                className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-colors">
                Sign In
              </Link>
              <Link to="/register"
                className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
                Create Free Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}