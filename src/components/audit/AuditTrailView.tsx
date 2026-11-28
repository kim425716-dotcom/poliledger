"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  History,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Fingerprint,
  Search,
  Filter,
  Copy,
  Check,
} from "lucide-react";

export const AuditTrailView = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter((entry) => {
    const matchesSearch =
      entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "ALL" || entry.actorRole === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              Immutable Cryptographic Audit Trail
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
              <ShieldCheck className="h-3 w-3" /> Append-Only Log
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Cryptographically sealed ledger recording every financial mutation, approval decision, and role transition
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none w-48 sm:w-60"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="POLITICIAN">Politician</option>
            <option value="AUDITOR">Auditor</option>
            <option value="CAMPAIGN_MANAGER">Manager</option>
            <option value="STAFF">Staff</option>
            <option value="SYSTEM">System</option>
          </select>
        </div>
      </div>

      {/* Log Feed */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="relative pl-6 border-l-2 border-gray-200 space-y-6">
          {filteredLogs.map((entry) => (
            <div key={entry.id} className="relative group">
              {/* Timeline Status Dot */}
              <div
                className={`absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 bg-white ${
                  entry.status === "VERIFIED"
                    ? "border-emerald-600 text-emerald-600"
                    : entry.status === "REJECTED"
                    ? "border-rose-600 text-rose-600"
                    : entry.status === "ALERT"
                    ? "border-amber-600 text-amber-600"
                    : "border-blue-600 text-blue-600"
                }`}
              />

              <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-4 space-y-2 transition-colors hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-xs">
                      {entry.action.replace(/_/g, " ")}
                    </span>
                    <span className="rounded bg-gray-200 px-1.5 py-0.2 text-[9px] font-semibold text-gray-700">
                      {entry.actorRole}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      &bull; IP: {entry.ipAddress}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {entry.timestamp.replace("T", " ").replace("Z", " UTC")}
                  </span>
                </div>

                <p className="text-xs font-semibold text-blue-900">{entry.entityName}</p>
                <p className="text-xs text-gray-600">{entry.details}</p>

                {/* Footer with Actor and Cryptographic Hash */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-gray-100 text-[11px]">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <UserCheck className="h-3.5 w-3.5 text-gray-400" />
                    <span>Actor: <strong className="text-gray-700">{entry.actorName}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded">
                    <Fingerprint className="h-3 w-3 text-indigo-500" />
                    <span>SHA-256: {entry.hash.slice(0, 20)}...</span>
                    <button
                      onClick={() => handleCopyHash(entry.hash, entry.id)}
                      className="text-gray-400 hover:text-gray-700 ml-1"
                      title="Copy full cryptographic signature"
                    >
                      {copiedId === entry.id ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-6">
              No audit log entries matching your current search and role filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
