import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authSuccess, setAuthSuccess] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  // Experiment 2, 5 & 6: useAuth custom hook
  const { login } = useAuth();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    // Client-side basic validation
    if (isRegister && !name.trim()) {
      setAuthError('Name is required');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setAuthError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRegister) {
        // ----------------------------------------------------
        // Experiment 6 & 7: User Registration
        // ----------------------------------------------------
        const res = await fetch(API_ENDPOINTS.REGISTER, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password,
            role: role,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          const errMsg = data.errors?.[0]?.msg || data.message || 'Registration failed';
          setAuthError(errMsg);
          setIsSubmitting(false);
          return;
        }

        setAuthSuccess(`Registered as ${data.user.role.toUpperCase()} successfully! Please Sign In now.`);
        setIsRegister(false);
        setIsSubmitting(false);
      } else {
        // ----------------------------------------------------
        // Experiment 6 & 7: User Login & JWT
        // ----------------------------------------------------
        const res = await fetch(API_ENDPOINTS.LOGIN, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setAuthError(data.message || 'Invalid email or password');
          setIsSubmitting(false);
          return;
        }

        // Store JWT token
        if (data.token) {
          localStorage.setItem('hacksphere_token', data.token);
        }

        // Update global AuthContext with authenticated user details & role
        login({
          name: data.user?.name || email.split('@')[0],
          email: data.user?.email || email,
          role: data.user?.role || 'user',
          token: data.token,
        });

        setAuthSuccess(`Login successful as ${data.user?.role?.toUpperCase()}! Redirecting to Workspace...`);

        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      }
    } catch (err) {
      setAuthError('Backend server is offline. Please make sure start-server.bat is running on port 5000.');
      setIsSubmitting(false);
    }
  };

  const fillNormalUserDemo = () => {
    setIsRegister(false);
    setEmail('priyanka@hacksphere.com');
    setPassword('Password123');
    setAuthError('');
  };

  const fillAdminUserDemo = () => {
    setIsRegister(false);
    setEmail('admin@hacksphere.com');
    setPassword('Password123');
    setAuthError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-6 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        {/* Logo & Heading */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-sm">
            <Code2 className="w-6 h-6" />
          </div>
          <h2 className="mt-3 text-2xl font-extrabold text-slate-900 tracking-tight">
            {isRegister ? 'Create HackSphere Account' : 'Sign In to HackSphere'}
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Experiment 6: JWT Authentication & User/Admin Roles
          </p>
        </div>

        {/* Form Box */}
        <div className="bg-white py-8 px-6 sm:px-8 rounded-2xl border border-slate-200 shadow-sm">
          
          {/* Mode Switcher Tabs (Sign In / Register) */}
          <div className="grid grid-cols-2 p-1 mb-5 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setAuthError(''); setAuthSuccess(''); }}
              className={`py-2 rounded-md transition-all ${
                !isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setAuthError(''); setAuthSuccess(''); }}
              className={`py-2 rounded-md transition-all ${
                isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register (New User)
            </button>
          </div>

          {/* Quick Demo Autofill Buttons */}
          {!isRegister && (
            <div className="mb-5 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs">
              <span className="text-blue-800 font-semibold block mb-1.5">Quick Autofill Credentials:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fillNormalUserDemo}
                  className="px-2.5 py-1 bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 rounded font-medium text-[11px]"
                >
                  Normal User
                </button>
                <button
                  type="button"
                  onClick={fillAdminUserDemo}
                  className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 rounded font-medium text-[11px]"
                >
                  Admin User
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {authError && (
            <div className="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-800 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Success Banner */}
          {authSuccess && (
            <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4" noValidate>
            
            {/* Name Field (Register Only) */}
            {isRegister && (
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Priyanka"
                    className="w-full pl-9 pr-3 py-2 text-sm text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priyanka@hacksphere.com"
                  className="w-full pl-9 pr-3 py-2 text-sm text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-sm text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Selection (Register Only) */}
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Assign Account Role <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`py-2 px-3 border rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      role === 'user'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>User (Normal)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 border rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      role === 'admin'
                        ? 'border-amber-600 bg-amber-50 text-amber-800 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin (Manager)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                className="w-full justify-center"
                icon={ArrowRight}
                iconPosition="right"
              >
                {isSubmitting
                  ? (isRegister ? 'Registering...' : 'Signing in...')
                  : (isRegister ? 'Create Account' : 'Sign In')}
              </Button>
            </div>

          </form>

          {/* Card Footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Need quick access? </span>
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold">
              Enter as Guest Participant
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
