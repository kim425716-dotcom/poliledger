"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Role, ROLE_LABELS } from "@/lib/types";
import { getCampaignAccentClasses, getNameInitials } from "@/lib/campaign-theme";
import {
  Users,
  Plus,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Globe2,
  CalendarDays,
  Receipt,
  UserPlus,
  Trash2,
  Building2,
  Lock,
} from "lucide-react";

export const CampaignsOverviewView = () => {
  const {
    campaigns,
    activeCampaignId,
    switchCampaign,
    updateCampaign,
    deleteCampaign,
    addTeamMember,
    getCampaignWorkspace,
    getCampaignMetrics,
    setIsAddCampaignOpen,
    setActiveTab,
    formatMoney,
  } = useApp();

  const [search, setSearch] = useState("");
  const [teamTargetCampaignId, setTeamTargetCampaignId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState<Role>("STAFF");
  const [memberTitle, setMemberTitle] = useState("");

  // Aggregate metrics across ALL registered politicians
  const platformSummary = campaigns.reduce(
    (acc, c) => {
      const m = getCampaignMetrics(c.id);
      return {
        totalSpent: acc.totalSpent + m.totalSpent,
        totalBudget: acc.totalBudget + m.totalBudget,
        totalPending: acc.totalPending + m.pendingCount,
        totalEvents: acc.totalEvents + m.eventCount,
      };
    },
    { totalSpent: 0, totalBudget: 0, totalPending: 0, totalEvents: 0 }
  );

  const filteredCampaigns = campaigns.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.politicianName.toLowerCase().includes(q) ||
      c.office.toLowerCase().includes(q) ||
      c.constituency.toLowerCase().includes(q) ||
      c.party.toLowerCase().includes(q)
    );
  });

  const handleOpenWorkspace = (campaignId: string) => {
    switchCampaign(campaignId);
    setActiveTab("dashboard");
  };

  const handleAddMemberSubmit = (e: React.FormEvent, campaignId: string) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) return;
    addTeamMember(campaignId, {
      name: memberName,
      email: memberEmail,
      role: memberRole,
      title: memberTitle || ROLE_LABELS[memberRole],
    });
    setMemberName("");
    setMemberEmail("");
    setMemberTitle("");
    setTeamTargetCampaignId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Politicians &amp; Multi-Campaign Directory
            </h2>
            <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300">
              {campaigns.length} Campaigns
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Isolate budgets, events, receipts, teams, and audit trails per politician while overseeing coalition compliance
          </p>
        </div>

        <button
          onClick={() => setIsAddCampaignOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Politician</span>
        </button>
      </div>

      {/* Platform-Wide Multi-Candidate Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Registered Politicians
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {campaigns.length}
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            Isolated tenant ledgers active
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Aggregate Campaign Spend
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {formatMoney(platformSummary.totalSpent)}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Across {formatMoney(platformSummary.totalBudget)} total caps
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Pending Sign-offs (All)
          </p>
          <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {platformSummary.totalPending}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Claims awaiting independent verification
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Scheduled Rallies &amp; Forums
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {platformSummary.totalEvents}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Combined campaign operations calendar
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3.5 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by politician name, office, county, or party..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-9 pr-3 py-1.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          Each politician maintains separate receipts, team roles, Four-Eyes audit logs, and public links.
        </p>
      </div>

      {/* Politician Campaign Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {filteredCampaigns.map((camp) => {
          const metrics = getCampaignMetrics(camp.id);
          const ws = getCampaignWorkspace(camp.id);
          const accent = getCampaignAccentClasses(camp.accentColor);
          const isActive = camp.id === activeCampaignId;
          const isAddingMember = teamTargetCampaignId === camp.id;

          return (
            <div
              key={camp.id}
              className={`rounded-2xl border bg-white dark:bg-gray-900 p-5 shadow-xs transition-all space-y-4 ${
                isActive
                  ? "border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/15"
                  : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
              }`}
            >
              {/* Top Identity Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  {camp.avatar ? (
                    <img
                      src={camp.avatar}
                      alt={camp.politicianName}
                      className={`h-12 w-12 rounded-xl object-cover ring-2 ${accent.ring} shrink-0`}
                    />
                  ) : (
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${accent.gradient} text-sm font-bold text-white shadow-sm`}
                    >
                      {getNameInitials(camp.politicianName)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">
                        {camp.politicianName}
                      </h3>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${accent.badge}`}
                      >
                        {camp.office}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {camp.constituency}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                      {camp.party} &bull; {camp.electionCycle}
                    </p>
                  </div>
                </div>

                {/* Public Visibility Toggle Pill */}
                <button
                  type="button"
                  onClick={() =>
                    updateCampaign(camp.id, {
                      publicTransparencyEnabled: !camp.publicTransparencyEnabled,
                    })
                  }
                  className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors shrink-0 ${
                    camp.publicTransparencyEnabled
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                      : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  }`}
                  title="Toggle Public Voter Transparency Portal"
                >
                  {camp.publicTransparencyEnabled ? (
                    <>
                      <Globe2 className="h-3 w-3" />
                      <span>Public Live</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3" />
                      <span>Private</span>
                    </>
                  )}
                </button>
              </div>

              {/* Financial Progress */}
              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    Spend vs Ceiling:{" "}
                    <strong className="text-gray-900 dark:text-white">
                      {formatMoney(metrics.totalSpent)}
                    </strong>
                  </span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {metrics.budgetPercentage}% of {formatMoney(metrics.totalBudget)}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      metrics.budgetPercentage >= 90
                        ? "bg-rose-500"
                        : metrics.budgetPercentage >= 75
                        ? "bg-amber-500"
                        : accent.progress
                    }`}
                    style={{ width: `${Math.min(100, metrics.budgetPercentage)}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Receipt className="h-3.5 w-3.5 text-gray-400" />
                    <span>
                      <strong className="text-gray-900 dark:text-white">{metrics.pendingCount}</strong> pending
                    </span>
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                    <span>
                      <strong className="text-gray-900 dark:text-white">{metrics.eventCount}</strong> events
                    </span>
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <Users className="h-3.5 w-3.5 text-gray-400" />
                    <span>
                      <strong className="text-gray-900 dark:text-white">{metrics.teamCount}</strong> team
                    </span>
                  </div>
                </div>
              </div>

              {/* Team Roster Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Authorized Campaign Team ({ws.users.length})
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setTeamTargetCampaignId(isAddingMember ? null : camp.id)
                    }
                    className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <UserPlus className="h-3 w-3" />
                    <span>{isAddingMember ? "Close" : "Add Staff / Auditor"}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {ws.users.map((u) => (
                    <span
                      key={u.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-[11px] text-gray-700 dark:text-gray-300"
                      title={u.title}
                    >
                      <span className="font-semibold text-gray-900 dark:text-white">{u.name}</span>
                      <span className="text-[9px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                        &bull; {u.role}
                      </span>
                    </span>
                  ))}
                </div>

                {/* Inline Add Team Member Drawer */}
                {isAddingMember && (
                  <form
                    onSubmit={(e) => handleAddMemberSubmit(e, camp.id)}
                    className="mt-2 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/40 dark:bg-blue-950/30 p-3 space-y-2.5"
                  >
                    <p className="text-[11px] font-bold text-blue-900 dark:text-blue-200">
                      Onboard Team Member to {camp.politicianName}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-xs text-gray-900 dark:text-white"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-xs text-gray-900 dark:text-white"
                      />
                      <select
                        value={memberRole}
                        onChange={(e) => setMemberRole(e.target.value as Role)}
                        className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-xs text-gray-900 dark:text-white"
                      >
                        <option value="STAFF">Field Staff</option>
                        <option value="CAMPAIGN_MANAGER">Campaign Manager</option>
                        <option value="AUDITOR">Auditor / Finance Officer</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Title (e.g. Ward Treasurer)"
                        value={memberTitle}
                        onChange={(e) => setMemberTitle(e.target.value)}
                        className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-xs text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        Add Member
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
                <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Slug: <code className="font-mono">/t/{camp.slug}</code></span>
                </div>

                <div className="flex items-center gap-2">
                  {campaigns.length > 1 && (
                    confirmDeleteId === camp.id ? (
                      <div className="flex items-center gap-1.5 rounded-lg border border-rose-200 dark:border-rose-800/70 bg-rose-50 dark:bg-rose-950/50 px-2 py-1">
                        <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300">
                          Delete?
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            deleteCampaign(camp.id);
                            setConfirmDeleteId(null);
                          }}
                          className="rounded bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-rose-700"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(camp.id)}
                        className="rounded-lg border border-gray-200 dark:border-gray-700 p-2 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Campaign Workspace"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenWorkspace(camp.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                    }`}
                  >
                    <span>{isActive ? "Open Active Dashboard" : "Switch Workspace"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredCampaigns.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-10 text-center text-xs text-gray-500 dark:text-gray-400">
            No politicians match &ldquo;{search}&rdquo;. Register a new politician campaign or clear your search filter.
          </div>
        )}
      </div>
    </div>
  );
};
