import React, { useState } from 'react';
import {
  FlameKindling,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import {
  signInWithSupabase,
  signUpSuperAdmin,
  isSupabaseConfigured,
  mapSupabaseUserToProfile
} from '../../lib/supabase';
import { db } from '../../lib/db';
import { UserProfile } from '../../types';

interface AuthScreenProps {
  onAuthenticated: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'signin' | 'setup'>('signin');

  // Sign In fields
  const [email, setEmail] = useState('zubair669262@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Setup fields
  const [setupFullName, setSetupFullName] = useState('Zubair');
  const [setupEmail, setSetupEmail] = useState('zubair669262@gmail.com');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [showSetupPassword, setShowSetupPassword] = useState(false);

  // Status & error handling
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isConfigured = isSupabaseConfigured();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    if (!isConfigured) {
      setErrorMessage('Authentication service is not configured.');
      return;
    }

    setIsLoading(true);

    try {
      // Real Supabase Authentication
      const result = await signInWithSupabase(email, password);

      if (result && result.user) {
        const profile = await mapSupabaseUserToProfile(result.user);
        db.setCurrentUser(profile);
        db.addAuditLog('LOGIN', 'Supabase Auth', `User ${profile.email} logged in successfully`, profile.id);
        onAuthenticated(profile);
      } else {
        setErrorMessage('Invalid email or password.');
      }
    } catch (err: any) {
      console.error('Sign In Error:', err);
      const rawMsg = err?.message || '';
      if (
        rawMsg.toLowerCase().includes('invalid login credentials') ||
        rawMsg.toLowerCase().includes('invalid_grant') ||
        rawMsg.toLowerCase().includes('email not confirmed') ||
        rawMsg.toLowerCase().includes('user not found') ||
        rawMsg.toLowerCase().includes('invalid')
      ) {
        setErrorMessage('Invalid email or password.');
      } else {
        setErrorMessage(rawMsg || 'Invalid email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupSuperAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!setupEmail.trim() || !setupPassword) {
      setErrorMessage('Please provide an email address and password.');
      return;
    }

    if (setupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (setupPassword !== setupConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (!isConfigured) {
      setErrorMessage('Authentication service is not configured.');
      return;
    }

    setIsLoading(true);

    try {
      // Create user in Supabase Auth
      const result = await signUpSuperAdmin(
        setupEmail,
        setupPassword,
        setupFullName || 'Admin User'
      );

      if (result && result.user) {
        setSuccessMessage('Admin credentials created successfully! Signing in...');
        setTimeout(async () => {
          try {
            const loginRes = await signInWithSupabase(setupEmail, setupPassword);
            if (loginRes && loginRes.user) {
              const profile = await mapSupabaseUserToProfile(loginRes.user);
              db.setCurrentUser(profile);
              db.addAuditLog('CREATE', 'Supabase Auth', `Initial super admin ${profile.email} registered`, profile.id);
              onAuthenticated(profile);
            } else {
              setMode('signin');
              setEmail(setupEmail);
            }
          } catch {
            setMode('signin');
            setEmail(setupEmail);
          }
        }, 1200);
      } else {
        setErrorMessage('Could not register account. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('Super Admin Setup Error:', err);
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('already registered')) {
        setErrorMessage('This user already exists in authentication. Please use Sign In.');
      } else {
        setErrorMessage(msg || 'Failed to initialize account.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col justify-center items-center p-6 selection:bg-orange-500 selection:text-white">
      <div className="w-full max-w-md">
        {/* Brand Icon & Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-sm mb-4">
            <FlameKindling className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            SIPPZO Admin
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to access your e-commerce management panel
          </p>
        </div>

        {/* Minimal Surface Card */}
        <div className="bg-white rounded-2xl shadow-premium border border-slate-200/80 p-7 sm:p-8 space-y-6">
          {/* Mode Switcher */}
          <div className="flex rounded-xl p-1 bg-slate-100 text-sm font-medium">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('setup');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'setup'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Setup Admin
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 text-rose-700 rounded-xl flex items-start gap-2.5 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-xl flex items-start gap-2.5 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Sign In Form */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-sm sm:text-base">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="zubair669262@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-lg text-slate-900 text-base focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('setup')}
                    className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    Need an account?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200/90 rounded-lg text-slate-900 text-base focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold text-base transition-colors shadow-sm disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          )}

          {/* Setup Admin Form */}
          {mode === 'setup' && (
            <form onSubmit={handleSetupSuperAdmin} className="space-y-4 text-sm sm:text-base">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={setupFullName}
                    onChange={(e) => setSetupFullName(e.target.value)}
                    placeholder="Zubair"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-lg text-slate-900 text-base focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={setupEmail}
                    onChange={(e) => setSetupEmail(e.target.value)}
                    placeholder="zubair669262@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-lg text-slate-900 text-base focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Create Password (min. 6 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showSetupPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={setupPassword}
                    onChange={(e) => setSetupPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200/90 rounded-lg text-slate-900 text-base focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSetupPassword(!showSetupPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showSetupPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showSetupPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={setupConfirmPassword}
                    onChange={(e) => setSetupConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-lg text-slate-900 text-base focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-base transition-colors shadow-sm disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating credentials...</span>
                  </>
                ) : (
                  <span>Register Super Admin</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
