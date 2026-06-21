/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserCheck, Sparkles, Send } from 'lucide-react';
import { VocabularyWord, TelegramSettings, UserStats, UserProfile } from './types';
import { useTelegramSocket } from './hooks/useTelegramSocket';

// Child components imports
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LearnView from './components/LearnView';
import QuizView from './components/QuizView';
import HistoryView from './components/HistoryView';
import StatsDashboard from './components/StatsDashboard';
import LoginView from './components/LoginView';
import TelegramSync from './components/TelegramSync';

// Predefined initial words database to offer structured learning outcomes out-of-the-box
const INITIAL_WORDS: VocabularyWord[] = [
  {
    id: 'word-1',
    word: 'paradigm',
    phonetic: '/ˈpærədaɪm/',
    partOfSpeech: 'n.',
    chineseMeaning: '范式，典范，极其典型的示例',
    synonyms: ['model', 'archetype', 'prototype', 'framework'],
    antonyms: ['anomaly', 'aberration', 'deviation'],
    collocations: ['paradigm shift', 'dominant paradigm', 'shifting paradigms'],
    aiSection: {
      exampleSentence: 'The evolution of LLMs has triggered an immense paradigm shift in cognitive computing workflows.',
      exampleTranslation: '大语言模型的演进激发了认知计算工作流中巨大的范式转换。',
      sourcePub: 'Reuters Science',
      sourceUrl: 'https://reuters.com'
    },
    status: 'new',
    dateAdded: '2026-06-18',
    timesReviewed: 0
  },
  {
    id: 'word-2',
    word: 'synthesize',
    phonetic: '/ˈsɪnθəsaɪz/',
    partOfSpeech: 'v.',
    chineseMeaning: '合成，综合，人工精制',
    synonyms: ['integrate', 'blend', 'unify', 'combine'],
    antonyms: ['dissect', 'disassemble', 'separate'],
    collocations: ['synthesize findings', 'synthesize raw materials', 'system synthesis'],
    aiSection: {
      exampleSentence: 'The OpenClaw agent digests multiple field feeds to synthesize a coherent summary outline.',
      exampleTranslation: 'OpenClaw 智能体消化多个实地反馈，以合成一个连贯的意见摘要。',
      sourcePub: 'TechCrunch',
      sourceUrl: 'https://techcrunch.com'
    },
    status: 'reviewing',
    dateAdded: '2026-06-19',
    timesReviewed: 1
  },
  {
    id: 'word-3',
    word: 'cohesive',
    phonetic: '/koʊˈhiːsɪv/',
    partOfSpeech: 'adj.',
    chineseMeaning: '凝聚的，有结合力的，紧密相关的',
    synonyms: ['unified', 'connected', 'tenacious', 'adherent'],
    antonyms: ['disjointed', 'fragmented', 'loose'],
    collocations: ['cohesive structure', 'cohesive argument', 'cohesive community'],
    aiSection: {
      exampleSentence: 'A cohesive user profile design merges stress-free colors into a responsive desktop footprint.',
      exampleTranslation: '高凝聚性用户界面的设计将轻松的色调融入高响应性的桌面布局中。',
      sourcePub: 'Nature Intelligence',
      sourceUrl: 'https://nature.com'
    },
    status: 'mastered',
    dateAdded: '2026-06-20',
    timesReviewed: 3
  },
  {
    id: 'word-4',
    word: 'cognitive',
    phonetic: '/ˈkɒɡnɪtɪv/',
    partOfSpeech: 'adj.',
    chineseMeaning: '认知的，感知的，有认识能力的',
    synonyms: ['intellectual', 'cerebral', 'mental'],
    antonyms: ['somatic', 'physical', 'unconscious'],
    collocations: ['cognitive capability', 'cognitive psychology', 'cognitive overhead'],
    aiSection: {
      exampleSentence: 'Reducing cognitive overhead during intense preparation is critical to language acquisition speed.',
      exampleTranslation: '在进行高强度训练时降低认知过载对于语言习得速度至关重要。',
      sourcePub: 'BBC Science',
      sourceUrl: 'https://bbc.com'
    },
    status: 'new',
    dateAdded: '2026-06-21',
    timesReviewed: 0
  },
  {
    id: 'word-5',
    word: 'empirical',
    phonetic: '/ɪmˈpɪrɪkl/',
    partOfSpeech: 'adj.',
    chineseMeaning: '凭经验的，实证的，基于观测的',
    synonyms: ['observational', 'factual', 'experimental'],
    antonyms: ['theoretical', 'speculative', 'conjectural'],
    collocations: ['empirical evidence', 'empirical analysis', 'empirical study'],
    aiSection: {
      exampleSentence: 'The developer presented empirical benchmarks confirming connection sync speeds were stable.',
      exampleTranslation: '开发者展示了实证基准数据，证实了连接同步速度是稳定的。',
      sourcePub: 'WIRED',
      sourceUrl: 'https://wired.com'
    },
    status: 'reviewing',
    dateAdded: '2026-06-21',
    timesReviewed: 2
  }
];

