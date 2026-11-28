"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { CampaignAccentColor, SUPPORTED_CURRENCIES } from "@/lib/types";
import { getCampaignAccentClasses } from "@/lib/campaign-theme";
import { X, UserPlus, ShieldCheck, Globe2, KeyRound } from "lucide-react";

const OFFICE_PRESETS = [
  "Governor",
  "Senator",
  "Member of Parliament",
  "Woman Representative",
  "MCA",
  "Presidential",
];

const ACCENT_OPTIONS: CampaignAccentColor[] = ["blue", "emerald", "purple", "amber", "rose"];

export const CampaignFormModal = () => {
  const { isAddCampaignOpen, setIsAddCampaignOpen, addCampaign, setActiveTab } = useApp();

  const [politicianName, setPoliticianName] = useState("");
  const [office, setOffice] = useState("Member of Parliament");
  const [constituency, setConstituency] = useState("");
  const [party, setParty] = useState("");
  const [electionCycle, setElectionCycle] = useState("Elections 2026");
  const [defaultCurrency, setDefaultCurrency] = useState("KES");
  const [totalBudgetCap, setTotalBudgetCap] = useState("5000000");
  const [accentColor, setAccentColor] = useState<CampaignAccentColor>("emerald");
  const [auditorName, setAuditorName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [accessPin, setAccessPin] = useState("2026");
  const [publicTransparencyEnabled, setPublicTransparencyEnabled] = useState(true);

  if (!isAddCampaignOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!politicianName.trim() || !office.trim() || !constituency.trim()) return;

    addCampaign({
      politicianName,
      office,
      constituency,
      party: party || "Independent Candidate",
      electionCycle,
      accentColor,
      defaultCurrency,
      totalBudgetCap: Math.max(100000, Number(totalBudgetCap) || 5000000),
      publicTransparencyEnabled,
      accessPin: accessPin || "2026",
      auditorName: auditorName || undefined,
      managerName: managerName || undefined,
    });

    setIsAddCampaignOpen(false);
    setActiveTab("dashboard");

    // Reset form state
    setPoliticianName("");
    setConstituency("");
    setParty("");
    setAuditorName("");
    setManagerName("");
    setTotalBudgetCap("5000000");
    setAccessPin("2026");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xl space-y-5 my-8 text-gray-900 dark:text-gray-100 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Register New Politician / Campaign Workspace
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Provision an isolated expense ledger, budget caps, and Four-Eyes audit team
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddCampaignOpen(false)}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Candidate & Party */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Politician Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hon. Samuel Karanja"
                value={politicianName}
                onChange={(e) => setPoliticianName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Political Party / Coalition
              </label>
              <input
                type="text"
                placeholder="e.g. Democratic Alliance (or Independent)"
                value={party}
                onChange={(e) => setParty(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Office & Constituency */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Contested Office / Seat *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Nakuru Governor"
                value={office}
                onChange={(e) => setOffice(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {OFFICE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setOffice(preset)}
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                      office === preset
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Constituency / County / Ward *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Nakuru County"
                value={constituency}
                onChange={(e) => setConstituency(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <div className="mt-1.5">
                <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                  Election Cycle
                </label>
                <input
                  type="text"
                  value={electionCycle}
                  onChange={(e) => setElectionCycle(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 text-[11px] text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Budget Cap, Currency, Pin & Theme Color */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Campaign Budget Cap *
              </label>
              <div className="flex">
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  required
                  min="100000"
                  step="50000"
                  value={totalBudgetCap}
                  onChange={(e) => setTotalBudgetCap(e.target.value)}
                  className="w-full rounded-r-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-2 text-xs font-bold text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                <KeyRound className="h-3.5 w-3.5 text-gray-400" />
                <span>Workspace Lock PIN</span>
              </label>
              <input
                type="text"
                maxLength={12}
                value={accessPin}
                onChange={(e) => setAccessPin(e.target.value)}
                placeholder="2026"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-mono text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Campaign Badge Color
              </label>
              <div className="flex items-center gap-2 pt-1.5">
                {ACCENT_OPTIONS.map((clr) => {
                  const style = getCampaignAccentClasses(clr);
                  return (
                    <button
                      key={clr}
                      type="button"
                      onClick={() => setAccentColor(clr)}
                      aria-label={`Select ${clr} theme`}
                      className={`h-6 w-6 rounded-full ${style.swatch} transition-transform ${
                        accentColor === clr
                          ? "ring-2 ring-offset-2 ring-gray-900 dark:ring-white dark:ring-offset-gray-900 scale-110"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Initial Four-Eyes Audit Team */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-gray-200">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Initial Campaign Finance Team (Four-Eyes Separation of Duties)</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Campaign Manager Name
                </label>
                <input
                  type="text"
                  placeholder="Optional (auto-provisioned if blank)"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Independent CPA / Auditor Name
                </label>
                <input
                  type="text"
                  placeholder="Optional (auto-provisioned if blank)"
                  value={auditorName}
                  onChange={(e) => setAuditorName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Public Portal Toggle */}
          <label className="flex items-start gap-3 rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 p-3 cursor-pointer">
            <input
              type="checkbox"
              checked={publicTransparencyEnabled}
              onChange={(e) => setPublicTransparencyEnabled(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="text-xs">
              <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Enable Public Voter Transparency Portal
              </span>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Allows citizens and observers to view verified, approved campaign expenses on a read-only public link.
              </p>
            </div>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsAddCampaignOpen(false)}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              Create &amp; Open Politician Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
