"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";
import { getCampaignAccentClasses, getNameInitials } from "@/lib/campaign-theme";
import {
  CheckCircle2,
  ShieldCheck,
  Copy,
  Lock,
  Globe2,
} from "lucide-react";

export const PublicTransparencyView = () => {
  const {
    campaigns,
    activeCampaign,
    updateCampaign,
    getCampaignWorkspace,
    formatMoney,
    currentUser,
  } = useApp();

  const [selection, setSelection] = useState<{ forActiveId: string; id: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const inspectedCampaignId =
    selection?.forActiveId === activeCampaign.id ? selection.id : activeCampaign.id;
  const inspectedCampaign =
    campaigns.find((c) => c.id === inspectedCampaignId) || activeCampaign;
  const inspectedWs = getCampaignWorkspace(inspectedCampaign.id);

  // ONLY approved expenses are visible to the public
  const approvedExpenses = inspectedWs.expenses.filter((e) => e.status === "APPROVED");
  const publicTotalSpent = approvedExpenses.reduce((sum, e) => sum + e.amount, 0);

  const canManageVisibility =
    inspectedCampaign.id === activeCampaign.id &&
    (currentUser.role === "POLITICIAN" || currentUser.role === "ADMIN");

  const shareableUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/poliledger/?public=${inspectedCampaign.slug}`
      : `https://logictech.co.ke/poliledger/?public=${inspectedCampaign.slug}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Multi-Politician Public Lookup Switcher */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-xs transition-colors">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Globe2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Public Voter Disclosure Directory ({campaigns.length} Registered Campaigns)</span>
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Citizens and observers can inspect verified spending across any politician opting into public transparency.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {campaigns.map((camp) => {
              const accent = getCampaignAccentClasses(camp.accentColor);
              const isSelected = camp.id === inspectedCampaign.id;
              return (
                <button
                  key={camp.id}
                  type="button"
                  onClick={() =>
                    setSelection({ forActiveId: activeCampaign.id, id: camp.id })
                  }
                  className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${
                      isSelected ? "bg-white/20 text-white" : `bg-gradient-to-tr ${accent.gradient} text-white`
                    }`}
                  >
                    {getNameInitials(camp.politicianName)}
                  </span>
                  <span>{camp.politicianName}</span>
                  {!camp.publicTransparencyEnabled && <Lock className="h-3 w-3 opacity-70" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Banner & Share Link */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                Public Transparency Portal
              </span>
              <span className="flex items-center gap-1 text-xs text-blue-200">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {inspectedCampaign.politicianName} &bull; {inspectedCampaign.office}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Public Accountability &amp; Voter Disclosure — {inspectedCampaign.politicianName}
            </h2>
            <p className="text-xs text-blue-200 max-w-xl">
              {inspectedCampaign.constituency} ({inspectedCampaign.party}) &bull; Read-only public ledger showing only verified, approved campaign expenses. Drafts and staff notes are protected.
            </p>
          </div>

          <div className="flex flex-col gap-2 items-start md:items-end">
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
            {canManageVisibility && (
              <button
                type="button"
                onClick={() =>
                  updateCampaign(inspectedCampaign.id, {
                    publicTransparencyEnabled: !inspectedCampaign.publicTransparencyEnabled,
                  })
                }
                className="text-[11px] font-semibold text-blue-200 hover:text-white underline"
              >
                {inspectedCampaign.publicTransparencyEnabled
                  ? "Switch portal visibility to Private"
                  : "Publish this portal publicly"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Private Notice if campaign opted out */}
      {!inspectedCampaign.publicTransparencyEnabled ? (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/30 p-8 text-center space-y-2">
          <Lock className="h-8 w-8 text-amber-600 dark:text-amber-400 mx-auto" />
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">
            Public Transparency Portal is Currently Set to Private
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {inspectedCampaign.politicianName} has not published this campaign ledger for external public viewing yet.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs transition-colors">
              <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Verified Public Expenditure
              </span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatMoney(publicTotalSpent)}
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                100% backed by approved receipts
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs transition-colors">
              <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Audited Political Events
              </span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {inspectedWs.events.length} Events
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Town halls, rallies, and public meetings
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs transition-colors">
              <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Verified Vouchers
              </span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {approvedExpenses.length} Vouchers
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Certified under Four-Eyes Separation of Duties
              </p>
            </div>
          </div>

          {/* Public Expense Records Table */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs overflow-hidden transition-colors">
            <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/80 px-5 py-3.5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                  Disclosed Campaign Expenses — {inspectedCampaign.politicianName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Published in accordance with campaign finance transparency standards
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/70 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                {approvedExpenses.length} Published
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50/40 dark:bg-gray-800/40">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Purpose / Activity</th>
                    <th className="py-3 px-4">Vendor / Supplier</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Compliance Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {approvedExpenses.map((exp) => (
                    <tr
                      key={exp.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {formatDate(exp.expenseDate)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white">
                        {exp.description}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                        {exp.vendorName || "Certified Supplier"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:text-gray-300">
                          {exp.categoryIcon} {exp.categoryName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                        {exp.eventName || "General Campaign Operations"}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-gray-900 dark:text-white">
                        {formatMoney(exp.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Certified</span>
                        </span>
                      </td>
                    </tr>
                  ))}

                  {approvedExpenses.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8 text-center text-gray-400 dark:text-gray-500"
                      >
                        No approved expenses disclosed yet for {inspectedCampaign.politicianName}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