export default function App() {
  // Navigation active view state
  const [activeView, setActiveView] = useState<string>('learn');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Core Vocabulary Database state
  const [words, setWords] = useState<VocabularyWord[]>(() => {
    const saved = localStorage.getItem('agentway_words_store');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached vocabulary stack', e);
      }
    }
    return INITIAL_WORDS;
  });

  // Synchronization profile structure
  const [telegramSettings, setTelegramSettings] = useState<TelegramSettings>(() => {
    const saved = localStorage.getItem('agentway_tele_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      botToken: '718910419:AAFwX42eFqwK891eFqwK891eFkWk_MockToken',
      webhookUrl: 'https://api.openclaw.im/webhook/tele_user_81726',
      isConnected: true, // Defaulting to true so they see live webhook sync immediately!
      botUsername: 'AgentWayVocabularyBot'
    };
  });

  // User details
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('agentway_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      email: 'alimajwissal1234567@gmail.com',
      name: 'Wissal Alimaj',
      isLoggedIn: true,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150'
    };
  });

  // Action: Save database states to localStorage
  useEffect(() => {
    localStorage.setItem('agentway_words_store', JSON.stringify(words));
  }, [words]);

  useEffect(() => {
    localStorage.setItem('agentway_tele_settings', JSON.stringify(telegramSettings));
  }, [telegramSettings]);

  useEffect(() => {
    localStorage.setItem('agentway_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Hook Callback: Handle incoming webhook word updates from Telegram socket simulation
  const handleWordSyncedFromTelegram = useCallback((newWordItem: VocabularyWord) => {
    setWords((prev) => {
      // Avoid duplicate vocabulary words
      const exists = prev.some(w => w.word.toLowerCase() === newWordItem.word.toLowerCase());
      if (exists) return prev;
      return [newWordItem, ...prev];
    });

    // Display a beautiful interactive user-facing visual notification
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-5 right-5 z-50 p-4 rounded-xl bg-gradient-to-r from-inviting-violet to-indigo-600 text-white shadow-xl flex items-center gap-3 transition-all transform translate-y-10 opacity-0 pointer-events-none duration-500 border border-indigo-250';
    toast.style.width = '340px';
    toast.innerHTML = `
      <div class="p-1.5 bg-white/20 rounded-lg shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send animate-bounce"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </div>
      <div>
        <h4 class="font-bold text-xs">Synced from Bot!</h4>
        <p class="text-[11px] text-white/85 font-mono">Word <b>${newWordItem.word.toUpperCase()}</b> added.</p>
      </div>
    `;
    document.body.appendChild(toast);
    
    // Slide up animation sequence
    setTimeout(() => {
      toast.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
    }, 100);

    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none');
      setTimeout(() => toast.remove(), 600);
    }, 4500);

  }, []);

  // Initialize Custom Hook for Telegram WebSocket connectivity
  const {
    isSocketConnected,
    logs,
    connectSocket,
    disconnectSocket,
    simulateTelegramIncomingWord,
    clearLogs
  } = useTelegramSocket(telegramSettings, handleWordSyncedFromTelegram);

  // Action Handlers
  const handleAddWord = (wordData: Omit<VocabularyWord, 'id' | 'dateAdded' | 'status' | 'timesReviewed'>) => {
    const commitItem: VocabularyWord = {
      ...wordData,
      id: `word-${Math.random().toString(36).substring(7)}`,
      status: 'new',
      dateAdded: new Date().toISOString().split('T')[0],
      timesReviewed: 0
    };
    setWords((prev) => [commitItem, ...prev]);
  };

  const handleUpdateStatus = (id: string, status: 'new' | 'reviewing' | 'mastered') => {
    setWords((prev) => prev.map(w => w.id === id ? { ...w, status } : w));
  };

  const handleDeleteWord = (id: string) => {
    setWords((prev) => prev.filter(w => w.id !== id));
  };

  const handleReviewRating = (id: string, rating: 'hard' | 'good' | 'easy') => {
    setWords((prev) => prev.map(w => {
      if (w.id === id) {
        const currentReviews = w.timesReviewed + 1;
        let newStatus: 'new' | 'reviewing' | 'mastered' = w.status;
        
        // Simulating progressive Spaced Repetition mastery intervals
        if (rating === 'easy') {
          newStatus = 'mastered';
        } else if (rating === 'good') {
          newStatus = 'reviewing';
        } else {
          newStatus = 'reviewing';
        }

        return {
          ...w,
          timesReviewed: currentReviews,
          status: newStatus,
          lastReviewed: new Date().toISOString().split('T')[0]
        };
      }
      return w;
    }));
  };

  const handleLoginSuccess = (email: string, name: string) => {
    setUserProfile({
      email,
      name,
      isLoggedIn: true,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150'
    });
    setActiveView('learn');
  };

  const handleLogout = () => {
    setUserProfile({
      email: '',
      name: '',
      isLoggedIn: false,
      avatarUrl: ''
    });
    setActiveView('login');
  };

  const handleUpdateTelegramSettings = (updates: Partial<TelegramSettings>) => {
    setTelegramSettings((prev) => ({ ...prev, ...updates }));
  };

  // Derive Statistics dynamically to feed Analytics Dashboard
  const stats: UserStats = useMemo(() => {
    const total = words.length;
    const mastered = words.filter(w => w.status === 'mastered').length;
    const reviewing = words.filter(w => w.status === 'reviewing').length;
    const news = words.filter(w => w.status === 'new').length;

    // Simulated weekly progress stats (e.g. daily insertions counts count)
    const dailyCounts: { [key: string]: number } = {
      'Mon': 1, 'Tue': 3, 'Wed': 0, 'Thu': 4, 'Fri': 2, 'Sat': news, 'Sun': mastered
    };
    const weeklyProgress = Object.keys(dailyCounts).map(d => ({
      day: d,
      count: dailyCounts[d]
    }));

    return {
      totalWords: total,
      masteredWords: mastered,
      reviewingWords: reviewing,
      newWords: news,
      todayGoal: 10,
      todayCompleted: mastered + Math.min(reviewing, 2), // Simulating daily goal metrics
      streakDays: total > 0 ? 5 : 0,
      weeklyProgress
    };
  }, [words]);

  return (
    <div className="min-h-screen flex flex-col bg-calm-bg text-brand-dark" id="lexi-root">
      {/* Dynamic Top Navigation Bar */}
      <Navbar 
        user={userProfile}
        telegram={telegramSettings}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Structural Area: Dual Sidebar Desktop, Single stack mobile */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Dynamic Navigation Slices */}
        <Sidebar 
          activeView={activeView}
          setActiveView={setActiveView}
          user={userProfile}
          telegram={telegramSettings}
          stats={stats}
          onLogout={handleLogout}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Content Container (Scrollable viewport) */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              {activeView === 'learn' && (
                <LearnView 
                  words={words}
                  onAddWord={handleAddWord}
                  onUpdateWordStatus={handleUpdateStatus}
                  onDeleteWord={handleDeleteWord}
                />
              )}

              {activeView === 'quiz' && (
                <QuizView 
                  words={words}
                  onBackToDeck={() => setActiveView('learn')}
                />
              )}

              {activeView === 'history' && (
                <HistoryView 
                  words={words}
                  onReviewRating={handleReviewRating}
                  onUpdateWordStatus={handleUpdateStatus}
                />
              )}

              {activeView === 'stats' && (
                <StatsDashboard 
                  stats={stats}
                />
              )}

              {activeView === 'telegram' && (
                <TelegramSync 
                  settings={telegramSettings}
                  onUpdateSettings={handleUpdateTelegramSettings}
                  logs={logs}
                  isSocketConnected={isSocketConnected}
                  onConnect={connectSocket}
                  onDisconnect={disconnectSocket}
                  onSimulateIncoming={simulateTelegramIncomingWord}
                  onClearLogs={clearLogs}
                />
              )}

              {activeView === 'login' && (
                <LoginView 
                  onLoginSuccess={handleLoginSuccess}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

