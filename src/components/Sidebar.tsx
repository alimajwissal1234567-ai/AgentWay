import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  History, 
  BarChart3, 
  Send, 
  Lock, 
  LogOut, 
  Sparkles,
  Heart,
  UserCheck,
  ChevronRight,
  Info,
  X,
  Brain,
  ShieldCheck
} from 'lucide-react';
import { UserProfile, TelegramSettings, UserStats } from '../types';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  user: UserProfile;
  telegram: TelegramSettings;
  stats: UserStats;
  onLogout: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({
  activeView,
  setActiveView,
  user,
  telegram,
  stats,
  onLogout,
  isMobileOpen,
  onCloseMobile
}: SidebarProps) {
  
  const navItems = [
    { id: 'learn', label: 'Flashcards & Learn', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50/60' },
    { id: 'quiz', label: 'Vocabulary Quiz', icon: Brain, color: 'text-violet-600 bg-violet-50/60' },
    { id: 'history', label: 'History & Review', icon: History, color: 'text-sunset-coral bg-rose-50/60' },
    { id: 'stats', label: 'Statistics & Progress', icon: BarChart3, color: 'text-emerald-600 bg-emerald-50/60' },
    { id: 'telegram', label: 'Telegram Bot Sync', icon: Send, color: 'text-sky-600 bg-sky-50/60' },
  ];

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    onCloseMobile();
  };

  const SidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 md:p-6 select-none">
      {/* Upper Section */}
      <div className="space-y-6">
        {/* Welcome Premium Frosted Card */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-4 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <p className="text-[10px] uppercase font-mono tracking-wider text-indigo-600/90 font-bold mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-pulse text-indigo-500" /> Mindful Learning Assistant
          </p>
          <h3 className="font-display font-bold text-sm text-brand-dark leading-tight">
            AgentWay AI
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Take a deep breath. Today is a great day to expand your knowledge.
          </p>
          <div className="mt-3.5 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-white/30 pt-2.5">
            <span>Streak: <strong className="text-indigo-600 font-bold font-sans">🔥 {stats.streakDays} days</strong></span>
            <span>Mastered: <strong className="text-violet-600 font-bold font-sans">{stats.masteredWords}/{stats.totalWords}</strong></span>
          </div>
        </div>

        {/* Navigation Items with Frosted Glass touch */}
        <nav className="space-y-2" id="sidebar-nav-container">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const IconComponent = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-display text-sm leading-none group cursor-pointer ${
                  isActive 
                    ? 'bg-white/60 text-indigo-600 font-semibold shadow-sm border border-white/50' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                }`}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                id={`nav-item-${item.id}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-transform group-hover:scale-105 ${item.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="sidebar-active-indicator">
                    <ChevronRight className="w-4 h-4 text-indigo-500/60" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="space-y-3 pt-6 border-t border-white/30">
        {user.isLoggedIn ? (
          <div className="space-y-2.5">
            {/* User Details */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-white/60 overflow-hidden">
                <img src={user.avatarUrl} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-brand-dark truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">Agent Synced</p>
              </div>
            </div>
            {/* Logout Trigger */}
            <button
              onClick={() => {
                onLogout();
                handleNavClick('login');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50/50 hover:text-rose-700 transition-all font-medium cursor-pointer"
              id="btn-sidebar-logout"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Account</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleNavClick('login')}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold font-display shadow-sm transition-all text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer`}
            id="btn-sidebar-login-prompt"
          >
            <Lock className="w-4 h-4" />
            <span>Login Workspace</span>
          </button>
        )}

        {/* Motivational Footer Note */}
        <p className="text-[10px] text-slate-400/80 text-center flex items-center justify-center gap-1">
          Made for <Heart className="w-2.5 h-2.5 text-coral-500 fill-coral-500" /> stress-free cognitive growth
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 h-[calc(100vh-73px)] border-r border-white/40 bg-[#E9EFEF]/50 backdrop-blur-md sticky top-[73px] overflow-y-auto">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer (AnimatePresence) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-[#E9EFEF]/95 backdrop-blur-xl border-r border-white/50 z-50 md:hidden shadow-2xl flex flex-col pt-4 overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 pb-2 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display font-bold text-base text-brand-dark">AgentWay Menu</span>
                </div>
                <button 
                  onClick={onCloseMobile}
                  className="p-1 rounded bg-white/40 hover:bg-white/60 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                {SidebarContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
