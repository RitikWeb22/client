import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithCredentials, registerWithCredentials, loginWithGoogle, loginDemo, isAuthenticated } = useAuth();

  const [isSignUp, setIsSignUp] = useState(location.pathname === '/register' || location.search.includes('signup'));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isSignUp) {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
    }

    try {
      setLoading(true);
      if (isSignUp) {
        await registerWithCredentials(name, email, password);
      } else {
        await loginWithCredentials(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDemoLogin = async (role) => {
    try {
      await loginDemo(role);
      if (role === 'admin') navigate('/admin');
      else navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-neutral-200 p-8 shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <span className="font-serif text-2xl font-bold tracking-widest text-neutral-900 uppercase">
            MAISON VOGUE
          </span>
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
            PARIS — ATELIER ACCESS
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
              !isSignUp ? 'border-b-2 border-black text-black' : 'text-neutral-400 hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
              isSignUp ? 'border-b-2 border-black text-black' : 'text-neutral-400 hover:text-black'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {isSignUp && (
            <div>
              <label className="block text-neutral-700 font-bold uppercase mb-1">Full Name *</label>
              <div className="flex items-center border border-neutral-300 px-3 py-2 focus-within:border-black">
                <User className="h-4 w-4 text-neutral-400 mr-2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sophia Laurent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs outline-none bg-transparent"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-neutral-700 font-bold uppercase mb-1">Email Address *</label>
            <div className="flex items-center border border-neutral-300 px-3 py-2 focus-within:border-black">
              <Mail className="h-4 w-4 text-neutral-400 mr-2" />
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs outline-none bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-bold uppercase mb-1">Password *</label>
            <div className="flex items-center border border-neutral-300 px-3 py-2 focus-within:border-black">
              <Lock className="h-4 w-4 text-neutral-400 mr-2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs outline-none bg-transparent"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-neutral-700 font-bold uppercase mb-1">Confirm Password *</label>
              <div className="flex items-center border border-neutral-300 px-3 py-2 focus-within:border-black">
                <Lock className="h-4 w-4 text-neutral-400 mr-2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs outline-none bg-transparent"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-neutral-900 text-white font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Processing...' : isSignUp ? 'Create MAISON VOGUE Account' : 'Sign In'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative border-t border-neutral-200 pt-4 text-center">
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] uppercase font-bold text-neutral-400">
            OR CONTINUE WITH
          </span>
        </div>

        {/* Google OAuth Button */}
        <div className="flex justify-center pt-2">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.warn('Google OAuth error')}
            text={isSignUp ? 'signup_with' : 'signin_with'}
            theme="outline"
            shape="square"
          />
        </div>

     

      </div>
    </div>
  );
}
