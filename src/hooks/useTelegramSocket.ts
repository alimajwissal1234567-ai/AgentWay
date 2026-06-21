import { useState, useEffect, useCallback, useRef } from 'react';
import { TelegramSettings, VocabularyWord } from '../types';

// Pre-curated high-quality agentic words to simulate incoming Telegram messages nicely
const TELEGRAM_WORD_POOL: Omit<VocabularyWord, 'id' | 'dateAdded' | 'status' | 'timesReviewed'>[] = [
  {
    word: 'autonomous',
    phonetic: '/ɔːˈtɒnəməs/',
    partOfSpeech: 'adj.',
    chineseMeaning: '自主的，自治的，独立生存的',
    synonyms: ['independent', 'self-governing', 'sovereign'],
    antonyms: ['dependent', 'subservient', 'controlled'],
    collocations: ['autonomous agents', 'autonomous systems', 'autonomous decision-making'],
    aiSection: {
      exampleSentence: 'The OpenClaw platform orchestrates multiple autonomous agents to solve complex workflows.',
      exampleTranslation: 'OpenClaw 平台协调多个自主智能体来解决复杂的流程工作流。',
      sourcePub: 'TechCrunch',
      sourceUrl: 'https://techcrunch.com'
    }
  },
  {
    word: 'resilience',
    phonetic: '/rɪˈzɪliəns/',
    partOfSpeech: 'n.',
    chineseMeaning: '恢复力，弹性，韧性',
    synonyms: ['elasticity', 'flexibility', 'buoyancy', 'grit'],
    antonyms: ['fragility', 'vulnerability', 'weakness'],
    collocations: ['climate resilience', 'building resilience', 'emotional resilience'],
    aiSection: {
      exampleSentence: 'Distributed systems require high resilience to withstand sudden network spikes and hardware failures.',
      exampleTranslation: '分布式系统需要极高的恢复力以抵御突发性的网络尖峰和硬件故障。',
      sourcePub: 'WIRED',
      sourceUrl: 'https://wired.com'
    }
  },
  {
    word: 'ubiquitous',
    phonetic: '/juːˈbɪkwɪtəs/',
    partOfSpeech: 'adj.',
    chineseMeaning: '无所不在的，普遍存在的',
    synonyms: ['omnipresent', 'pervasive', 'widespread'],
    antonyms: ['rare', 'scarce', 'localized'],
    collocations: ['ubiquitous computing', 'ubiquitous presence', 'ubiquitous technology'],
    aiSection: {
      exampleSentence: 'Mobile devices have made high-speed internet access ubiquitous across the globe.',
      exampleTranslation: '移动设备使高速互联网在全球范围内变得无所不在。',
      sourcePub: 'Reuters',
      sourceUrl: 'https://reuters.com'
    }
  },
  {
    word: 'mitigate',
    phonetic: '/ˈmɪtɪɡeɪt/',
    partOfSpeech: 'v.',
    chineseMeaning: '缓和，减轻，使温和',
    synonyms: ['alleviate', 'moderate', 'temper', 'assuage'],
    antonyms: ['aggravate', 'intensify', 'exacerbate'],
    collocations: ['mitigate risks', 'mitigate effects', 'mitigate climate change'],
    aiSection: {
      exampleSentence: 'By caching heavy database queries, we can mitigate response latency during high traffic.',
      exampleTranslation: '通过缓存高负载数据库查询，我们可以缓解高流量期间的响应延迟。',
      sourcePub: 'Bloomberg',
      sourceUrl: 'https://bloomberg.com'
    }
  },
  {
    word: 'synthesize',
    phonetic: '/ˈsɪnθəsaɪz/',
    partOfSpeech: 'v.',
    chineseMeaning: '合成，综合，人工精制',
    synonyms: ['integrate', 'blend', 'unify', 'combine'],
    antonyms: ['separate', 'analyze', 'dissect'],
    collocations: ['synthesize information', 'synthesize chemicals', 'synthesize theories'],
    aiSection: {
      exampleSentence: 'The AI tutor parses multiple publications to synthesize an ideal contextual example sentence.',
      exampleTranslation: 'AI 导师解析多篇刊物以合成出一个最佳的上下文例句。',
      sourcePub: 'Nature Intelligence',
      sourceUrl: 'https://nature.com'
    }
  }
];

export interface UseTelegramSocketReturn {
  isSocketConnected: boolean;
  logs: { id: string; timestamp: string; message: string; type: 'info' | 'success' | 'warn' | 'error' }[];
  connectSocket: () => void;
  disconnectSocket: () => void;
  simulateTelegramIncomingWord: (wordOverride?: string) => void;
  clearLogs: () => void;
}

