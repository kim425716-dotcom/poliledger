"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { copyToClipboard } from "@/lib/utils";
import { ShieldCheck, X, Copy, Check, Smartphone } from "lucide-react";

export const TwoFactorModal = () => {
  const {
    isTwoFactorModalOpen,
    setIsTwoFactorModalOpen,
    updateSecuritySettings,
    logAuditEvent,
  } = useApp();

  const [verificationCode, setVerificationCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isTwoFactorModalOpen) return null;

  const secretKey = "POLI-7K2X-M9WQ-2026-AUTH";

  const handleCopy = async () => {
    await copyToClipboard(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim().length !== 6 || !/^\d+$/.test(verificationCode.trim())) {
      setError("Please enter a valid 6-digit TOTP verification code.");
      return;
    }

    // Success simulation
    setSuccess(true);
    setError("");
    updateSecuritySettings({ twoFactorEnabled: true });

    logAuditEvent(
      "MFA_TOTP_ENABLED",
      "sec-mfa",
      "Two-Factor Authentication",
      "TOTP Two-Factor Authenticator successfully bound to political candidate/finance profile.",
      "VERIFIED"
    );

    setTimeout(() => {
      setIsTwoFactorModalOpen(false);
      setSuccess(false);
      setVerificationCode("");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-2xl text-gray-900 dark:text-gray-100 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Two-Factor Authentication (2FA / TOTP)</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Protect political campaign finances from unauthorized access</p>
            </div>
          </div>
          <button
            onClick={() => setIsTwoFactorModalOpen(false)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-5 space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-blue-100 dark:border-blue-800/60 bg-blue-50/60 dark:bg-blue-950/40 p-3 text-xs text-blue-900 dark:text-blue-200">
            <Smartphone className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
            <p>
              Link your mobile authenticator app (Google Authenticator, Microsoft Authenticator, or Authy) to generate time-based one-time codes for approving high-value campaign expenses.
            </p>
          </div>

          {/* Visual QR Code Mock */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-200 dark:border-gray-700 p-2 shadow-xs">
              {/* SVG QR Code Simulation */}
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <rect width="100" height="100" fill="#ffffff" />
                {/* Corners */}
                <rect x="5" y="5" width="30" height="30" fill="#1e293b" />
                <rect x="9" y="9" width="22" height="22" fill="#ffffff" />
                <rect x="13" y="13" width="14" height="14" fill="#1e293b" />

                <rect x="65" y="5" width="30" height="30" fill="#1e293b" />
                <rect x="69" y="9" width="22" height="22" fill="#ffffff" />
                <rect x="73" y="13" width="14" height="14" fill="#1e293b" />

                <rect x="5" y="65" width="30" height="30" fill="#1e293b" />
                <rect x="9" y="69" width="22" height="22" fill="#ffffff" />
                <rect x="13" y="73" width="14" height="14" fill="#1e293b" />

                {/* Pattern dots */}
                <rect x="42" y="10" width="8" height="8" fill="#1e293b" />
                <rect x="42" y="24" width="8" height="8" fill="#1e293b" />
                <rect x="52" y="16" width="8" height="8" fill="#1e293b" />
                <rect x="10" y="42" width="8" height="8" fill="#1e293b" />
                <rect x="24" y="42" width="8" height="8" fill="#1e293b" />
                <rect x="42" y="42" width="16" height="16" fill="#3b82f6" />
                <rect x="65" y="42" width="8" height="8" fill="#1e293b" />
                <rect x="80" y="42" width="10" height="8" fill="#1e293b" />
                <rect x="42" y="65" width="8" height="12" fill="#1e293b" />
                <rect x="56" y="65" width="8" height="8" fill="#1e293b" />
                <rect x="70" y="70" width="18" height="8" fill="#1e293b" />
                <rect x="50" y="80" width="12" height="10" fill="#1e293b" />
                <rect x="75" y="85" width="15" height="10" fill="#1e293b" />
              </svg>
            </div>

            <div className="space-y-2 text-left w-full">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Manual Setup Key
              </span>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs font-mono text-gray-800 dark:text-gray-200">
                <span className="flex-1 truncate">{secretKey}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
                  title="Copy Key"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Scan the QR code with your authenticator or paste the manual key.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Enter 6-Digit Code from Authenticator App
              </label>
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                className="w-full text-center text-xl font-mono tracking-widest rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
              {error && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>}
              {success && (
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4" /> Two-Factor Authentication Verified &amp; Activated!
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsTwoFactorModalOpen(false)}
                className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-purple-700"
              >
                Verify &amp; Enable 2FA
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
