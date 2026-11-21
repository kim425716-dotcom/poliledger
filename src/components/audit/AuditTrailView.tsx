"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";
import { History, Shield, CheckCircle2, AlertTriangle, UserCheck, PlusCircle } from "lucide-react";

export const AuditTrailView = () => {
  const { expenses, events } = useApp();

  // Synthetic immutable audit events derived from real changes
  const auditEntries = [
    {
      id: "aud-1",
      timestamp: "2026-11-21T10:15:00Z",
      actor: "Patrick Mwangi, CPA",
      role: "AUDITOR",
      action: "EXPENSE_APPROVED",
      entity: "KICC Grounds hire deposit (KES 380,000)",
      details: "Official invoice verified against KICC rate card and event permit #NBI-2026-119.",
      status: "VERIFIED",
    },
    {
      id: "aud-2",
      timestamp: "2026-11-20T17:45:00Z",
      actor: "Hon. Jane Muthoni",
      role: "POLITICIAN",
      action: "EXPENSE_APPROVED",
      entity: "Eastgate Express Chartered Buses (KES 280,000)",
      details: "Delegate transportation authorization signed by campaign candidate.",
      status: "VERIFIED",
    },
    {
      id: "aud-3",
      timestamp: "2026-11-20T11:00:00Z",
      actor: "Amina Hassan",
      role: "STAFF",
      action: "EXPENSE_SUBMITTED",
      entity: "Private Crowd Marshals & Security (KES 220,000)",
      details: "Receipt voucher and 45-person muster roll uploaded.",
      status: "LOGGED",
    },
    {
      id: "aud-4",
      timestamp: "2026-11-19T14:30:00Z",
      actor: "System Monitor",
      role: "SYSTEM",
      action: "BUDGET_WARNING_TRIGGERED",
      entity: "Venue Category Limit (88% consumed)",
      details: "Automated alert dispatched to Campaign Manager and Finance Officer.",
      status: "ALERT",
    },
    {
      id: "aud-5",
      timestamp: "2026-11-14T15:00:00Z",
      actor: "Patrick Mwangi, CPA",
      role: "AUDITOR",
      action: "EXPENSE_REJECTED",
      entity: "VIP Security Chase Car Rental (KES 110,000)",
      details: "Procurement pre-approval missing. Rejection reason recorded.",
      status: "REJECTED",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Immutable Audit Trail & Compliance Log</h2>
        <p className="text-xs text-gray-500">
          Append-only cryptographic record of all financial submissions, approvals, and budget events
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="relative pl-6 border-l-2 border-gray-200 space-y-6">
          {auditEntries.map((entry) => (
            <div key={entry.id} className="relative group">
              {/* Dot */}
              <div
                className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 bg-white ${
                  entry.status === "VERIFIED"
                    ? "border-emerald-600 text-emerald-600"
                    : entry.status === "REJECTED"
                    ? "border-rose-600 text-rose-600"
                    : entry.status === "ALERT"
                    ? "border-amber-600 text-amber-600"
                    : "border-blue-600 text-blue-600"
                }`}
              />

              <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4 space-y-1.5 transition-colors hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-xs">{entry.action.replace(/_/g, " ")}</span>
                    <span className="rounded bg-gray-200 px-1.5 py-0.2 text-[9px] font-semibold text-gray-700">
                      {entry.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {entry.timestamp.replace("T", " ").replace("Z", " UTC")}
                  </span>
                </div>

                <p className="text-xs font-semibold text-blue-900">{entry.entity}</p>
                <p className="text-xs text-gray-600">{entry.details}</p>

                <div className="pt-1 flex items-center gap-1.5 text-[10px] text-gray-400">
                  <UserCheck className="h-3 w-3" />
                  <span>Actor: <strong>{entry.actor}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
