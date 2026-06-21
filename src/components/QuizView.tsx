import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  Brain, 
  Award,
  Zap,
  BookOpen
} from 'lucide-react';
import { VocabularyWord } from '../types';

interface QuizViewProps {
  words: VocabularyWord[];
  onBackToDeck: () => void;
}

interface Question {
  id: string;
  wordId: string;
  word: string;
  mode: 'A' | 'B' | 'C';
  questionText: string;
  contextSentence?: string;
  highlightedWord?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const BASE_VOCABULARY: VocabularyWord[] = [
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
  }
];

// Fixed seed fallback questions if they don't have enough words
const FALLBACK_SEED_QUESTIONS: Question[] = [
  {
    id: 'seed-1',
    wordId: 'word-1',
    word: 'paradigm',
    mode: 'A',
    questionText: 'What is the correct Chinese meaning of the word "paradigm"?',
    options: [
      '范式，典范，极其典型的示例',
      '诡计，阴谋，恶作剧',
      '悖论，自相矛盾的话',
      '并列，平行，类似的事件'
    ],
    correctAnswer: '范式，典范，极其典型的示例',
    explanation: '"paradigm" means a typical example or pattern of something; a model.'
  },
  {
    id: 'seed-2',
    wordId: 'word-2',
    word: 'synthesize',
    mode: 'B',
    questionText: 'Under context: "The OpenClaw agent digests multiple field feeds to synthesize a coherent summary outline."',
    contextSentence: 'The OpenClaw agent digests multiple field feeds to synthesize a coherent summary outline.',
    highlightedWord: 'synthesize',
    options: [
      '分解（分门别类检查细节）',
      '合成，综合，人工精制（将不同来源或想法融汇、合成一个整体）',
      '质疑（对外部信息持有不信任态度）',
      '转发（不做任何处理地搬运数据）'
    ],
    correctAnswer: '合成，综合，人工精制（将不同来源或想法融汇、合成一个整体）',
    explanation: '"synthesize" means to combine a number of things into a coherent whole.'
  },
  {
    id: 'seed-3',
    wordId: 'word-4',
    word: 'cognitive',
    mode: 'C',
    questionText: 'Does "cognitive" denote somatic or physical functions rather than mental/cerebral processing?',
    options: [
      'True',
      'False'
    ],
    correctAnswer: 'False',
    explanation: '"cognitive" is relating to logical, intellectual, or cerebral processing of the mind, not somatic physical actions.'
  },
  {
    id: 'seed-4',
    wordId: 'word-3',
    word: 'cohesive',
    mode: 'A',
    questionText: 'What is the correct Chinese meaning of "cohesive"?',
    options: [
      '凝聚的，有结合力的，紧密相关的',
      '排斥的，不相容的，抵触的',
      '粘稠的，带有毒性的，腐蚀的',
      '生疏的，冷漠的，互不关联的'
    ],
    correctAnswer: '凝聚的，有结合力的，紧密相关的',
    explanation: '"cohesive" means characterized by or causing cohesion; sticky or tightly working together.'
  },
  {
    id: 'seed-5',
    wordId: 'word-5',
    word: 'empirical',
    mode: 'B',
    questionText: 'Under context: "The developer presented empirical benchmarks confirming connection sync speeds were stable."',
    contextSentence: 'The developer presented empirical benchmarks confirming connection sync speeds were stable.',
    highlightedWord: 'empirical',
    options: [
      '理论推导的（仅基于数学算式推演）',
      '凭经验的，实证的，基于观测的（基于真实数据或实验捕获的观测结果）',
      '猜测的（凭空想象并没有根据）',
      '上古的（古代先贤留下的经验）'
    ],
    correctAnswer: '凭经验的，实证的，基于观测的（基于真实数据或实验捕获的观测结果）',
    explanation: '"empirical" means verifiable by observation or experience rather than theory or pure logic.'
  }
];