export function useTelegramSocket(
  settings: TelegramSettings,
  onWordSynced?: (word: VocabularyWord) => void
): UseTelegramSocketReturn {
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const [logs, setLogs] = useState<{ id: string; timestamp: string; message: string; type: 'info' | 'success' | 'warn' | 'error' }[]>([]);

  const addLog = useCallback((message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const newLog = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 50)); // Hold up to 50 logs
  }, []);

  // Sync state with settings
  useEffect(() => {
    if (settings.isConnected && settings.botToken && settings.webhookUrl) {
      // Simulate socket connection setup
      setIsSocketConnected(true);
      addLog(`Connecting to Telegram Gateway via webhook: ${settings.webhookUrl.substring(0, 30)}...`, 'info');
      
      const timer = setTimeout(() => {
        addLog(`WebSocket connection established with OpenClaw Bot (@${settings.botUsername || 'YourBotName'})`, 'success');
        addLog(`Listening for slash commands (/add, /query, /review) associated with this account...`, 'info');
      }, 700);

      return () => {
        clearTimeout(timer);
        setIsSocketConnected(false);
      };
    } else {
      setIsSocketConnected(false);
    }
  }, [settings.isConnected, settings.botToken, settings.webhookUrl, settings.botUsername, addLog]);

  const connectSocket = useCallback(() => {
    if (!settings.botToken || !settings.webhookUrl) {
      addLog('Cannot connect: Please provide a Telegram Bot Token and Webhook URL first.', 'error');
      return;
    }
    setIsSocketConnected(true);
    addLog(`Initiating socket handshake...`, 'info');
    setTimeout(() => {
      addLog(`Connected securely! Telegram webhook client listener status is set to fully operational.`, 'success');
    }, 500);
  }, [settings.botToken, settings.webhookUrl, addLog]);

  const disconnectSocket = useCallback(() => {
    setIsSocketConnected(false);
    addLog('WebSocket disconnected by user control. Stopping real-time event updates.', 'warn');
  }, [addLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Simulate receiving a message from Telegram bot
  const simulateTelegramIncomingWord = useCallback((wordOverride?: string) => {
    if (!settings.isConnected) {
      addLog('Sync aborted: Setup the connection first via the Telegram Connect tab!', 'error');
      return;
    }

    addLog('Incoming Webhook notification received from Telegram API...', 'info');

    setTimeout(() => {
      // Pick a random word or custom override
      let selection;
      if (wordOverride) {
        const cleanedStr = wordOverride.trim().toLowerCase();
        const found = TELEGRAM_WORD_POOL.find(w => w.word === cleanedStr);
        if (found) {
          selection = found;
        } else {
          // Generate a brand new one dynamically
          selection = {
            word: cleanedStr,
            phonetic: `/${cleanedStr}/`,
            partOfSpeech: 'n.',
            chineseMeaning: '通过电报群添加的自定义单词',
            synonyms: ['telegram-word', 'synced'],
            antonyms: ['unconnected'],
            collocations: ['Telegram sync', 'OpenClaw webhook'],
            aiSection: {
              exampleSentence: `The user added the custom word "${cleanedStr}" on Telegram to test the real-time sync.`,
              exampleTranslation: `用户在 Telegram 上添加了自定义单词 "${cleanedStr}"，以测试实时同步。`,
              sourcePub: 'OpenClaw System',
              sourceUrl: 'https://telegram.org'
            }
          };
        }
      } else {
        // Pick random
        const idx = Math.floor(Math.random() * TELEGRAM_WORD_POOL.length);
        selection = TELEGRAM_WORD_POOL[idx];
      }

      const syncResult: VocabularyWord = {
        ...selection,
        id: Math.random().toString(36).substring(7),
        status: 'new',
        dateAdded: new Date().toISOString().split('T')[0],
        timesReviewed: 0
      };

      addLog(`Parsed Telegram Message: "/add ${syncResult.word}" from tele_user_982`, 'success');
      addLog(`Auto-synced word "${syncResult.word.toUpperCase()}" directly into AgentWay DB! ✨`, 'success');

      if (onWordSynced) {
        onWordSynced(syncResult);
      }
    }, 800);
  }, [settings.isConnected, onWordSynced, addLog]);

  return {
    isSocketConnected,
    logs,
    connectSocket,
    disconnectSocket,
    simulateTelegramIncomingWord,
    clearLogs
  };
}
