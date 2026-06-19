import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Compass, Sparkles, AlertCircle } from 'lucide-react';
import { User } from '../types.js';

interface AuthProps {
  onAuthSuccess: (token: string, user: User) => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setError(null);
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onAuthSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-4 relative overflow-hidden" id="auth-screen">
      {/* Aesthetic decorative background layout */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#4A6741]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F2EDE7]/60 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Container */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="p-3 bg-[#4A6741] rounded-2xl shadow-md mb-3 inline-flex">
            <Compass className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-serif text-[#2C2C2C] mb-2 flex items-center gap-1.5 font-medium">
            RoamAgent <Sparkles className="w-5 h-5 text-[#4A6741] fill-[#4A6741]/20" />
          </h1>
          <p className="text-[#6B6B6B] text-sm max-w-xs text-center font-sans">
            AI-powered travel plans, budget estimates, and real-time expense tracking.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#E6E2DD] rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-serif font-medium text-[#2C2C2C] mb-6">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs flex items-start gap-2"
                id="auth-error-alert"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#4A6741] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  placeholder="alex.rivers@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E6E2DD] focus:border-[#4A6741] focus:ring-1 focus:ring-[#4A6741] rounded-xl py-2.5 pl-10 pr-4 text-[#2C2C2C] text-sm outline-none transition-all shadow-sm"
                />
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8E8E8E]" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#4A6741] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E6E2DD] focus:border-[#4A6741] focus:ring-1 focus:ring-[#4A6741] rounded-xl py-2.5 pl-10 pr-4 text-[#2C2C2C] text-sm outline-none transition-all shadow-sm"
                />
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8E8E8E]" />
              </div>
              {!isLogin && (
                <p className="text-[#8E8E8E] text-[11px] mt-1 pr-1">
                  Must be at least 5 characters long.
                </p>
              )}
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#4A6741] hover:bg-[#3d5435] text-white font-medium text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle View */}
          <div className="mt-6 pt-5 border-t border-[#E6E2DD] text-center text-xs text-[#6B6B6B]">
            {isLogin ? "Don't have an account?" : "Already signed up?"}{' '}
            <button
              id="auth-toggle-btn"
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-[#4A6741] hover:text-[#3d5435] font-semibold cursor-pointer underline transition-colors"
            >
              {isLogin ? 'Sign up free' : 'Sign in here'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