export default function QuizView({ words, onBackToDeck }: QuizViewProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>([]);
  const [retryingWrongsOnly, setRetryingWrongsOnly] = useState(false);

  // Generate a dynamic list of randomized questions based on vocabulary list!
  const generateQuestions = (targetWords: VocabularyWord[]) => {
    const listToUse = targetWords.length >= 3 ? targetWords : BASE_VOCABULARY;
    
    const generated: Question[] = [];
    
    listToUse.forEach((w, idx) => {
      // Determine question modes (alternated between A, B, and C)
      const modeChance = idx % 3;
      const otherWords = listToUse.filter(item => item.id !== w.id);
      
      // Shuffle helper
      const shuffle = (array: string[]) => [...array].sort(() => Math.random() - 0.5);

      if (modeChance === 0) {
        // Mode A: Multiple choice
        const correctDef = w.chineseMeaning;
        const fakeDefs = otherWords.map(item => item.chineseMeaning).slice(0, 3);
        // Ensure we always have 4 choices
        while (fakeDefs.length < 3) {
          fakeDefs.push(`模拟干扰项 ${fakeDefs.length + 1}`);
        }
        const options = shuffle([correctDef, ...fakeDefs]);
        
        generated.push({
          id: `q-a-${w.id}-${idx}`,
          wordId: w.id,
          word: w.word,
          mode: 'A',
          questionText: `What is the correct Chinese meaning of the English word "${w.word}"?`,
          options,
          correctAnswer: correctDef,
          explanation: `"${w.word}" (${w.partOfSpeech}) translates to "${w.chineseMeaning}".`
        });
      } else if (modeChance === 1) {
        // Mode B: Translation context checks
        const correctTrans = `${w.chineseMeaning}（${w.aiSection.exampleTranslation}）`;
        const fakeTrans = otherWords.map(item => `${item.chineseMeaning}（${item.aiSection.exampleTranslation}）`).slice(0, 3);
        while (fakeTrans.length < 3) {
          fakeTrans.push(`干扰释意 ${fakeTrans.length + 1}（上下文语境不符）`);
        }
        const options = shuffle([correctTrans, ...fakeTrans]);

        generated.push({
          id: `q-b-${w.id}-${idx}`,
          wordId: w.id,
          word: w.word,
          mode: 'B',
          questionText: `Choose the response that best matching the real context of the highlighted word in:`,
          contextSentence: w.aiSection.exampleSentence,
          highlightedWord: w.word,
          options,
          correctAnswer: correctTrans,
          explanation: `In this sentence, "${w.word}" is best translated as: "${w.chineseMeaning}".`
        });
      } else {
        // Mode C: True/False check
        const isTrue = Math.random() > 0.5;
        let pText = '';
        let correctOption = '';
        
        if (isTrue) {
          pText = `Does the word "${w.word}" mean "${w.chineseMeaning}" in typical cognitive workflows?`;
          correctOption = 'True';
        } else {
          const absoluteIncorrectWord = otherWords[0] || BASE_VOCABULARY[0];
          pText = `Does the word "${w.word}" mean "${absoluteIncorrectWord.chineseMeaning}" in typical layouts?`;
          correctOption = 'False';
        }

        generated.push({
          id: `q-c-${w.id}-${idx}`,
          wordId: w.id,
          word: w.word,
          mode: 'C',
          questionText: pText,
          options: ['True', 'False'],
          correctAnswer: correctOption,
          explanation: isTrue 
            ? `Correct! "${w.word}" indeed translates to "${w.chineseMeaning}".`
            : `False. "${w.word}" translates to "${w.chineseMeaning}", not "${otherWords[0]?.chineseMeaning || ''}".`
        });
      }
    });

    // Shuffle the final list or alternate them nicely
    return generated.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const initializedQuizzes = generateQuestions(words);
    setQuestions(initializedQuizzes.length > 0 ? initializedQuizzes : FALLBACK_SEED_QUESTIONS);
  }, [words]);

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer !== null) return; // Prevent double selecting
    setSelectedAnswer(option);
    
    const isCorrect = option === questions[currentIndex].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setWrongQuestionIds(prev => [...prev, questions[currentIndex].id]);
    }
  };

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRetryAll = () => {
    const initializedQuizzes = generateQuestions(words);
    setQuestions(initializedQuizzes.length > 0 ? initializedQuizzes : FALLBACK_SEED_QUESTIONS);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
    setWrongQuestionIds([]);
    setRetryingWrongsOnly(false);
  };

  const handleRetryWrongs = () => {
    const wrongQs = questions.filter(q => wrongQuestionIds.includes(q.id));
    if (wrongQs.length > 0) {
      setQuestions(wrongQs);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setScore(0);
      setQuizCompleted(false);
      setWrongQuestionIds([]);
      setRetryingWrongsOnly(true);
    }
  };

  // Safe loading check
  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-xs font-mono text-slate-500">Preparing customized quiz index...</p>
      </div>
    );
  }

  // Encouragement texts
  const getEncouragement = () => {
    const percentage = Math.round((score / questions.length) * 100);
    if (percentage === 100) return { title: "Perfect Mastery! 🌟", text: "Astonishing results! Your neural database of vocabulary has achieved peerless consistency." };
    if (percentage >= 80) return { title: "Splendid Progress! ✨", text: "Magnificent recall capability! Your spaced repetition integration proves extremely efficient." };
    if (percentage >= 50) return { title: "Formidable effort! 💪", text: "You have a solid foundation! Reviewing missed words will safely reinforce long-term storage." };
    return { title: "Keep Growing! 🌱", text: "Learning is an iterative path. Let's retry these items and solidify those synaptic pathways." };
  };

  return (
    <div className="space-y-6 select-none" id="quiz-view-wrapper">
      
      {/* Visual Header introduction */}
      <div className="p-6 rounded-[32px] bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" />
        <p className="text-[10px] uppercase font-mono tracking-wider text-indigo-600 font-bold mb-1">AgentWay Evaluation Suite</p>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-semibold text-xl text-brand-dark leading-tight flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              <span>Interactive Vocabulary Quiz</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
              Showcasing one single-screen question block at a time to mitigate cognitive overhead. Challenge your recollection recall intervals.
            </p>
          </div>
          <button 
            onClick={onBackToDeck}
            className="self-start md:self-auto px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" /> Back to My Deck
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!quizCompleted ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[40px] p-6 md:p-10 shadow-xl shadow-slate-205/40 relative overflow-hidden"
          >
            {/* Status indicators */}
            <div className="flex justify-between items-center mb-6">
              <span className="px-3.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-[11px] font-bold uppercase tracking-wider">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Score: <b className="text-indigo-600 font-sans text-sm">{score}</b></span>
              </div>
            </div>

            {/* Dynamic continuous progress bar indicator */}
            <div className="w-full bg-slate-100/80 rounded-full h-1.5 mb-8 overflow-hidden">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card Content Area */}
            <div className="space-y-6">
              
              {/* Mode B Sentence Highlighter Block */}
              {currentQuestion.mode === 'B' && currentQuestion.contextSentence && (
                <div className="bg-indigo-50/40 border border-indigo-100/50 p-5 rounded-2xl mb-2 relative overflow-hidden">
                  <span className="text-[9px] text-indigo-600 uppercase font-mono tracking-widest block font-bold mb-2">Contextual Sentence Translation check</span>
                  <p className="text-slate-800 text-[15px] sm:text-base leading-relaxed italic font-serif">
                    {/* Render helper highlight */}
                    {(() => {
                      const sentence = currentQuestion.contextSentence;
                      const word = currentQuestion.highlightedWord || '';
                      if (!word) return sentence;
                      
                      const wordIndex = sentence.toLowerCase().indexOf(word.toLowerCase());
                      if (wordIndex === -1) return sentence;
                      
                      const before = sentence.slice(0, wordIndex);
                      const actualWordMatched = sentence.slice(wordIndex, wordIndex + word.length);
                      const after = sentence.slice(wordIndex + word.length);
                      
                      return (
                        <>
                          {before}
                          <span className="bg-amber-100 text-indigo-900 px-1 font-bold rounded shadow-sm border border-amber-200">{actualWordMatched}</span>
                          {after}
                        </>
                      );
                    })()}
                  </p>
                </div>
              )}

              {/* Mode C True/False Target word display */}
              {currentQuestion.mode === 'C' && (
                <div className="bg-rose-50/30 border border-rose-100/40 p-4 rounded-2xl mb-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-rose-500 uppercase font-mono tracking-widest font-bold">Word to verify</span>
                    <h4 className="text-3xl font-display font-black text-slate-800">{currentQuestion.word}</h4>
                  </div>
                  <HelpCircle className="w-10 h-10 text-rose-300 pointer-events-none" />
                </div>
              )}

              {/* Formulated question directions instruction */}
              <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-snug">
                {currentQuestion.questionText}
              </h3>

              {/* Option Choice button clusters */}
              <div className="grid grid-cols-1 gap-3.5 mt-4" id="quiz-options-group">
                {currentQuestion.options.map((option, oIdx) => {
                  const isSelected = selectedAnswer === option;
                  const isAnsCorrect = option === currentQuestion.correctAnswer;
                  const showCorrectIndicator = selectedAnswer !== null && isAnsCorrect;
                  const showWrongIndicator = selectedAnswer !== null && isSelected && !isAnsCorrect;
                  
                  let btnStyle = "bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700";
                  if (selectedAnswer !== null) {
                    if (isAnsCorrect) {
                      btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-800";
                    } else if (isSelected) {
                      btnStyle = "bg-rose-50 border-rose-300 text-rose-800";
                    } else {
                      btnStyle = "bg-white opacity-60 border-slate-150 text-slate-400";
                    }
                  }

                  return (
                    <motion.button
                      key={oIdx}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={selectedAnswer !== null}
                      whileHover={selectedAnswer === null ? { scale: 1.01, x: 2 } : {}}
                      whileTap={selectedAnswer === null ? { scale: 0.99 } : {}}
                      className={`w-full flex items-center justify-between p-4 md:p-5 rounded-2xl border text-left text-sm md:text-base font-semibold leading-relaxed transition-all cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-slate-100 font-mono text-xs text-slate-500 flex items-center justify-center shrink-0 border border-slate-200 font-bold">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      
                      <div className="shrink-0 pl-2">
                        {showCorrectIndicator && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          </motion.div>
                        )}
                        {showWrongIndicator && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <XCircle className="w-5 h-5 text-rose-600 fill-rose-100" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanatory insights footer shown after selecting */}
              {selectedAnswer !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-50 rounded-2xl p-4 md:p-5 border border-slate-200/60 text-xs md:text-sm text-slate-600 mt-4 leading-relaxed"
                >
                  <p className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" /> Language Sync Explanation
                  </p>
                  <p>{currentQuestion.explanation}</p>
                </motion.div>
              )}

              {/* CTA Next Button Panel */}
              {selectedAnswer !== null && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-end pt-2"
                >
                  <button
                    onClick={handleNext}
                    className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all cursor-pointer"
                  >
                    <span>{currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

            </div>
          </motion.div>
        ) : (
          /* Quiz Complete Summary screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[40px] p-8 md:p-12 text-center shadow-xl shadow-slate-200/50 relative overflow-hidden"
            id="quiz-summary-card"
          >
            {/* Soft decorative background blurs */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-md mx-auto space-y-6">
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-md shadow-indigo-200 text-white animate-bounce">
                💯
              </div>

              <div>
                <h3 className="text-3xl font-display font-bold text-slate-800 tracking-tight">
                  {getEncouragement().title}
                </h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  {getEncouragement().text}
                </p>
              </div>

              {/* Score Display Widget */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 flex items-center justify-around">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest block font-bold">Accuracy</span>
                  <strong className="text-3xl font-display font-black text-slate-800">
                    {Math.round((score / questions.length) * 100)}%
                  </strong>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest block font-bold">Correct Status</span>
                  <strong className="text-3xl font-display font-black text-slate-800">
                    {score} <span className="text-xs font-normal text-slate-400 font-sans">/ {questions.length}</span>
                  </strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleRetryAll}
                  className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Quiz</span>
                </button>

                {wrongQuestionIds.length > 0 && (
                  <button
                    onClick={handleRetryWrongs}
                    className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-sm shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-4 h-4 fill-white/20 animate-pulse" />
                    <span>Focus Wrong ({wrongQuestionIds.length})</span>
                  </button>
                )}

                <button
                  onClick={onBackToDeck}
                  className="flex-1 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 rounded-2xl font-bold text-sm transition-colors cursor-pointer"
                >
                  Back to Deck
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
