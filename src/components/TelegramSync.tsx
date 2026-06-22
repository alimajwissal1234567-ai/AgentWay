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