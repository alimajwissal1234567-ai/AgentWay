import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Wifi, 
  WifiOff, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Cpu, 
  Bot, 
  Terminal, 
  AlertTriangle, 
  PlayCircle,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { TelegramSettings, VocabularyWord } from '../types';

interface TelegramSyncProps {
  settings: TelegramSettings;
  onUpdateSettings: (updates: Partial<TelegramSettings>) => void;
  logs: { id: string; timestamp: string; message: string; type: 'info' | 'success' | 'warn' | 'error' }[];
  isSocketConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onSimulateIncoming: (wordOverride?: string) => void;
  onClearLogs: () => void;
}

export default function TelegramSync({
  settings,
  onUpdateSettings,
  logs,
  isSocketConnected,
  onConnect,
  onDisconnect,
  onSimulateIncoming,
  onClearLogs
}: TelegramSyncProps) {
  // Input password toggles
  const [showToken, setShowToken] = useState<boolean>(false);
  const [testMode, setTestMode] = useState<'idle' | 'testing' | 'success' | 'fail'>('idle');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [customWordSim, setCustomWordSim] = useState<string>('');

  // Local state copy for form inputs
  const [tempToken, setTempToken] = useState<string>(settings.botToken);
  const [tempUrl, setTempUrl] = useState<string>(settings.webhookUrl);
  const [tempUsername, setTempUsername] = useState<string>(settings.botUsername);

  const commandCheatSheet = [
    { cmd: '/add [word]', purpose: 'Instant vocabulary push with AI generated phrases', params: '/add resilient' },
    { cmd: '/query [word]', purpose: 'Look up meaning and sentence directly in speech bubbles', params: '/query paradigm' },
    { cmd: '/review', purpose: 'Prompts OpenClaw to return your oldest pending Review deck', params: '/review' },
    { cmd: '/quiz', purpose: 'Triggers a conversational grammar & lexical game inline', params: '/quiz' },
  ];

  const handleCopyCommand = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleApplySettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      botToken: tempToken,
      webhookUrl: tempUrl,
      botUsername: tempUsername,
      isConnected: true // Turn on sync once applied
    });
  };

  const handleDisconnectSettings = () => {
    onUpdateSettings({
      isConnected: false
    });
    onDisconnect();
  };

  const handleTestHandshake = () => {
    if (!tempToken || !tempUrl) {
      setTestMode('fail');
      setTimeout(() => setTestMode('idle'), 2500);
      return;
    }

    setTestMode('testing');
    setTimeout(() => {
      setTestMode('success');
      onUpdateSettings({ isConnected: true });
      setTimeout(() => setTestMode('idle'), 2500);
    }, 1500);
  };

  return (
    <div className="space-y-8 select-none" id="telegram-sync-panel">
      {/* Visual connection Dashboard Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Connection inputs Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel border border-white/80 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-brand-dark/5 mb-6">
              <div>
                <h3 className="font-display font-medium text-lg text-brand-dark">Connection Settings</h3>
                <p className="text-xs text-gray-400">Secure link gateway to the OpenClaw Telegram Bot backend</p>
              </div>

              <div className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                isSocketConnected 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {isSocketConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                <span>{isSocketConnected ? 'ACTIVE SYNC' : 'OFFLINE'}</span>
              </div>
            </div>

            {/* Disclaimer alerting security */}
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/50 flex gap-3 text-xs leading-relaxed text-amber-800 mb-6">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
              <div>
                <strong className="font-bold">Security Disclaimer:</strong> Never expose your production Telegram Bot Tokens in standard public client-side codes. This field is securely stored locally as an environment mock interface.
              </div>
            </div>

            <form onSubmit={handleApplySettings} className="space-y-4">
              {/* Token Input */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold font-mono block">Telegram Bot Token</label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    placeholder="123456789:AAH_example_token_abcdefg"
                    value={tempToken}
                    onChange={(e) => setTempToken(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-white border border-brand-dark/10 rounded-xl text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none transition-colors"
                    id="telegram-token-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Bot Username */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold font-mono block">Bot User Handle</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">@</span>
                  <input
                    type="text"
                    required
                    placeholder="AgentWayVocabularyBot"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    className="w-full pl-7 pr-4 py-2.5 bg-white border border-brand-dark/10 rounded-xl text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none transition-colors"
                    id="telegram-bot-username-input"
                  />
                </div>
              </div>

              {/* Webhook Endpoint */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold font-mono block">OpenClaw Webhook URL</label>
                <input
                  type="url"
                  placeholder="https://your-openclaw-deployment.run.app/api/webhook/telegram"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-brand-dark/10 rounded-xl text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none transition-colors"
                  id="telegram-webhook-url-input"
                />
              </div>

              {/* Operations row triggers */}
              <div className="flex flex-wrap gap-3.5 pt-4">
                <button
                  type="button"
                  onClick={handleTestHandshake}
                  disabled={testMode === 'testing'}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    testMode === 'success' 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-250' 
                      : testMode === 'fail' 
                        ? 'bg-rose-100 text-rose-800 border-rose-250' 
                        : 'bg-white text-brand-dark border-brand-dark/10 hover:bg-slate-50'
                  }`}
                  id="btn-telegram-test-handshake"
                >
                  {testMode === 'testing' ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-inviting-violet" />
                      <span>Sending ping...</span>
                    </>
                  ) : testMode === 'success' ? (
                    <span>🟢 Connected successfully!</span>
                  ) : testMode === 'fail' ? (
                    <span>🔴 Connection failed!</span>
                  ) : (
                    <>
                      <Cpu className="w-3.5 h-3.5 text-gray-500" />
                      <span>Test Handshake</span>
                    </>
                  )}
                </button>

                {settings.isConnected ? (
                  <button
                    type="button"
                    onClick={handleDisconnectSettings}
                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-100 rounded-xl transition-all cursor-pointer"
                    id="btn-telegram-disconnect"
                  >
                    Disconnect Service
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-brand-dark text-white hover:bg-brand-dark/95 font-semibold text-xs rounded-xl transition-all shadow cursor-pointer"
                    id="btn-telegram-apply-settings"
                  >
                    Apply Sync Settings
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Floating User Engagement commands cheat sheet card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-tr from-sky-400 via-sky-500 to-indigo-600 text-white shadow-xl shadow-sky-500/10 relative overflow-hidden flex flex-col justify-between">
            {/* Absolute vector points */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
            
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white mb-4">
                <Bot className="w-5 h-5 fill-white/10" />
              </div>
              <h3 className="font-display font-medium text-lg text-white">Learn on the Go via Telegram!</h3>
              <p className="text-white/80 text-xs mt-2.5 leading-relaxed">
                Connect your Telegram account to your personal OpenClaw Bot to log, review, and query English vocabulary cards without leaving your IM conversation.
              </p>
            </div>

            <div className="mt-8">
              <a 
                href={`https://t.me/${settings.botUsername || 'YourBotName'}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 py-3 px-4 bg-white text-sky-600 hover:bg-sky-50 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm select-none"
                id="btn-launch-telegram-bot"
              >
                <span>Launch Telegram Bot</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Webhook simulation Terminal Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 border-t border-brand-dark/5">
        {/* Terminal logs monitor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-semibold text-sm text-brand-dark flex items-center gap-2">
              <Terminal className="w-4 h-4 text-gray-500" />
              <span>Gateway Socket Listener Terminal</span>
            </h4>

            {logs.length > 0 && (
              <button 
                onClick={onClearLogs}
                className="text-[11px] font-mono hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer text-gray-400"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Monitor</span>
              </button>
            )}
          </div>

          <div className="p-5 rounded-2xl dark-glass-panel text-[11px] font-mono text-slate-300 min-h-[180px] max-h-[260px] overflow-y-auto space-y-2 border shadow-inner">
            {logs.length > 0 ? (
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-2.5 select-text leading-relaxed"
                  >
                    <span className="text-gray-500 font-bold">[{log.timestamp}]</span>
                    <span className={`font-semibold shrink-0 uppercase ${
                      log.type === 'success' 
                        ? 'text-emerald-450 text-emerald-400' 
                        : log.type === 'warn' 
                          ? 'text-amber-400' 
                          : log.type === 'error' 
                            ? 'text-rose-450 text-rose-400' 
                            : 'text-sky-400'
                    }`}>
                      {log.type}:
                    </span>
                    <span className="text-slate-100 flex-1">{log.message}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <span>🟢 Socket terminal online. Waiting for connection state handshakes or active `/add` triggers.</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Simulator triggering word additions */}
        <div className="lg:col-span-5 space-y-4">
          <h4 className="font-display font-semibold text-sm text-brand-dark flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-indigo-600" />
            <span>Simulate Real-time Sync Event</span>
          </h4>

          <div className="glass-panel rounded-2xl p-4 border border-white/80 shadow-sm space-y-3">
            <p className="text-xs text-gray-500 leading-relaxed">
              Test how the web interface behaves when your Telegram bot parses an on-the-go word from the user. Choose an preloaded complex item below or write a custom word value to trigger instantaneous data injection!
            </p>

            <div className="space-y-2 pt-2">
              <label className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold font-mono block">Custom word parameter override</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. paradigm"
                  value={customWordSim}
                  onChange={(e) => setCustomWordSim(e.target.value)}
                  className="px-3 py-2 bg-white flex-1 border border-brand-dark/10 rounded-xl text-xs focus:ring-1 focus:ring-inviting-violet focus:outline-none"
                  id="custom-word-simulator-input"
                />
                
                <button
                  type="button"
                  onClick={() => {
                    onSimulateIncoming(customWordSim);
                    setCustomWordSim('');
                  }}
                  disabled={!isSocketConnected}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl text-white flex items-center gap-1 cursor-pointer transition-all ${
                    isSocketConnected 
                      ? 'bg-inviting-violet hover:bg-violet-600 shadow' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  id="btn-simulate-telegram-message-trigger"
                >
                  <span>Sync Word</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {!isSocketConnected && (
                <p className="text-[10px] text-rose-500 font-mono italic">
                  * Note: Please complete connection settings setup above before simulating telemetry syncs.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copy Commands Section */}
      <div className="space-y-4 pt-6 border-t border-brand-dark/5">
        <h4 className="font-display font-semibold text-sm text-brand-dark">Bot Available Commands Cheat-Sheet</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="telegram-command-cheat-sheet">
          {commandCheatSheet.map((item, index) => (
            <div key={index} className="bg-white/70 border border-brand-dark/5 rounded-xl p-4 flex justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold font-mono text-inviting-violet block">{item.cmd}</span>
                <p className="text-xs text-gray-505 leading-relaxed">{item.purpose}</p>
                <div className="text-[10px] text-gray-400 font-mono italic">e.g. {item.params}</div>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => handleCopyCommand(item.params, index)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-brand-dark hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Copy Example Parameters"
                >
                  {copiedIndex === index ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";

export default function TelegramSync() {
  const [botUserHandle, setBotUserHandle] = useState("");

  // Remove @ and whitespace
  const cleanBotHandle = botUserHandle.replace("@", "").trim();

  // Dynamic Telegram URL
  const telegramBotUrl = cleanBotHandle
    ? `https://t.me/${cleanBotHandle}`
    : "#";

  return (
    <div className="telegram-sync-container">
      {/* Left Panel */}
      <div className="settings-panel">
        <label className="form-label">BOT USER HANDLE</label>

        <input
          type="text"
          value={botUserHandle}
          onChange={(e) => setBotUserHandle(e.target.value)}
          placeholder="@MyTelegramBot"
          className="form-input"
        />
      </div>

      {/* Right Card */}
      <div className="telegram-card">
        <h3>Learn on the Go via Telegram!</h3>

        {cleanBotHandle ? (
          <a
            href={telegramBotUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="launch-button"
          >
            Launch Telegram Bot
          </a>
        ) : (
          <button
            disabled
            className="launch-button opacity-50 cursor-not-allowed"
          >
            Launch Telegram Bot
          </button>
        )}
      </div>
    </div>
  );
}