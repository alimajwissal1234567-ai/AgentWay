import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Wifi, WifiOff, User, LogIn, Send, Menu, X } from 'lucide-react';
import { UserProfile, TelegramSettings } from '../types';

interface NavbarProps {
  user: UserProfile;
  telegram: TelegramSettings;
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export default function Navbar({
  user,
  telegram,
  activeView,
  setActiveView,
  onOpenMobileMenu,
  isMobileMenuOpen
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/20 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Brand Logo and Title */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button 
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-brand-dark/70 hover:text-brand-dark hover:bg-white/40 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
          id="btn-mobile-menu-toggle"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <motion.div 
          onClick={() => setActiveView('learn')}
          className="flex items-center gap-2 cursor-pointer group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          id="brand-logo-container"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-rose-400 flex items-center justify-center shadow-md p-[1px]">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight bg-gradient-to-br from-violet-600 to-coral-500 bg-clip-text text-transparent">
              AgentWay AI
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 hidden sm:block">Mindful Learning Assistant</p>
          </div>
        </motion.div>
      </div>

      {/* Connection Indicator & Account Status */}
      <div className="flex items-center gap-4">
        {/* Telegram Status Pill */}
        <motion.div 
          onClick={() => setActiveView('telegram')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border cursor-pointer transition-all duration-300 ${
            telegram.isConnected 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50 hover:bg-emerald-100' 
              : 'bg-rose-50 text-rose-700 border-rose-200/50 hover:bg-rose-100'
          }`}
          whileHover={{ y: -1 }}
          id="telegram-connection-status-pill"
        >
          {telegram.isConnected ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Send className="w-3.5 h-3.5 text-emerald-600 hidden xs:inline" />
              <span>OpenClaw Synced</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-rose-400"></span>
              <WifiOff className="w-3.5 h-3.5 text-rose-400 hidden xs:inline" />
              <span>Telegram Offline</span>
            </>
          )}
        </motion.div>

        {/* User Profile Badge */}
        <div 
          onClick={() => setActiveView(user.isLoggedIn ? 'stats' : 'login')}
          className="flex items-center gap-2.5 pl-2 border-l border-brand-dark/10 cursor-pointer hover:opacity-90 transition-opacity"
          id="user-profile-nav-trigger"
        >
          <div className="relative">
            {user.isLoggedIn ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                referrerPolicy="no-referrer"
                className="w-8, h-8 rounded-full border border-violet-200 shadow-sm object-cover"
                style={{ width: '32px', height: '32px' }}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                <User className="w-4 h-4 text-gray-500" />
              </div>
            )}
            {user.isLoggedIn && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full"></span>
            )}
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-xs font-semibold text-brand-dark leading-tight">
              {user.isLoggedIn ? user.name : 'Guest Learner'}
            </p>
            <p className="text-[10px] text-gray-400 leading-tight">
              {user.isLoggedIn ? user.email : 'Log in to sync progress'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
