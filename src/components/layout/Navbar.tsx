"use client";

import React, { useState } from "react";
import { useApp, CURRENCY_SYMBOLS } from "@/context/AppContext";
import { ROLE_LABELS } from "@/lib/types";
import { getCampaignAccentClasses, getNameInitials } from "@/lib/campaign-theme";
import {
  Bell,
  Plus,
  Shield,
  ChevronDown,
  FileCheck2,
  AlertTriangle,
  X,
  Lock,
  ShieldCheck,
  Sun,
  Moon,
  Users,
  UserPlus,
  Check,
  Menu,
  LayoutDashboard,
  Receipt,
  CalendarDays,
  Target,
  FileSpreadsheet,
  Globe2,
  History,
} from "lucide-react";

export const Navbar = () => {
  const {
    campaigns,
    activeCampaign,
    activeCampaignId,
    switchCampaign,
    setIsAddCampaignOpen,
    getCampaignMetrics,
    currentUser,
    switchUser,
    allUsers,
    selectedCurrency,
    setSelectedCurrency,
    budgetAlerts,
    dismissedAlerts,
    expenses,
    setIsAddExpenseOpen,
    activeTab,
    setActiveTab,
    lockSession,
    isDarkMode,
    toggleDarkMode,
    formatMoney,
  } = useApp();

  const [isCampaignDropdownOpen, setIsCampaignDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeAlerts = budgetAlerts.filter((a) => !dismissedAlerts.includes(a.id));
  const pendingCount = expenses.filter((e) => e.status === "SUBMITTED").length;
  const totalNotifications = activeAlerts.length + pendingCount;
  const activeAccent = getCampaignAccentClasses(activeCampaign.accentColor);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "POLITICIAN":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800/60";
      case "CAMPAIGN_MANAGER":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800/60";
      case "STAFF":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/60";
      case "AUDITOR":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/60";
      case "ADMIN":
        return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/60";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const mobileNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "campaigns", label: `Politicians (${campaigns.length})`, icon: Users },
    { id: "expenses", label: "Expenses", icon: Receipt },
    { id: "events", label: "Meetings & Rallies", icon: CalendarDays },
    { id: "budgets", label: "Budgets & Limits", icon: Target },
    { id: "reports", label: "Reports & Exports", icon: FileSpreadsheet },
    { id: "transparency", label: "Public Portal", icon: Globe2 },
    { id: "audit", label: "Audit Trail", icon: History },
    { id: "security", label: "Security Center", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-2">
        {/* Brand + Active Politician Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Open Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div
            onClick={() => setActiveTab("dashboard")}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/20"
          >
            <Shield className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                onClick={() => setActiveTab("dashboard")}
                className="cursor-pointer font-bold tracking-tight text-gray-900 dark:text-white text-base sm:text-lg"
              >
                PoliLedger
              </span>
              <span className="hidden sm:inline-block rounded-full bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {activeCampaign.electionCycle}
              </span>
            </div>

            {/* Politician / Campaign Switcher Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsCampaignDropdownOpen(!isCampaignDropdownOpen);
                  setIsRoleDropdownOpen(false);
                  setIsAlertsOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors max-w-[200px] sm:max-w-xs"
                title="Switch Politician Campaign Workspace"
              >
                <span className="truncate font-medium">
                  {activeCampaign.politicianName}
                </span>
                <span
                  className={`hidden md:inline-block rounded border px-1.5 py-0 text-[9px] font-bold shrink-0 ${activeAccent.badge}`}
                >
                  {activeCampaign.office}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              </button>

              {/* Politician Switcher Dropdown */}
              {isCampaignDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2.5 shadow-2xl z-50 text-gray-900 dark:text-gray-100">
                  <div className="flex items-center justify-between px-2.5 pb-2 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Politician Workspaces ({campaigns.length})
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        Select a campaign to isolate its ledger &amp; approvals
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCampaignDropdownOpen(false);
                        setActiveTab("campaigns");
                      }}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Directory
                    </button>
                  </div>

                  <div className="mt-2 space-y-1.5 max-h-72 overflow-y-auto">
                    {campaigns.map((camp) => {
                      const metrics = getCampaignMetrics(camp.id);
                      const accent = getCampaignAccentClasses(camp.accentColor);
                      const isCurrent = camp.id === activeCampaignId;

                      return (
                        <button
                          key={camp.id}
                          type="button"
                          onClick={() => {
                            switchCampaign(camp.id);
                            setIsCampaignDropdownOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${
                            isCurrent
                              ? "bg-blue-50 dark:bg-blue-950/60 ring-1 ring-blue-500/30"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          {camp.avatar ? (
                            <img
                              src={camp.avatar}
                              alt={camp.politicianName}
                              className="h-9 w-9 rounded-lg object-cover shrink-0"
                            />
                          ) : (
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr ${accent.gradient} text-xs font-bold text-white`}
                            >
                              {getNameInitials(camp.politicianName)}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                {camp.politicianName}
                              </p>
                              {isCurrent && (
                                <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-0.5">
                              <span
                                className={`inline-block rounded border px-1.5 py-0 text-[9px] font-semibold ${accent.badge}`}
                              >
                                {camp.office}
                              </span>
                              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                {metrics.budgetPercentage}% &bull; {formatMoney(metrics.totalSpent)}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer Action: Add Politician */}
                  <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCampaignDropdownOpen(false);
                        setActiveTab("campaigns");
                      }}
                      className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Compare All ({campaigns.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCampaignDropdownOpen(false);
                        setIsAddCampaignOpen(true);
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>Add Politician</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Currency Switcher */}
          <div className="hidden md:flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1 text-xs">
            {(["KES", "USD", "EUR", "GBP"] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`rounded px-2 py-1 font-medium transition-colors ${
                  selectedCurrency === curr
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {CURRENCY_SYMBOLS[curr]} {curr}
              </button>
            ))}
          </div>

          {/* Quick Add Expense Button */}
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 sm:px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Log Expense</span>
          </button>

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center rounded-lg p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-gray-600" />
            )}
          </button>

          {/* Lock Workspace Button */}
          <button
            onClick={lockSession}
            className="rounded-lg p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:block"
            title="Lock Session (Security)"
          >
            <Lock className="h-4 w-4" />
          </button>

          {/* Notifications / Alerts Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setIsAlertsOpen(!isAlertsOpen);
                setIsCampaignDropdownOpen(false);
                setIsRoleDropdownOpen(false);
              }}
              className="relative rounded-lg p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Notifications & Alerts"
            >
              <Bell className="h-5 w-5" />
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
                  {totalNotifications}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isAlertsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-xl z-50 text-gray-900 dark:text-gray-100">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {activeCampaign.politicianName} Alerts
                    </h3>
                    <span className="rounded-full bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300">
                      {totalNotifications} active
                    </span>
                  </div>
                  <button
                    onClick={() => setIsAlertsOpen(false)}
                    className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {pendingCount > 0 && (
                    <div
                      onClick={() => {
                        setActiveTab("expenses");
                        setIsAlertsOpen(false);
                      }}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/40 p-3 hover:bg-amber-100/70 dark:hover:bg-amber-950/60 transition-colors"
                    >
                      <FileCheck2 className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                          {pendingCount} Pending Approvals
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          Awaiting auditor / finance officer sign-off
                        </p>
                      </div>
                    </div>
                  )}

                  {activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-start gap-3 rounded-lg border p-3 ${
                        alert.severity === "CRITICAL"
                          ? "border-rose-200 dark:border-rose-800/60 bg-rose-50/70 dark:bg-rose-950/40"
                          : "border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/40"
                      }`}
                    >
                      <AlertTriangle
                        className={`h-5 w-5 shrink-0 mt-0.5 ${
                          alert.severity === "CRITICAL"
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      />
                      <div className="text-xs">
                        <p
                          className={`font-semibold ${
                            alert.severity === "CRITICAL"
                              ? "text-rose-900 dark:text-rose-200"
                              : "text-amber-900 dark:text-amber-200"
                          }`}
                        >
                          {alert.type === "CATEGORY" ? "Category Limit Warning" : "Event Budget Warning"}
                        </p>
                        <p
                          className={
                            alert.severity === "CRITICAL"
                              ? "text-rose-700 dark:text-rose-400"
                              : "text-amber-700 dark:text-amber-400"
                          }
                        >
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  ))}

                  {totalNotifications === 0 && (
                    <p className="py-4 text-center text-xs text-gray-500 dark:text-gray-400">
                      No active alerts. All budgets are healthy!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setIsRoleDropdownOpen(!isRoleDropdownOpen);
                setIsCampaignDropdownOpen(false);
                setIsAlertsOpen(false);
              }}
              className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 px-2 sm:px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Switch User Role within this Campaign"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-7 w-7 rounded-full object-cover ring-1 ring-gray-300 dark:ring-gray-600"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                  {getNameInitials(currentUser.name)}
                </div>
              )}
              <div className="text-left hidden md:block">
                <p className="text-xs font-semibold text-gray-900 dark:text-white leading-none">
                  {currentUser.name}
                </p>
                <span
                  className={`mt-0.5 inline-block rounded border px-1.5 py-0.2 text-[10px] font-medium ${getRoleBadgeColor(
                    currentUser.role
                  )}`}
                >
                  {ROLE_LABELS[currentUser.role]}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>

            {/* User / Role Dropdown */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-xl z-50 text-gray-900 dark:text-gray-100">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Campaign Team &bull; Switch Role
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {activeCampaign.politicianName} ({allUsers.length} members)
                  </p>
                </div>
                <div className="mt-1 space-y-1 max-h-64 overflow-y-auto">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.id);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        currentUser.id === user.id
                          ? "bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                          {getNameInitials(user.name)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate text-gray-900 dark:text-gray-100">
                          {user.name}
                        </p>
                        <span
                          className={`inline-block rounded border px-1.5 py-0.2 text-[9px] font-medium ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {ROLE_LABELS[user.role]}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Security Center, Manage Team & Lock Action */}
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs px-2">
                  <button
                    onClick={() => {
                      setActiveTab("security");
                      setIsRoleDropdownOpen(false);
                    }}
                    className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Security</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("campaigns");
                      setIsRoleDropdownOpen(false);
                    }}
                    className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Manage Team
                  </button>
                  <button
                    onClick={() => {
                      lockSession();
                      setIsRoleDropdownOpen(false);
                    }}
                    className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    <span>Lock</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-1.5">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
            <div className="flex items-center gap-1">
              {(["KES", "USD", "EUR", "GBP"] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setSelectedCurrency(curr)}
                  className={`rounded px-2 py-1 text-[11px] font-medium ${
                    selectedCurrency === curr
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAddCampaignOpen(true);
              }}
              className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Add Politician</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
