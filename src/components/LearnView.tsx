import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  CheckCircle2, 
  XOctagon, 
  Sparkles, 
  Trash2, 
  Search, 
  Plus, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Bookmark,
  Calendar,
  Frown,
  BookMarked
} from 'lucide-react';
import { VocabularyWord } from '../types';

interface LearnViewProps {
  words: VocabularyWord[];
  onAddWord: (word: Omit<VocabularyWord, 'id' | 'dateAdded' | 'timesReviewed' | 'status'>) => void;
  onUpdateWordStatus: (id: string, status: 'new' | 'reviewing' | 'mastered') => void;
  onDeleteWord: (id: string) => void;
}

export default function LearnView({
  words,
  onAddWord,
  onUpdateWordStatus,
  onDeleteWord
}: LearnViewProps) {
  // Current active word on the card
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showExtras, setShowExtras] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [isSparkling, setIsSparkling] = useState<boolean>(false);

  // Manual input form states
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newWord, setNewWord] = useState<string>('');
  const [newPhonetic, setNewPhonetic] = useState<string>('');
  const [newPOS, setNewPOS] = useState<string>('n.');
  const [newMeaning, setNewMeaning] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  // Form AI Section values
  const [newExample, setNewExample] = useState<string>('');
  const [newTranslation, setNewTranslation] = useState<string>('');
  const [newSource, setNewSource] = useState<string>('Reuters');
  const [newSourceUrl, setNewSourceUrl] = useState<string>('https://reuters.com');
  const [newSynonyms, setNewSynonyms] = useState<string>('');
  const [newAntonyms, setNewAntonyms] = useState<string>('');
  const [newCollocations, setNewCollocations] = useState<string>('');

  // Filtering active (unmastered) words for interactive review
  const activeReviewGroup = words.filter(w => w.status !== 'mastered');
  const currentWord = activeReviewGroup[currentIndex] || null;

  // TTS Pronunciation using speech synthesis
  const handlePronounce = (wordText: string) => {
    if (!wordText) return;
    setAudioPlaying(true);
    if ('speechSynthesis' in window) {
      // Cancel previous utterances
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onend = () => setAudioPlaying(false);
      utterance.onerror = () => setAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      // Simulated fallback
      setTimeout(() => setAudioPlaying(false), 800);
    }
  };

  // Sparkle mastered sequence animation
  const handleMastered = (id: string) => {
    setIsSparkling(true);
    setTimeout(() => {
      setIsSparkling(false);
      onUpdateWordStatus(id, 'mastered');
      // Advance slider if available
      if (currentIndex >= activeReviewGroup.length - 1) {
        setCurrentIndex(Math.max(0, activeReviewGroup.length - 2));
      }
    }, 900);
  };

  const handleReviewLater = (id: string) => {
    onUpdateWordStatus(id, 'reviewing');
    if (currentIndex < activeReviewGroup.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (activeReviewGroup.length > 1) {
      setCurrentIndex(0);
    }
  };

  // Simulate AI smart content generation
  const handleGenerateAiFields = () => {
    if (!newWord) return;
    setIsAiGenerating(true);
    
    // Quick translation mapping mock for high-quality generation
    const wordKey = newWord.trim().toLowerCase();
    
    setTimeout(() => {
      // Choose beautiful context based on standard patterns
      setNewPhonetic(`/${wordKey}/`);
      setNewExample(`The recent integration of automated pipelines aims to streamline cognitive processes.`);
      setNewTranslation('最近自动化流水线的集成旨在简化认知流程。');
      setNewSource('BBC Technology');
      setNewSourceUrl('https://bbc.com/news');
      setNewSynonyms('automation, algorithmic flow');
      setNewAntonyms('manual labor, physical constraint');
      setNewCollocations('integrated pipeline, process orchestration');
      setIsAiGenerating(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord || !newMeaning) return;

    onAddWord({
      word: newWord,
      phonetic: newPhonetic || `/${newWord}/`,
      partOfSpeech: newPOS,
      chineseMeaning: newMeaning,
      synonyms: newSynonyms ? newSynonyms.split(',').map(s => s.trim()) : [],
      antonyms: newAntonyms ? newAntonyms.split(',').map(s => s.trim()) : [],
      collocations: newCollocations ? newCollocations.split(',').map(s => s.trim()) : [],
      aiSection: {
        exampleSentence: newExample || `This vocabulary item is analyzed for contextual integration.`,
        exampleTranslation: newTranslation || `通过上下文对该词汇条目进行分析和整融。`,
        sourcePub: newSource || 'Reuters',
        sourceUrl: newSourceUrl || 'https://reuters.com'
      }
    });

    // Reset fields
    setNewWord('');
    setNewPhonetic('');
    setNewMeaning('');
    setNewExample('');
    setNewTranslation('');
    setNewSynonyms('');
    setNewAntonyms('');
    setNewCollocations('');
    setShowAddForm(false);
  };

  // Filter vocabulary database list
  const filteredDatabaseWords = words.filter(w => 
    w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.chineseMeaning.includes(searchQuery)
  );

  return (
    <div className="space-y-8 select-none" id="learn-view-container">
      {/* Upper Grid: Active Flashcard & Help Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Core Flashcard Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-medium text-lg text-brand-dark flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-inviting-violet" />
              <span>Active Study Deck</span>
              <span className="text-xs bg-violet-100 text-inviting-violet px-2.5 py-0.5 rounded-full font-mono">
                {activeReviewGroup.length} left
              </span>
            </h2>

            {activeReviewGroup.length > 1 && (
              <div className="flex gap-1.5 text-xs font-mono">
                {activeReviewGroup.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCurrentIndex(idx); setShowExtras(false); }}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      currentIndex === idx 
                        ? 'bg-inviting-violet text-white font-bold' 
                        : 'bg-white/60 text-brand-dark/60 hover:bg-white border border-brand-dark/5'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {currentWord ? (
              <motion.div
                key={currentWord.word}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[40px] p-6 md:p-10 relative shadow-xl shadow-slate-200/50 overflow-hidden group"
                id={`flashcard-card-active`}
              >
                {/* Sparkle confirmation coating overlay */}
                {isSparkling && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-emerald-50/95 backdrop-blur-md z-30 flex flex-col items-center justify-center text-center p-4 rounded-[40px]"
                  >
                    <motion.div
                      animate={{ scale: [0.8, 1.2, 1], rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 0.6 }}
                      className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-3"
                    >
                      <Sparkles className="w-8 h-8 fill-white/20 animate-pulse" />
                    </motion.div>
                    <h3 className="font-display font-bold text-lg text-emerald-800">Mastered!</h3>
                    <p className="text-xs text-emerald-600 font-mono mt-0.5">Brain connections strengthened ✨</p>
                  </motion.div>
                )}

                {/* Ambient Blurred Vector Blobs */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-emerald-100/20 rounded-full blur-2xl pointer-events-none" />

                {/* Card Header information */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-2">
                    <span className="px-3 py-1 bg-violet-100 text-violet-600 rounded-full text-[11px] font-bold uppercase tracking-wider">
                      {currentWord.partOfSpeech} Word Card
                    </span>
                    <h2 className="text-5.5xl md:text-6xl font-bold text-slate-800 tracking-tight leading-none mb-1">
                      {currentWord.word}
                    </h2>
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-base md:text-lg">
                      <span>{currentWord.phonetic}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-350" />
                      <span className="italic font-sans text-sm text-slate-500">{currentWord.partOfSpeech}</span>
                    </div>
                  </div>

                  {/* Audio trigger button */}
                  <motion.button
                    onClick={() => handlePronounce(currentWord.word)}
                    className={`p-3.5 rounded-full shadow-sm cursor-pointer border ${
                      audioPlaying 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-100' 
                        : 'bg-white text-indigo-600 border-slate-100 hover:bg-slate-50'
                    } transition-all`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Pronounce word"
                    id={`btn-pronounce-${currentWord.word}`}
                  >
                    <Volume2 className={`w-5 h-5 ${audioPlaying ? 'animate-bounce' : ''}`} />
                  </motion.button>
                </div>

                {/* Word Meaning block */}
                <div className="mt-8 relative z-10">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest block font-bold mb-1">Chinese Meaning</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-850 tracking-tight">
                    {currentWord.chineseMeaning}
                  </h3>
                </div>

                {/* Distinctive 'AI Context insight' context view */}
                <div className="mt-8 border-t border-slate-100 pt-6 space-y-3 relative z-10">
                  <div className="bg-white/40 p-5 md:p-6 rounded-[24px] border border-white/50 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3.5">
                      <Cpu className="text-indigo-500 w-4 h-4" />
                      <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">AI Contextual Insight</span>
                    </div>

                    <blockquote className="text-slate-700 italic border-l-4 border-violet-400 pl-4 mb-3.5 text-[14px] md:text-base leading-relaxed">
                      "{currentWord.aiSection.exampleSentence}"
                    </blockquote>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100/50 pt-3 mt-3">
                      <a 
                        href={currentWord.aiSection.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[11px] text-slate-400 underline hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        Source: {currentWord.aiSection.sourcePub}
                      </a>
                      
                      {currentWord.collocations && currentWord.collocations.length > 0 && (
                        <span className="text-[10px] bg-indigo-50/70 text-indigo-600 font-medium px-2.5 py-1 rounded-lg border border-indigo-100/30">
                          Collocation: "{currentWord.collocations[0]}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Collapsible Synonyms/Antonyms/Collocations dropdown */}
                <div className="mt-4 border-t border-brand-dark/5 pt-4">
                  <button 
                    onClick={() => setShowExtras(!showExtras)}
                    className="w-full flex items-center justify-between text-xs font-mono text-gray-500 hover:text-brand-dark transition-colors cursor-pointer py-1"
                    id={`btn-toggle-collapsible-${currentWord.word}`}
                  >
                    <span>{showExtras ? 'Hide' : 'Show'} Synonyms, Antonyms & Collocations</span>
                    {showExtras ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <AnimatePresence>
                    {showExtras && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3.5 space-y-3 overflow-hidden text-xs"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                          <div className="p-2.5 rounded-lg bg-emerald-50/20 border border-emerald-100/40">
                            <h4 className="font-semibold text-emerald-800 mb-1">Synonyms / 近义词</h4>
                            <p className="text-gray-600 leading-relaxed">
                              {currentWord.synonyms.length > 0 ? currentWord.synonyms.join(', ') : 'None documented'}
                            </p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-rose-50/20 border border-rose-100/40">
                            <h4 className="font-semibold text-rose-800 mb-1">Antonyms / 反义词</h4>
                            <p className="text-gray-600 leading-relaxed">
                              {currentWord.antonyms.length > 0 ? currentWord.antonyms.join(', ') : 'None documented'}
                            </p>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-blue-50/20 border border-blue-100/40">
                          <h4 className="font-semibold text-blue-800 mb-1">Common Collocations / 常见搭配</h4>
                          <p className="text-gray-600 leading-relaxed font-serif">
                            {currentWord.collocations.length > 0 ? currentWord.collocations.join(', ') : 'None documented'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Flashcard Action spacing buttons */}
                <div className="mt-6 pt-5 border-t border-brand-dark/5 flex gap-3.5">
                  <motion.button
                    onClick={() => handleReviewLater(currentWord.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-2xl text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-50/60 hover:bg-rose-100/80 border border-rose-100 transition-colors cursor-pointer"
                    whileTap={{ scale: 0.98 }}
                    id={`btn-review-later-${currentWord.word}`}
                  >
                    <XOctagon className="w-4 h-4 text-rose-600" />
                    <span>Review Later</span>
                  </motion.button>

                  <motion.button
                    onClick={() => handleMastered(currentWord.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-2xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-emerald-500 to-electric-mint hover:from-electric-mint hover:to-emerald-600 transition-colors cursor-pointer shadow-md shadow-emerald-500/10"
                    whileTap={{ scale: 0.98 }}
                    id={`btn-mark-mastered-${currentWord.word}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Mastered</span>
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              /* Beautiful Encouraging Empty State message */
              <div className="glass-panel rounded-3xl p-8 text-center border border-white/80 shadow-md">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 fill-emerald-100 animate-pulse" />
                </div>
                <h3 className="font-display font-medium text-lg text-brand-dark">All clear! 🪐</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                  No active cards left to study! Time to relax, simulate a new Telegram webhook sync, or manually insert study items.
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-inviting-violet text-white rounded-xl text-xs font-semibold hover:bg-violet-600 shadow-sm transition-all cursor-pointer"
                  >
                    Add Word
                  </button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Motivational Sidebar Tips Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-5 border border-white/70 shadow-sm relative overflow-hidden">
            <h4 className="font-display font-semibold text-sm text-brand-dark flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>How To Sync Words via Telegram</span>
            </h4>
            <p className="text-xs text-gray-500 mt-2.5 leading-relaxed">
              You can instantly push vocabulary cards from your chat app into this interface! Use our real-time simulation on the sidebar dashboard to replicate adding items while studying on the go.
            </p>
            <div className="mt-4 p-3 bg-white/70 rounded-xl border border-brand-dark/5 space-y-1.5 text-xs font-mono">
              <p className="text-emerald-700 font-semibold flex items-center gap-2">
                <span>/add autonomous</span> 
                <span className="text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded font-normal text-emerald-600">Simulate Sync</span>
              </p>
              <p className="text-gray-400">Instructs the OpenClaw Agent to crawl news sites, auto-extract phonetics, compile synonyms, and append layouts in real-time!</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-tr from-sunset-coral/5 to-white/90 border border-sunset-coral/10 relative overflow-hidden">
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-sunset-coral">Cognitive Focus Strategy</h4>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              When encountering a card, pronounce it aloud using the speaker button. Try mentally placing the synonyms in a custom work scenario prior to marking it "Mastered".
            </p>
          </div>
        </div>
      </div>

      {/* Lower Section: Database Grid with SQLite CRUD Actions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-brand-dark/5 pt-6">
          <div>
            <h3 className="font-display font-semibold text-lg text-brand-dark">Vocabulary Database Repository</h3>
            <p className="text-xs text-gray-400">Search, edit, or delete items currently managed by your local agent profile.</p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search filter bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-48 sm:w-60 bg-white/60 focus:bg-white border border-brand-dark/10 rounded-xl text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none transition-colors"
                id="search-database-words-input"
              />
            </div>

            {/* Toggle creation modal trigger */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-2.5 bg-brand-dark text-white hover:bg-brand-dark/95 transition-all rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
              id="btn-add-word-toggle"
            >
              {showAddForm ? <ChevronUp className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{showAddForm ? 'Close Editor' : 'Add Word'}</span>
            </button>
          </div>
        </div>

        {/* Modular addition form card */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-panel border border-violet-100 rounded-2xl p-5 md:p-6"
              id="add-word-form-panel"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-brand-dark/5">
                  <h4 className="font-display font-semibold text-sm text-brand-dark flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-inviting-violet" />
                    <span>Interactive Vocabulary Entry Editor</span>
                  </h4>
                  
                  {/* Dynamic generation handler */}
                  <button
                    type="button"
                    onClick={handleGenerateAiFields}
                    disabled={!newWord || isAiGenerating}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      newWord 
                        ? 'bg-violet-100/80 text-inviting-violet border border-violet-200/50 hover:bg-violet-200' 
                        : 'bg-gray-50 text-gray-300 cursor-not-allowed border border-transparent'
                    }`}
                  >
                    <Sparkles className={`w-3 h-3 ${isAiGenerating ? 'animate-spin' : ''}`} />
                    <span>{isAiGenerating ? 'Generating Fields...' : 'Auto-Fill AI Agent Details'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Word Input */}
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold font-mono block">Word / 英文单词</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. cognitive"
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      className="w-full py-2 px-3 bg-white border border-brand-dark/10 rounded-lg text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none focus:border-inviting-violet"
                    />
                  </div>

                  {/* Phonetic Input */}
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold font-mono block">Phonetic / 音标</label>
                    <input
                      type="text"
                      placeholder="e.g. /ˈkɒɡnɪtɪv/"
                      value={newPhonetic}
                      onChange={(e) => setNewPhonetic(e.target.value)}
                      className="w-full py-2 px-3 bg-white border border-brand-dark/10 rounded-lg text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none focus:border-inviting-violet"
                    />
                  </div>

                  {/* Part of speech */}
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold font-mono block">Part of Speech / 词性</label>
                    <select
                      value={newPOS}
                      onChange={(e) => setNewPOS(e.target.value)}
                      className="w-full py-2 px-3 bg-white border border-brand-dark/10 rounded-lg text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none focus:border-inviting-violet"
                    >
                      <option value="n.">n. (Noun)</option>
                      <option value="v.">v. (Verb)</option>
                      <option value="adj.">adj. (Adjective)</option>
                      <option value="adv.">adv. (Adverb)</option>
                      <option value="prep.">prep. (Preposition)</option>
                      <option value="conj.">conj. (Conjunction)</option>
                    </select>
                  </div>
                </div>

                {/* Primary Meaning Input */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold font-mono block">Chinese Meaning / 中文释义</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 认知的，有感知的"
                    value={newMeaning}
                    onChange={(e) => setNewMeaning(e.target.value)}
                    className="w-full py-2.5 px-3 bg-white border border-brand-dark/10 rounded-lg text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none focus:border-inviting-violet"
                  />
                </div>

                {/* AI Section inputs */}
                <div className="p-4 rounded-xl bg-violet-50/20 border border-violet-100/30 space-y-3">
                  <p className="text-[10px] font-bold text-inviting-violet uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" /> AI Agent Generated Illustration Fields
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] text-gray-500 uppercase font-semibold font-mono block">Example English Sentence</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. The software tracks cognitive performance metrics."
                        value={newExample}
                        onChange={(e) => setNewExample(e.target.value)}
                        className="w-full py-2 px-3 bg-white border border-brand-dark/10 rounded-lg text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none focus:border-inviting-violet font-serif"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-gray-500 uppercase font-semibold font-mono block">Example Chinese Translation</label>
                      <textarea
                        rows={2}
                        placeholder="该软件跟踪认知能力指标。"
                        value={newTranslation}
                        onChange={(e) => setNewTranslation(e.target.value)}
                        className="w-full py-2 px-3 bg-white border border-brand-dark/10 rounded-lg text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none focus:border-inviting-violet"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] text-gray-500 uppercase font-semibold font-mono block">Source Publication</label>
                      <input
                        type="text"
                        placeholder="e.g. Reuters"
                        value={newSource}
                        onChange={(e) => setNewSource(e.target.value)}
                        className="w-full py-2 px-3 bg-white border border-brand-dark/10 rounded-lg text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none focus:border-inviting-violet"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-gray-500 uppercase font-semibold font-mono block">Source URL</label>
                      <input
                        type="url"
                        placeholder="https://reuters.com"
                        value={newSourceUrl}
                        onChange={(e) => setNewSourceUrl(e.target.value)}
                        className="w-full py-2 px-3 bg-white border border-brand-dark/10 rounded-lg text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none focus:border-inviting-violet"
                      />
                    </div>
                  </div>
                </div>

                {/* Lexical Details synonyms, antonyms, etc. */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 uppercase font-semibold font-mono block">Synonyms (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. mental, intellectual"
                      value={newSynonyms}
                      onChange={(e) => setNewSynonyms(e.target.value)}
                      className="w-full py-2 px-3 bg-white border border-brand-dark/10 rounded-lg text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none focus:border-inviting-violet"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 uppercase font-semibold font-mono block">Antonyms (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. physical, somatic"
                      value={newAntonyms}
                      onChange={(e) => setNewAntonyms(e.target.value)}
                      className="w-full py-2 px-3 bg-white border border-brand-dark/10 rounded-lg text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none focus:border-inviting-violet"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 uppercase font-semibold font-mono block">Collocations (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. cognitive development"
                      value={newCollocations}
                      onChange={(e) => setNewCollocations(e.target.value)}
                      className="w-full py-2 px-3 bg-white border border-brand-dark/10 rounded-lg text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none focus:border-inviting-violet"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-inviting-violet text-white hover:bg-violet-600 transition-colors text-sm font-semibold rounded-xl cursor-pointer shadow"
                    id="submit-new-word-button"
                  >
                    Commit New Card
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Vocabulary Grid */}
        {filteredDatabaseWords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" id="vocabulary-database-grid">
            <AnimatePresence>
              {filteredDatabaseWords.map((wordItem) => {
                const isMastered = wordItem.status === 'mastered';
                return (
                  <motion.div
                    key={wordItem.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-5 rounded-2xl border transition-all ${
                      isMastered 
                        ? 'bg-emerald-50/50 border-emerald-100/55 shadow-sm shadow-emerald-500/5' 
                        : 'bg-white border-brand-dark/5 hover:border-violet-100 shadow-sm shadow-brand-dark/2'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-mono italic">{wordItem.partOfSpeech}</span>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                            wordItem.status === 'mastered' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : wordItem.status === 'reviewing' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-blue-100 text-blue-800'
                          }`}>
                            {wordItem.status}
                          </span>
                        </div>
                        <h4 className="font-display font-semibold text-lg text-brand-dark mt-1 flex items-center gap-2">
                          {wordItem.word}
                        </h4>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{wordItem.phonetic}</p>
                      </div>

                      <div className="flex gap-1.5 select-none">
                        {/* Audio pronouced inside database grid too! */}
                        <button
                          onClick={() => handlePronounce(wordItem.word)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-gray-450 hover:text-brand-dark transition-colors cursor-pointer"
                          title="Speak"
                        >
                          <Volume2 className="w-4 h-4 text-gray-505" />
                        </button>
                        <button
                          onClick={() => onDeleteWord(wordItem.id)}
                          className="p-1 rounded-lg hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                          title="Delete word"
                          id={`btn-delete-card-${wordItem.word}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-brand-dark/5 flex items-center justify-between text-xs">
                      <p className="text-brand-dark font-medium truncate max-w-[180px]">{wordItem.chineseMeaning}</p>
                      
                      {/* Dynamic flip flag status click */}
                      <button
                        onClick={() => onUpdateWordStatus(
                          wordItem.id, 
                          isMastered ? 'reviewing' : 'mastered'
                        )}
                        className={`text-[10px] font-mono font-semibold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                          isMastered 
                            ? 'bg-white text-emerald-700 border-emerald-100 hover:bg-emerald-50' 
                            : 'bg-white text-brand-dark border-brand-dark/10 hover:bg-violet-50 hover:text-inviting-violet'
                        }`}
                      >
                        {isMastered ? 'Undo Mastery' : 'Done Master'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-10 bg-white/40 border border-dashed border-brand-dark/10 rounded-2xl" id="database-empty-state">
            <Frown className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs text-gray-400 mt-2 font-mono">No matching vocabulary cards found. Try another query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
