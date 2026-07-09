import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuthStore, { User } from '@base/stores/useAuthStore';
import { apiFetch } from '@base/utils/api';
import toast, { Toaster } from 'react-hot-toast';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function LoginPage() {
  const router = useRouter();
  const loginStore = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  // Check for Google OAuth callback code in URL query parameters
  useEffect(() => {
    if (router.isReady && router.query.code) {
      const code = router.query.code as string;
      router.replace('/login', undefined, { shallow: true });
      handleGoogleCallback(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.code]);

  const handleGoogleCallback = async (code: string) => {
    setIsLoading(true);
    try {
      const redirectUri = window.location.origin + '/login';
      const authData = await apiFetch<{
        access_token: string;
        refresh_token: string;
        token_type: string;
        user: User;
      }>('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ code, redirect_uri: redirectUri }),
      });

      // Temporary save tokens for /auth/me or direct state update
      const tempStorage = {
        state: {
          token: authData.access_token,
          refreshToken: authData.refresh_token,
          user: authData.user,
        },
      };
      localStorage.setItem('auth-storage', JSON.stringify(tempStorage));

      // Save full auth state
      loginStore(authData.access_token, authData.refresh_token, authData.user);

      toast.success(`Welcome back, ${authData.user.name || authData.user.email}!`);
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Google authentication failed.');
      triggerErrorEffect();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginClick = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '552554370197-dkds9950o1bloeblvqiuar949rpodqr4.apps.googleusercontent.com';
    const redirectUri = window.location.origin + '/login';
    const scope = 'openid email profile';
    const responseType = 'code';

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

    window.location.href = googleAuthUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email and password are required.');
      triggerErrorEffect();
      return;
    }

    setIsLoading(true);
    try {
      // 1. Call Auth Login
      const authData = await apiFetch<{
        access_token: string;
        refresh_token: string;
        token_type: string;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Temporary save tokens to let subsequent /auth/me call authenticate
      const tempStorage = {
        state: {
          token: authData.access_token,
          refreshToken: authData.refresh_token,
          user: null,
        },
      };
      localStorage.setItem('auth-storage', JSON.stringify(tempStorage));

      // 2. Fetch User Info
      const profileData = await apiFetch<User>('/auth/me');

      // 3. Save full auth state
      loginStore(authData.access_token, authData.refresh_token, profileData);

      toast.success(`Welcome back, ${profileData.name || profileData.email}!`);

      // Redirect home
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Incorrect email or password.');
      triggerErrorEffect();
      // Cleanup temporary storage on error
      localStorage.removeItem('auth-storage');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerErrorEffect = () => {
    setErrorShake(true);
    setTimeout(() => setErrorShake(false), 500);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden font-sans select-none">
      {/* Background Glowing Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-blue-600/15 blur-[150px] pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <div
        className={`relative z-10 w-full max-w-[420px] bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl p-8 transition-transform duration-300 ${errorShake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
      >
        {/* Glow Header Border Line */}
        <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-[1px]" />

        {/* Brand/Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 shadow-[0_0_15px_rgba(59,130,246,0.5)] mb-3 transition-transform hover:scale-105 duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 font-sans tracking-wide">
            AI Navigator
          </h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to your workplace account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative group">
              <input
                id="login-email"
                type="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full h-11 bg-slate-950/40 border border-slate-800/80 rounded-lg pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
                  <polyline points="22,9 12,15 2,9" />
                </svg>
              </div>
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative group">
              <input
                id="login-password"
                type="password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 bg-slate-950/40 border border-slate-800/80 rounded-lg pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-[#5570f6] text-white font-semibold text-sm rounded-lg hover:bg-[#395ce0] focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-[0_4px_12px_rgba(85,112,246,0.3)] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center justify-between my-4">
            <span className="w-1/5 border-b border-slate-800/80"></span>
            <span className="text-xs text-slate-500 uppercase font-semibold">Or continue with</span>
            <span className="w-1/5 border-b border-slate-800/80"></span>
          </div>

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleLoginClick}
            disabled={isLoading}
            className="w-full h-11 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 text-slate-200 font-semibold text-sm rounded-lg hover:border-slate-700 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-3"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </form>
      </div>

      {/* Toast Notification Container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Embedded Shake Animation Style */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'ja', ['common'])),
    },
  };
}
