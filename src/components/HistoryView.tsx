import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Search, 
  Filter, 
  ExternalLink,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  GraduationCap,
  Clock,
  Sparkles,
  RefreshCw,
  Award
} from 'lucide-react';
import { VocabularyWord } from '../types';

interface HistoryViewProps {
  words: VocabularyWord[];
  onReviewRating: (id: string, rating: 'hard' | 'good' | 'easy') => void;
  onUpdateWordStatus: (id: string, status: 'new' | 'reviewing' | 'mastered') => void;
}

export default function HistoryView({
  words,
  onReviewRating,
  onUpdateWordStatus
}: HistoryViewProps) {
  const [historyTab, setHistoryTab] = useState<'list' | 'quiz'>('list');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Quiz Review State
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [quizComplete, setQuizComplete] = useState<boolean>(false);

  // Filter history items
  const filteredWords = words.filter(w => {
    const matchesSearch = w.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          w.chineseMeaning.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' ? true : w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Quiz Group: Words that actually need review ('new' or 'reviewing')
  const quizWords = words.filter(w => w.status !== 'mastered');
  const currentQuizWord = quizWords[quizIndex] || null;

  const handleRevealAnswer = () => {
    setIsAnswerRevealed(true);
  };

  const handleRatingClick = (id: string, rating: 'hard' | 'good' | 'easy') => {
    onReviewRating(id, rating);
    setIsAnswerRevealed(false);
    
    if (quizIndex < quizWords.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizIndex(0);
    setIsAnswerRevealed(false);
    setQuizComplete(false);
  };

  return (
    <div className="space-y-6" id="history-view-container">
      {/* Top Selector Tabs */}
      <div className="flex border-b border-brand-dark/5 pb-px">
        <button
          onClick={() => setHistoryTab('list')}
          className={`px-5 py-3 text-sm font-display font-medium relative cursor-pointer tracking-tight leading-none ${
            historyTab === 'list' ? 'text-inviting-violet font-semibold' : 'text-gray-500 hover:text-brand-dark'
          }`}
          id="btn-history-tab-list"
        >
          <span>📜 Learning History Archive</span>
          {historyTab === 'list' && (
            <motion.div 
              layoutId="history-tab-underline" 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-inviting-violet" 
            />
          )}
        </button>

        <button
          onClick={() => { setHistoryTab('quiz'); handleResetQuiz(); }}
          className={`px-5 py-3 text-sm font-display font-medium relative cursor-pointer tracking-tight leading-none ${
            historyTab === 'quiz' ? 'text-inviting-violet font-semibold' : 'text-gray-500 hover:text-brand-dark'
          }`}
          id="btn-history-tab-quiz"
        >
          <span className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            <span>🎯 Spaced Repetition Quiz</span>
            {quizWords.length > 0 && (
              <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full">
                {quizWords.length} pending
              </span>
            )}
          </span>
          {historyTab === 'quiz' && (
            <motion.div 
              layoutId="history-tab-underline" 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-inviting-violet" 
            />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {historyTab === 'list' ? (
          /* View 1: History Archive Table */
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Table Filters header */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter by word or translation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full bg-white/60 focus:bg-white border border-brand-dark/10 rounded-xl text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none focus:border-inviting-violet transition-colors"
                  id="search-history-archive-input"
                />
              </div>

              {/* Dropdown status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="py-2 pl-2 pr-7 text-xs bg-white border border-brand-dark/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-inviting-violet"
                  id="select-history-status-filter"
                >
                  <option value="all">All statuses</option>
                  <option value="new">New words</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="mastered">Mastered</option>
                </select>
              </div>
            </div>

            {/* Main Responsive list/table box */}
            {filteredWords.length > 0 ? (
              <div className="bg-white/80 border border-brand-dark/5 rounded-2xl overflow-hidden shadow-sm shadow-brand-dark/2">
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse" id="history-archive-table">
                    <thead>
                      <tr className="border-b border-brand-dark/5 bg-gray-50/50 text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                        <th className="py-4 px-6">Word & Part</th>
                        <th className="py-4 px-6">Date Appended</th>
                        <th className="py-4 px-6">Chinese Meaning</th>
                        <th className="py-4 px-6">Review Status</th>
                        <th className="py-4 px-6 text-right">Context Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-dark/5 text-xs text-brand-dark">
                      {filteredWords.map((item) => (
                        <tr 
                          key={item.id} 
                          className="hover:bg-violet-50/30 transition-colors"
                          id={`history-row-${item.word}`}
                        >
                          <td className="py-4 px-6">
                            <span className="font-semibold text-sm hover:text-inviting-violet transition-colors">{item.word}</span>
                            <span className="ml-2 font-mono text-[10px] text-gray-400">{item.partOfSpeech}</span>
                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">{item.phonetic}</div>
                          </td>
                          <td className="py-4 px-6 text-gray-500 font-mono">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              <span>{item.dateAdded}</span>
                            </span>
                          </td>
                          <td className="py-4 px-6 font-medium max-w-xs truncate">
                            {item.chineseMeaning}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono leading-relaxed uppercase ${
                              item.status === 'mastered' 
                                ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/50' 
                                : item.status === 'reviewing' 
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200/50' 
                                  : 'bg-blue-50 text-blue-700 border border-blue-200/50'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <a
                              href={item.aiSection.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-inviting-violet hover:underline"
                            >
                              <span>{item.aiSection.sourcePub}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Stack (replaces table on smaller screens) */}
                <div className="md:hidden divide-y divide-brand-dark/5" id="history-archive-mobile-stack">
                  {filteredWords.map((item) => (
                    <div key={item.id} className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-base font-semibold">{item.word}</span>
                          <span className="ml-2 text-[10px] text-gray-400 font-mono uppercase bg-gray-50 px-1.5 rounded">{item.partOfSpeech}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                          item.status === 'mastered' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : item.status === 'reviewing' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <p className="text-xs text-brand-dark leading-relaxed">
                        <strong>Meaning:</strong> {item.chineseMeaning}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{item.dateAdded}</span>
                        </span>
                        
                        <a 
                          href={item.aiSection.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1 text-inviting-violet"
                        >
                          <span>{item.aiSection.sourcePub}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Table Empty state */
              <div className="text-center py-12 bg-white/40 border border-dashed border-brand-dark/10 rounded-2xl">
                <Search className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-sm text-gray-500 mt-2 font-mono">No records match your filters.</p>
              </div>
            )}
          </motion.div>
        ) : (
          /* View 2: Spaced Repetition quiz Interface */
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-center py-4"
          >
            {quizComplete ? (
              /* Completed Screen */
              <div className="max-w-md w-full glass-panel rounded-3xl p-8 text-center border border-white shadow-xl">
                <div className="w-16 h-16 rounded-full bg-indigo-50 text-inviting-violet flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 fill-indigo-100" />
                </div>
                <h3 className="font-display font-bold text-xl text-brand-dark">Review Session Clear! 🎉</h3>
                <p className="text-sm text-gray-500 mt-2.5 leading-relaxed">
                  Excellent focus. You have reviewed all available active cards in your deck using the Leitner/Spaced repetition algorithm.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={handleResetQuiz}
                    className="px-4 py-2.5 bg-inviting-violet text-white text-xs font-semibold rounded-xl hover:bg-violet-600 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Review Deck Again</span>
                  </button>
                  <button 
                    onClick={() => setHistoryTab('list')}
                    className="px-4 py-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Back to History
                  </button>
                </div>
              </div>
            ) : currentQuizWord ? (
              /* Quiz Card Stack */
              <div className="max-w-xl w-full space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                  <span>QUIZ PROGRESS</span>
                  <span>{quizIndex + 1} of {quizWords.length} pending</span>
                </div>

                <div 
                  className="glass-panel border border-white/90 rounded-3xl p-6 md:p-8 shadow-xl shadow-brand-dark/5 relative overflow-hidden"
                  id={`review-quiz-card-display`}
                >
                  {/* Subtle float design asset */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full -mr-8 -mt-8" />

                  {/* Top Word details */}
                  <div className="text-center space-y-2 py-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                      {currentQuizWord.partOfSpeech}
                    </span>
                    <h2 className="font-display font-bold text-4xl text-brand-dark tracking-tight">
                      {currentQuizWord.word}
                    </h2>
                    <p className="text-sm font-mono text-gray-400">
                      {currentQuizWord.phonetic}
                    </p>
                  </div>

                  {/* Hide or Reveal Card transition */}
                  <AnimatePresence mode="wait">
                    {!isAnswerRevealed ? (
                      /* Masked trigger state */
                      <motion.div
                        key="hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-10 flex flex-col items-center justify-center border-t border-dashed border-gray-255 mt-6"
                      >
                        <p className="text-xs text-gray-400 mb-4 font-mono">Test your memory recall on this item.</p>
                        <motion.button
                          onClick={handleRevealAnswer}
                          className="px-6 py-3 bg-brand-dark text-white hover:bg-brand-dark/95 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-sm flex items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          id="btn-reveal-quiz-answer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Reveal Translation</span>
                        </motion.button>
                      </motion.div>
                    ) : (
                      /* Revealed card state matching vocabulary tutors */
                      <motion.div
                        key="revealed"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 pt-6 border-t border-brand-dark/5 mt-6"
                      >
                        {/* Chinese Meaning */}
                        <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-100/60">
                          <p className="text-[10px] text-rose-800 uppercase font-mono tracking-wider font-semibold mb-0.5">Chinese Translation</p>
                          <p className="text-sm font-semibold text-brand-dark">
                            {currentQuizWord.chineseMeaning}
                          </p>
                        </div>

                        {/* Collateral details */}
                        <div className="p-3 bg-violet-50/30 rounded-xl border border-violet-100/30 text-xs">
                          <p className="text-[10px] text-inviting-violet uppercase font-mono tracking-wider font-bold mb-1">AI Context Example</p>
                          <p className="italic text-brand-dark">"{currentQuizWord.aiSection.exampleSentence}"</p>
                        </div>

                        {/* Synonyms list info */}
                        <div className="text-[11px] text-gray-500 font-mono">
                          <strong className="text-brand-dark">Synonyms:</strong> {currentQuizWord.synonyms.join(', ') || 'N/A'}
                        </div>

                        {/* Spaced repetition scoring algorithm choices */}
                        <div className="pt-4 border-t border-brand-dark/5 space-y-2">
                          <p className="text-[10px] text-gray-400 text-center font-mono">HOW WELL DID YOU RECALL?</p>
                          <div className="grid grid-cols-3 gap-2.5">
                            {/* Hard Trigger */}
                            <button
                              onClick={() => handleRatingClick(currentQuizWord.id, 'hard')}
                              className="py-2.5 px-1.5 rounded-xl border border-rose-250 bg-rose-50/60 hover:bg-rose-50 text-rose-700 text-xs font-semibold cursor-pointer text-center select-none"
                              id="quiz-rating-hard"
                            >
                              <div className="font-bold">Hard</div>
                              <div className="text-[9px] font-mono text-rose-500 leading-tight">Review (1m)</div>
                            </button>

                            {/* Good Trigger */}
                            <button
                              onClick={() => handleRatingClick(currentQuizWord.id, 'good')}
                              className="py-2.5 px-1.5 rounded-xl border border-amber-250 bg-amber-50/60 hover:bg-amber-100/80 text-amber-800 text-xs font-semibold cursor-pointer text-center select-none"
                              id="quiz-rating-good"
                            >
                              <div className="font-bold">Good</div>
                              <div className="text-[9px] font-mono text-amber-600 leading-tight">Review (1d)</div>
                            </button>

                            {/* Easy Trigger */}
                            <button
                              onClick={() => handleRatingClick(currentQuizWord.id, 'easy')}
                              className="py-2.5 px-1.5 rounded-xl border border-emerald-250 bg-emerald-50/60 hover:bg-emerald-100/90 text-emerald-800 text-xs font-semibold cursor-pointer text-center select-none"
                              id="quiz-rating-easy"
                            >
                              <div className="font-bold font-sans">Easy</div>
                              <div className="text-[9px] font-mono text-emerald-600 leading-tight">Review (4d)</div>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              /* SMR Quiz empty state *//* Encouraging message */
              <div className="max-w-md w-full glass-panel rounded-3xl p-8 text-center border border-white shadow-xl">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 fill-emerald-100 animate-bounce" />
                </div>
                <h3 className="font-display font-medium text-lg text-brand-dark">Review Queue Clear ✨</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  All clear! Time to relax or search a new word. You have mastered every item or there is nothing pending in Spaced Repetition right now.
                </p>
                <div className="mt-5">
                  <button
                    onClick={() => setHistoryTab('list')}
                    className="px-4 py-2.5 bg-brand-dark text-white text-xs font-semibold rounded-xl transition-all hover:bg-brand-dark/90 cursor-pointer"
                  >
                    View History List
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
