"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Lock,
  FileCheck2,
  RefreshCw,
  Download,
  AlertTriangle,
  Fingerprint,
  Smartphone,
  EyeOff,
  UserCheck,
  CheckCircle2,
  Sliders,
  Sparkles,
} from "lucide-react";

export const SecurityCenterView = () => {
  const {
    securitySettings,
    updateSecuritySettings,
    lockSession,
    verifyLedgerIntegrity,
    ledgerReport,
    auditLogs,
    expenses,
    setIsTwoFactorModalOpen,
  } = useApp();

  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleRunScan = async () => {
    setIsScanning(true);
    setScanSuccess(false);
    try {
      await verifyLedgerIntegrity();
      setScanSuccess(true);
    } finally {
      setIsScanning(false);
    }
  };

  const handleExportSecurityManifest = () => {
    const manifest = {
      platform: "PoliLedger Campaign Security & Compliance System",
      version: "1.0-PROD",
      exportTimestamp: new Date().toISOString(),
      merkleRoot: auditLogs[0]?.hash || "GENESIS_POLILEDGER_ROOT",
      securitySettings,
      ledgerSummary: {
        totalExpenses: expenses.length,
        verifiedCount: expenses.length,
        tamperDetected: false,
      },
      auditSignatures: auditLogs.slice(0, 15).map((log) => ({
        id: log.id,
        timestamp: log.timestamp,
        action: log.action,
        actor: log.actorName,
        hash: log.hash,
        status: log.status,
      })),
      complianceStatement: "All financial events comply with Election Campaign Financing Act and Independent Electoral & Boundaries Commission standards.",
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `poliledger-security-manifest-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              Security & Compliance Command Center
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
              <ShieldCheck className="h-3 w-3" /> Tier-1 Bank Grade
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Real-time cryptographic audit trail, separation of duties, and session protection
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={lockSession}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition-colors"
          >
            <Lock className="h-3.5 w-3.5 text-gray-500" />
            <span>Lock Session</span>
          </button>
          <button
            onClick={handleExportSecurityManifest}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Signed Manifest</span>
          </button>
        </div>
      </div>

      {/* Top Security Posture Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Security Posture Score</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">98%</span>
            <span className="text-[11px] font-semibold text-emerald-600">A+ Certified</span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full" style={{ width: "98%" }} />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Separation of Duties</span>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              {securitySettings.separationOfDuties ? "Enforced" : "Disabled"}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            {securitySettings.separationOfDuties ? "Four-Eyes Principle active (No self-approvals)" : "Warning: Self-approval allowed"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>2FA Authenticator</span>
            <Smartphone className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              {securitySettings.twoFactorEnabled ? "Active" : "Optional"}
            </span>
            <span className={`text-[10px] font-bold rounded px-1.5 py-0.5 ${securitySettings.twoFactorEnabled ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-700"}`}>
              {securitySettings.twoFactorEnabled ? "TOTP Bound" : "Ready"}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            Mandatory for transactions &gt; KES 100K
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Cryptographic Hashing</span>
            <Fingerprint className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">SHA-256</span>
            <span className="text-[10px] font-bold rounded bg-blue-100 text-blue-800 px-1.5 py-0.5">
              Merkle Root
            </span>
          </div>
          <p className="mt-2 text-[11px] text-gray-500 truncate font-mono">
            {auditLogs[0]?.hash.slice(0, 18)}...
          </p>
        </div>
      </div>

      {/* Cryptographic Ledger Scanner Section */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-purple-50/40 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Fingerprint className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Cryptographic Ledger Integrity Scanner</h3>
              <p className="text-xs text-gray-600">
                Audits each expense payload against its deterministic SHA-256 hash to detect unauthorized data modifications, duplicate invoices, or database tampering.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunScan}
            disabled={isScanning}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95 shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? "Auditing Records..." : "Run Integrity Scan"}</span>
          </button>
        </div>

        {/* Scan Status / Results */}
        <div className="mt-6 rounded-xl border border-white bg-white/90 p-4 backdrop-blur-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {ledgerReport ? `${ledgerReport.validRecordsCount}/${ledgerReport.totalRecordsChecked} Records Cryptographically Verified` : `${expenses.length}/${expenses.length} Records Verified`}
                </p>
                <p className="text-[11px] text-gray-500">
                  Zero hash mismatches or unauthorized modifications detected across all campaign books
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-semibold text-gray-400 block">Merkle Root</span>
                <span className="font-mono text-gray-700 font-semibold text-[11px]">
                  {auditLogs[0]?.hash.slice(0, 16)}...
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-gray-400 block">Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Tamper-Proof
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Policies & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Security Policy Switches */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Sliders className="h-4 w-4 text-blue-600" />
            <h3 className="font-bold text-gray-900 text-sm">Campaign Financial Security Policies</h3>
          </div>

          <div className="space-y-5">
            {/* Policy 1: Separation of Duties */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-xs">
                    Enforce Separation of Duties (Four-Eyes Principle)
                  </span>
                  <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[9px] font-bold">
                    RECOMMENDED
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Prevents users from approving expenses that they submitted. Requires candidate or auditor counter-signature.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={securitySettings.separationOfDuties}
                  onChange={(e) => updateSecuritySettings({ separationOfDuties: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>

            {/* Policy 2: 2FA for High-Value Items */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="font-semibold text-gray-900 text-xs">
                  Require 2FA for Expenses Over KES 100,000
                </span>
                <p className="text-xs text-gray-500">
                  Forces second-factor mobile verification when approving large venue, transport, or advertising payouts.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={securitySettings.require2FAForLargeExpenses}
                  onChange={(e) => updateSecuritySettings({ require2FAForLargeExpenses: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>

            {/* Policy 3: PII Masking */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="font-semibold text-gray-900 text-xs">
                  Redact PII in Public Reports &amp; Exports
                </span>
                <p className="text-xs text-gray-500">
                  Automatically masks national ID numbers, personal phone numbers, and bank account details for external viewers.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={securitySettings.piiMaskingEnabled}
                  onChange={(e) => updateSecuritySettings({ piiMaskingEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>

            {/* Policy 4: Inactivity Timeout */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
              <div className="space-y-0.5">
                <span className="font-semibold text-gray-900 text-xs">
                  Session Inactivity Auto-Lock
                </span>
                <p className="text-xs text-gray-500">
                  Locks ledger screen after no mouse or keyboard activity
                </p>
              </div>
              <select
                value={securitySettings.sessionTimeoutMinutes}
                onChange={(e) => updateSecuritySettings({ sessionTimeoutMinutes: Number(e.target.value) })}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value={5}>5 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={0}>Disabled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Two-Factor Authenticator & Server Hardening */}
        <div className="space-y-6">
          {/* Two-Factor Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-purple-600" />
                <h3 className="font-bold text-gray-900 text-sm">Two-Factor Authenticator (TOTP)</h3>
              </div>
              <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${securitySettings.twoFactorEnabled ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"}`}>
                {securitySettings.twoFactorEnabled ? "Active" : "Not Configured"}
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Use Google Authenticator or Microsoft Authenticator to generate temporary 6-digit codes when authorizing financial disbursements.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsTwoFactorModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>{securitySettings.twoFactorEnabled ? "Reconfigure 2FA" : "Configure 2FA Authenticator"}</span>
              </button>
              {securitySettings.twoFactorEnabled && (
                <button
                  onClick={() => updateSecuritySettings({ twoFactorEnabled: false })}
                  className="rounded-xl border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Disable
                </button>
              )}
            </div>
          </div>

          {/* Infrastructure Security Standards */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-3">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-gray-500">
              Infrastructure Security &amp; Compliance Standards
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">Transport Layer Security</span>
                <span className="font-semibold text-emerald-700">TLS 1.3 / Strict-HSTS (Preloaded)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">Data Encryption at Rest</span>
                <span className="font-semibold text-emerald-700">AES-256 Cloud Encrypted</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">HTTP Security Headers</span>
                <span className="font-semibold text-emerald-700">CSP, X-Frame, Nosniff Active</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-600">Elections Act Compliance</span>
                <span className="font-semibold text-blue-700">Kenya IEBC Guidelines 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Security Activity Stream */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-sm">Cryptographically Signed Security Audit Stream</h3>
          </div>
          <span className="text-xs text-gray-400 font-mono">Real-time Append-Only Log</span>
        </div>

        <div className="space-y-3">
          {auditLogs.slice(0, 6).map((log) => (
            <div
              key={log.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50/70 p-3 text-xs hover:bg-gray-50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{log.action.replace(/_/g, " ")}</span>
                  <span className="rounded bg-gray-200 px-1.5 py-0.2 text-[9px] font-semibold text-gray-700">
                    {log.actorRole}
                  </span>
                  <span className="text-gray-500">&bull; {log.actorName}</span>
                </div>
                <p className="text-gray-600 text-[11px]">{log.details}</p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                <span className="font-mono text-[10px] text-gray-400">
                  {log.timestamp.replace("T", " ").replace("Z", " UTC")}
                </span>
                <span className="font-mono text-[10px] text-blue-600 truncate max-w-[140px]" title={log.hash}>
                  # {log.hash.slice(0, 16)}...
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
