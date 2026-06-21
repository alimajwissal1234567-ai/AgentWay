import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, 
  Mail, 
  Sparkles, 
  Key, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight, 
  User, 
  CheckCircle,
  HelpCircle,
  Send,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginViewProps {
  onLoginSuccess: (email: string, name: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState<string>('');
  const [signInPassword, setSignInPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  
  // Sign Up inputs
  const [signUpName, setSignUpName] = useState<string>('');
  const [signUpEmail, setSignUpEmail] = useState<string>('');
  const [signUpPassword, setSignUpPassword] = useState<string>('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [authType, setAuthType] = useState<'standard' | 'telegram' | 'openclaw'>('standard');

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!signInEmail || !signInPassword) {
      setError('Please fill in your login credentials.');
      return;
    }

    if (!signInEmail.includes('@')) {
      setError('A valid email address is required.');
      return;
    }

    setAuthType('standard');
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      // Pre-extract name from email for realistic sync experience
      const extractedName = signInEmail.split('@')[0];
      const capitalized = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
      setSuccessMsg('Successfully authenticated!');
      
      setTimeout(() => {
        onLoginSuccess(signInEmail, `${capitalized} Learner`);
      }, 800);
    }, 1200);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!signUpName || !signUpEmail || !signUpPassword || !signUpConfirmPassword) {
      setError('Please fill in all registration fields.');
      return;
    }

    if (!signUpEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (signUpPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setAuthType('standard');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Account created successfully! Preparing your AgentWay workspace...');
      
      setTimeout(() => {
        onLoginSuccess(signUpEmail, signUpName);
      }, 1000);
    }, 1500);
  };

  const handleEcosystemLogin = (provider: 'telegram' | 'openclaw') => {
    setError('');
    setSuccessMsg('');
    setLoading(true);
    setAuthType(provider);

    setTimeout(() => {
      setLoading(false);
      if (provider === 'telegram') {
        setSuccessMsg('Simulated Telegram Handshake Complete.');
        setTimeout(() => {
          onLoginSuccess('tg_member_9812@telegram.org', 'Telegram Scholar');
        }, 800);
      } else {
        setSuccessMsg('Handed off session to OpenClaw IAM OAuth gateway...');
        setTimeout(() => {
          onLoginSuccess('openclaw_user_872@openclaw.im', 'AgentWay Architect');
        }, 800);
      }
    }, 1500);
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-180px)] items-center justify-center p-4 md:p-8" id="login-panel-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white/75 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 md:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative ambient gradients matching the mindful theme */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-rose-500/10 to-transparent rounded-full -ml-10 -mb-10 blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-rose-400 flex items-center justify-center text-white mx-auto shadow-md">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="font-display font-bold text-2xl tracking-tight text-slate-800">
            AgentWay AI
          </h2>
          <p className="text-xs text-slate-500 font-mono tracking-wide">
            Mindful Spaces & Smart Cognitive Workflows
          </p>
        </div>

        {/* Dual-Tab Toggle Navigation */}
        <div className="flex p-1 bg-slate-100/80 backdrop-blur-md rounded-2xl mb-6 relative z-10" id="login-tabs">
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-white text-violet-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => {
              setActiveTab('signin');
              setError('');
              setSuccessMsg('');
            }}
            id="tab-sign-in"
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-white text-violet-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => {
              setActiveTab('signup');
              setError('');
              setSuccessMsg('');
            }}
            id="tab-create-account"
          >
            Create Account
          </button>
        </div>

        {/* Error notification banner */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 mb-5 rounded-2xl bg-rose-50 text-rose-700 text-xs border border-rose-100 flex items-start gap-2.5 relative z-10"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{error}</span>
          </motion.div>
        )}

        {/* Success notification banner */}
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 mb-5 rounded-2xl bg-emerald-50 text-emerald-700 text-xs border border-emerald-100 flex items-start gap-2.5 relative z-10"
          >
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{successMsg}</span>
          </motion.div>
        )}

        {/* Loading Spinner Screen */}
        {loading ? (
          <div className="py-12 text-center space-y-4 relative z-10">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-500">
              {authType === 'openclaw' && 'Handing off session to OpenClaw IAM OAuth gateway...'}
              {authType === 'telegram' && 'Authorizing through secure Telegram socket handshaking...'}
              {authType === 'standard' && 'Verifying credentials against AgentWay DB encryption layers...'}
            </p>
          </div>
        ) : (
          <div className="relative z-10">
            
            {/* SIGN IN TAB */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                
                {/* Email / Username Input */}
                <div className="space-y-1 group">
                  <label className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-black block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-violet-650 transition-colors" />
                    <input
                      type="email"
                      required
                      placeholder="learner@agentway.ai"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 focus:bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 focus:outline-none transition-all font-sans"
                      id="signin-email"
                    />
                  </div>
                </div>

                {/* Password Input with show button */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-black block">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert("Simulation Code: Simply enter any email and a mock password to authenticate instantly!")}
                      className="text-[10px] text-violet-600 font-mono font-bold hover:underline cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 focus:bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 focus:outline-none transition-all font-sans"
                      id="signin-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me and Checkbox */}
                <div className="flex items-center justify-between py-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-500 font-medium">Remember me on this applet</span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-2xl cursor-pointer flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-900/10 mt-1"
                  id="btn-signin-submit"
                >
                  <span>Initialize Workspace Session</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* CREATE ACCOUNT TAB */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                
                {/* Full Name Input */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-black block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Wissal Alimaj"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 focus:bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 focus:outline-none transition-all font-sans"
                      id="signup-name"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-black block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="learner@agentway.ai"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 focus:bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 focus:outline-none transition-all font-sans"
                      id="signup-email"
                    />
                  </div>
                </div>

                {/* Passwords side by side or vertical */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-black block">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Min 6 chars"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50/50 focus:bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 focus:outline-none transition-all font-sans"
                      id="signup-password"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-black block">
                      Confirm Key
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50/50 focus:bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 focus:outline-none transition-all font-sans"
                      id="signup-confirm-password"
                    />
                  </div>
                </div>

                {/* Agreement checkbox */}
                <div className="py-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer mt-0.5"
                    />
                    <span className="text-[11px] text-slate-500 leading-normal font-medium">
                      I agree to the <span className="text-violet-600 hover:underline">Terms of Service</span> & <span className="text-violet-600 hover:underline">Privacy framework</span>
                    </span>
                  </label>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-2xl cursor-pointer flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-900/10 mt-1"
                  id="btn-signup-submit"
                >
                  <span>Establish Account Space</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Separator line */}
            <div className="relative flex items-center justify-center py-4">
              <span className="absolute w-full border-t border-slate-100" />
              <span className="relative bg-white/75 px-3 text-[10px] text-slate-400 uppercase font-mono tracking-wider font-semibold">
                Or Connect Ecosystem
              </span>
            </div>

            {/* Combined/Beautiful Ecosystem Shortcuts */}
            <div className="grid grid-cols-2 gap-3" id="ecosystem-shortcuts">
              <button
                onClick={() => handleEcosystemLogin('telegram')}
                type="button"
                className="py-2.5 px-3 bg-sky-50 hover:bg-sky-100/80 border border-sky-100/60 text-sky-700 font-bold text-[11px] rounded-2xl cursor-pointer flex items-center justify-center gap-1.5 transition-all text-ellipsis overflow-hidden whitespace-nowrap"
                id="btn-login-telegram"
              >
                <Send className="w-3.5 h-3.5 fill-sky-500/20" />
                <span>Telegram Gateway</span>
              </button>

              <button
                onClick={() => handleEcosystemLogin('openclaw')}
                type="button"
                className="py-2.5 px-3 bg-violet-50 hover:bg-violet-100/80 border border-violet-100/60 text-violet-700 font-bold text-[11px] rounded-2xl cursor-pointer flex items-center justify-center gap-1.5 transition-all text-ellipsis overflow-hidden whitespace-nowrap"
                id="btn-login-openclaw"
              >
                <ShieldCheck className="w-3.5 h-3.5 fill-violet-500/20" />
                <span>OpenClaw OAuth</span>
              </button>
            </div>

          </div>
        )}

        {/* Footer info text */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 font-mono leading-relaxed select-none">
          AgentWay AI adheres to the OpenClaw IAM secure telemetry framework. Sessions are locked using local secure key standards.
        </div>
      </motion.div>
    </div>
  );
}
