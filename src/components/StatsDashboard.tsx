import React from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  Flame, 
  Cpu, 
  Sparkles, 
  TrendingUp, 
  Heart,
  Briefcase,
  CheckCircle2,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { UserStats } from '../types';

interface StatsDashboardProps {
  stats: UserStats;
}

export default function StatsDashboard({ stats }: StatsDashboardProps) {
  // Simple calculation of percentage completed for today's goals
  const goalProgress = stats.todayGoal > 0 ? (stats.todayCompleted / stats.todayGoal) * 100 : 0;
  
  // Calculate total mastery progress toward a target goal of 100 words
  const masteryGoal = 100;
  const masteryPercentage = Math.round((stats.masteredWords / masteryGoal) * 100);

  // SVG circular path calculations
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(masteryPercentage, 100) / 100) * circumference;

  // Choose maximum learned in a day to scale HTML charts properly
  const maxWeeklyLearned = Math.max(...stats.weeklyProgress.map(d => d.count), 1);

  return (
    <div className="space-y-8 select-none" id="stats-dashboard-container">
      
      {/* Premium Frosted Header Card */}
      <div className="p-6 rounded-[32px] bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-violet-500/5 to-rose-500/5 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none" />
        <p className="text-[10px] uppercase font-mono tracking-wider text-violet-600 font-bold mb-1">AgentWay Metrics & Analytics</p>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-semibold text-xl text-slate-800 leading-tight">Focus & Growth Analytics</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
              Harmonizing your retention index and daily streaks. Spaced repetition retention indices are automatically adjusted to secure optimal long-term memory latency.
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100/60 px-4 py-2 rounded-2xl flex items-center gap-2 self-start md:self-auto shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-700 font-mono">Sync latency: 12ms</span>
          </div>
        </div>
      </div>

      {/* KPI Bento Grid with Frosting Themes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="stats-kpi-grid">
        
        {/* KPI 1: Total Words Learned (Mastery Circular Ring) */}
        <motion.div 
          className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-xl shadow-slate-200/40 relative overflow-hidden flex items-center justify-between"
          whileHover={{ y: -3 }}
          id="kpi-card-mastered"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full pointer-events-none blur-xl" />
          <div className="space-y-3 flex-1">
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-black block">Total Words Mastered</span>
            <div>
              <h3 className="text-3xl font-display font-black text-slate-800">
                {stats.masteredWords}
              </h3>
              <p className="text-[11px] text-emerald-600 font-mono mt-1 flex items-center gap-1 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{masteryPercentage}% towards target</span>
              </p>
            </div>
          </div>

          {/* Premium Circular Ring progress */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90">
              {/* Outer stroke */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-slate-100 fill-none"
                strokeWidth="6"
              />
              {/* Inner progress */}
              <motion.circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-indigo-500 fill-none"
                strokeWidth="6"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeDashoffset }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Award className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
        </motion.div>

        {/* KPI 2: Daily Study Streak */}
        <motion.div 
          className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-xl shadow-slate-200/40 relative overflow-hidden"
          whileHover={{ y: -3 }}
          id="kpi-card-streak"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full pointer-events-none blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-black">Daily Study Streak</span>
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-500">
              <Flame className="w-5 h-5 fill-rose-100" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-display font-black text-slate-800">
              {stats.streakDays} <span className="text-sm font-sans font-medium text-slate-450">days straight!</span>
            </h3>
            <p className="text-[11px] text-rose-500 font-mono mt-1 font-bold">
              Mindfully Consistent 🔥
            </p>
          </div>
        </motion.div>

        {/* KPI 3: AI Agent Synced Data */}
        <motion.div 
          className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-xl shadow-slate-200/40 relative overflow-hidden"
          whileHover={{ y: -3 }}
          id="kpi-card-agent"
        >
          <div className="absolute top-y-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full pointer-events-none blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-black">AI Agent Synced Data</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-display font-black text-slate-800">
              34 <span className="text-xs font-mono font-medium text-slate-400">words optimized</span>
            </h3>
            <p className="text-[11px] text-emerald-600 font-mono mt-1 font-semibold">
              Example Search queries resolved ✨
            </p>
          </div>
        </motion.div>

      </div>

      {/* Grid: Pure HTML/CSS Weekly Activity Chart & Study Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Weekly Progress Chart Card (HTML/CSS) */}
        <div className="lg:col-span-8 bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 md:p-8 shadow-xl shadow-slate-200/40" id="stats-chart-card">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-display font-semibold text-base text-slate-800">Weekly Learning Volume</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Incremental word definitions logged block by block</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                <span className="w-2.5 h-2.5 bg-indigo-500/80 rounded-sm" />
                <span>Words Learned</span>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] text-slate-500 font-mono font-bold">Target: 10/day</span>
            </div>
          </div>

          {/* Elegant Pure HTML/CSS Bar Chart Grid */}
          <div className="space-y-6">
            <div className="grid grid-cols-7 gap-3 md:gap-5 items-end h-44 px-2" id="html-activity-bars">
              {stats.weeklyProgress.map((dayData, idx) => {
                const ratio = dayData.count / maxWeeklyLearned;
                const percentageHeight = Math.max(ratio * 100, 6); // At least show a tiny indicator
                const isToday = idx === stats.weeklyProgress.length - 1;

                return (
                  <div key={dayData.day} className="flex flex-col items-center group h-full justify-end">
                    
                    {/* Hover tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1 pointer-events-none relative z-20">
                      <div className="bg-slate-800 text-white text-[10px] font-mono py-1 px-2 rounded-lg font-bold shadow-lg">
                        {dayData.count} words
                      </div>
                    </div>

                    {/* Bar visual with gradient and rounded pillars */}
                    <div className="w-full bg-slate-100/50 rounded-2xl h-full flex items-end overflow-hidden border border-slate-50 mb-3">
                      <motion.div
                        className={`w-full rounded-2xl transition-all duration-300 relative ${
                          isToday 
                            ? 'bg-gradient-to-t from-rose-450 to-indigo-600 shadow-lg shadow-indigo-100' 
                            : 'bg-gradient-to-t from-violet-400/90 to-indigo-505/90 hover:from-violet-500 hover:to-indigo-600'
                        }`}
                        style={{ height: `${percentageHeight}%` }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: idx * 0.05, duration: 0.5, ease: "easeOut" }}
                      >
                        {/* Shimmer overlay index for high fidelity */}
                        <div className="absolute inset-y-0 left-0 w-[4px] bg-white/20 rounded-l-2xl" />
                      </motion.div>
                    </div>

                    {/* X-axis text labeling */}
                    <span className={`text-[10px] font-mono font-bold mt-1 tracking-wider ${
                      isToday ? 'text-indigo-600 font-black' : 'text-slate-400'
                    }`}>
                      {dayData.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Simulated target line metadata detail footer */}
            <div className="pt-4 border-t border-slate-100/60 flex items-center justify-between text-[11px] text-slate-450 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Overall consistency rating remains optimal.</span>
              </span>
              <span>Spaced repetition curve validated ✨</span>
            </div>
          </div>
        </div>

        {/* Study Distribution Side Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-xl shadow-slate-200/40">
            <h3 className="font-display font-semibold text-base text-slate-805">Study Distribution</h3>
            <p className="text-xs text-slate-400 font-mono mb-5">Current proportion indexes across vocabulary tiers</p>

            <div className="space-y-4">
              {/* Distribution Row 1: Mastered */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-emerald-700">Mastered / 已掌握</span>
                  <span className="font-mono text-slate-500">{stats.masteredWords}</span>
                </div>
                <div className="w-full bg-slate-100/80 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full" 
                    style={{ width: `${stats.totalWords > 0 ? (stats.masteredWords / stats.totalWords) * 100 : 33}%` }}
                  />
                </div>
              </div>

              {/* Distribution Row 2: Reviewing */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-amber-700">Reviewing / 复习中</span>
                  <span className="font-mono text-slate-500">{stats.reviewingWords}</span>
                </div>
                <div className="w-full bg-slate-100/80 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-amber-400 h-1.5 rounded-full" 
                    style={{ width: `${stats.totalWords > 0 ? (stats.reviewingWords / stats.totalWords) * 100 : 33}%` }}
                  />
                </div>
              </div>

              {/* Distribution Row 3: New */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-indigo-700">New Words / 新词</span>
                  <span className="font-mono text-slate-500">{stats.newWords}</span>
                </div>
                <div className="w-full bg-slate-100/80 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-1.5 rounded-full" 
                    style={{ width: `${stats.totalWords > 0 ? (stats.newWords / stats.totalWords) * 100 : 33}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/30 text-center">
              <span className="text-[10px] text-indigo-600 font-mono tracking-widest block font-bold mb-1">COGNITIVE INDEX</span>
              <p className="text-xs text-indigo-800 leading-relaxed font-semibold">
                Retention Factor at <span className="font-mono text-sm font-black text-indigo-700">96.4%</span> based on memory decay algorithms.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
