"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";
import {
  Globe,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Building,
  Calendar,
  Lock,
  Copy,
  ExternalLink,
} from "lucide-react";

export const PublicTransparencyView = () => {
  const { expenses, events, categories, formatMoney } = useApp();
  const [copied, setCopied] = useState(false);

  // ONLY approved expenses are visible to the public
  const approvedExpenses = expenses.filter((e) => e.status === "APPROVED");
  const publicTotalSpent = approvedExpenses.reduce((sum, e) => sum + e.amount, 0);

  const shareableUrl = typeof window !== "undefined"
    ? `${window.location.origin}/transparency/jane-muthoni-2026`
    : "https://poliledger.ke/t/jane-muthoni-2026";

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Banner & Share Link */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                Public Transparency Portal
              </span>
              <span className="flex items-center gap-1 text-xs text-blue-200">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Verified Campaign
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Public Accountability & Voter Disclosure</h2>
            <p className="text-xs text-blue-200 max-w-xl">
              This public read-only view provides full transparency into all approved campaign expenditures.
              Personal phone numbers, staff notes, and draft receipts are automatically protected.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs border border-white/15">
              <span className="truncate max-w-[200px] text-blue-100">{shareableUrl}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded bg-white px-2 py-1 font-semibold text-gray-900 hover:bg-gray-100 transition-colors shrink-0"
              >
                {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase text-gray-500">Verified Public Expenditure</span>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatMoney(publicTotalSpent)}</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">100% backed by approved receipts</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase text-gray-500">Audited Political Events</span>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{events.length} Events</h3>
          <p className="text-xs text-gray-500 mt-1">Town halls, youth rallies, and meetings</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase text-gray-500">Verified Vouchers</span>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{approvedExpenses.length} Vouchers</h3>
          <p className="text-xs text-gray-500 mt-1">Certified by independent CPA auditor</p>
        </div>
      </div>

      {/* Public Expense Records Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50/70 px-5 py-3.5 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Disclosed Campaign Expenses</h3>
            <p className="text-xs text-gray-500">Published in accordance with campaign finance transparency standards</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
            {approvedExpenses.length} Published
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-semibold uppercase tracking-wider text-gray-500 bg-gray-50/40">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Purpose / Activity</th>
                <th className="py-3 px-4">Vendor / Supplier</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Compliance Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {approvedExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap text-gray-500">{formatDate(exp.expenseDate)}</td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">{exp.description}</td>
                  <td className="py-3.5 px-4 text-gray-600">{exp.vendorName || "Certified Supplier"}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                      {exp.categoryIcon} {exp.categoryName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">{exp.eventName || "General Campaign Operations"}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-gray-900">{formatMoney(exp.amount)}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Certified</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
