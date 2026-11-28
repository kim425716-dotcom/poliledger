"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Shield, Lock, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";

export const SessionLockModal = () => {
  const { currentUser, isSessionLocked, unlockSession, failedUnlockAttempts } = useApp();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (!isSessionLocked) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockSession(pin);
    if (!success) {
      setError(true);
      setPin("");
    } else {
      setError(false);
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl text-white">
        {/* Security Crest */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/25">
          <Lock className="h-8 w-8 text-white" />
        </div>

        <div className="mt-6 text-center space-y-1">
          <h3 className="text-xl font-bold tracking-tight text-white">Session Locked</h3>
          <p className="text-xs text-gray-400">
            PoliLedger Campaign Security &bull; Sensitive Financial Data Protected
          </p>
        </div>

        {/* User Card */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/60 p-3">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500/50"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-sm">
              {currentUser.name[0]}
            </div>
          )}
          <div className="flex-1 text-left min-w-0">
            <p className="font-semibold text-sm text-gray-100 truncate">{currentUser.name}</p>
            <p className="text-xs text-blue-400 truncate">{currentUser.title}</p>
          </div>
          <span className="rounded bg-blue-900/60 border border-blue-700/50 px-2 py-0.5 text-[10px] font-bold text-blue-300">
            {currentUser.role}
          </span>
        </div>

        {/* Unlock Form */}
        <form onSubmit={handleUnlock} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Enter Campaign Access PIN or Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                autoFocus
                placeholder="Enter PIN (e.g. 2026)"
                className="w-full rounded-xl border border-gray-700 bg-gray-800/90 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 tracking-wider"
              />
              <KeyRound className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-500" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-950/60 border border-rose-800/50 p-2.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>
                Authentication failed. Incorrect PIN or password ({failedUnlockAttempts}/5 attempts).
              </span>
            </div>
          )}

          <div className="rounded-lg bg-gray-800/50 p-3 text-[11px] text-gray-400 space-y-1">
            <p className="font-medium text-gray-300">Security Verification Credentials:</p>
            <p>&bull; Default Demo PIN: <code className="text-blue-300 font-mono">2026</code></p>
            <p>&bull; Master Password: <code className="text-blue-300 font-mono">password123</code></p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all active:scale-[0.98]"
          >
            Unlock Financial Ledger
          </button>
        </form>
      </div>
    </div>
  );
};
