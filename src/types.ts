export interface AISection {
  exampleSentence: string;
  exampleTranslation: string;
  sourcePub: string;
  sourceUrl: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  chineseMeaning: string;
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  aiSection: AISection;
  status: 'new' | 'reviewing' | 'mastered';
  dateAdded: string; // ISO String or YYYY-MM-DD
  timesReviewed: number;
  lastReviewed?: string;
  nextReviewDate?: string;
}

export interface TelegramSettings {
  botToken: string;
  webhookUrl: string;
  isConnected: boolean;
  botUsername: string;
}

export interface UserStats {
  totalWords: number;
  masteredWords: number;
  reviewingWords: number;
  newWords: number;
  todayGoal: number;
  todayCompleted: number;
  streakDays: number;
  weeklyProgress: {
    day: string;
    count: number;
  }[];
}

export interface UserProfile {
  email: string;
  name: string;
  isLoggedIn: boolean;
  avatarUrl: string;
}
