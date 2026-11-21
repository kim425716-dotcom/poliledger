"use client";

import React, { useState } from "react";
import { useApp, CURRENCY_SYMBOLS } from "@/context/AppContext";
import { ROLE_LABELS } from "@/lib/types";
import {
  Bell,
  Plus,
  Shield,
  ChevronDown,
  Globe,
  Sparkles,
  FileCheck2,
  AlertTriangle,
  X,
} from "lucide-react";

export const Navbar = () => {
  const {
    currentUser,
    switchUser,
    allUsers,
    selectedCurrency,
    setSelectedCurrency,
    budgetAlerts,
    dismissedAlerts,
    expenses,
    setIsAddExpenseOpen,
    setActiveTab,
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  // Active alerts not dismissed
  const activeAlerts = budgetAlerts.filter((a) => !dismissedAlerts.includes(a.id));
  const pendingCount = expenses.filter((e) => e.status === "SUBMITTED").length;
  const totalNotifications = activeAlerts.length + pendingCount;

  // Role badge color helper
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "POLITICIAN":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "CAMPAIGN_MANAGER":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "STAFF":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "AUDITOR":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "ADMIN":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Brand & Campaign Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/20">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-gray-900 text-lg">PoliLedger</span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
              Elections 2026
            </span>
          </div>
          <p className="hidden text-xs text-gray-500 sm:block">
            Campaign of Hon. Jane Muthoni • Nairobi Senate
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Currency Switcher */}
        <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1 text-xs">
          {(["KES", "USD", "EUR", "GBP"] as const).map((curr) => (
            <button
              key={curr}
              onClick={() => setSelectedCurrency(curr)}
              className={`rounded px-2 py-1 font-medium transition-colors ${
                selectedCurrency === curr
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {CURRENCY_SYMBOLS[curr]} {curr}
            </button>
          ))}
        </div>

        {/* Quick Add Expense Button */}
        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Log Expense</span>
        </button>

        {/* Notifications / Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            title="Notifications & Alerts"
          >
            <Bell className="h-5 w-5" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-bold text-white shadow-sm ring-2 ring-white">
                {totalNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isAlertsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-gray-200 bg-white p-4 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications & Alerts</h3>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    {totalNotifications} active
                  </span>
                </div>
                <button
                  onClick={() => setIsAlertsOpen(false)}
                  className="rounded p-1 text-gray-400 hover:text-gray-600"
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
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/70 p-3 hover:bg-amber-100/70 transition-colors"
                  >
                    <FileCheck2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-900">
                        {pendingCount} Pending Approvals
                      </p>
                      <p className="text-xs text-amber-700">
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
                        ? "border-rose-200 bg-rose-50/70"
                        : "border-amber-200 bg-amber-50/70"
                    }`}
                  >
                    <AlertTriangle
                      className={`h-5 w-5 shrink-0 mt-0.5 ${
                        alert.severity === "CRITICAL" ? "text-rose-600" : "text-amber-600"
                      }`}
                    />
                    <div className="text-xs">
                      <p
                        className={`font-semibold ${
                          alert.severity === "CRITICAL" ? "text-rose-900" : "text-amber-900"
                        }`}
                      >
                        {alert.type === "CATEGORY" ? "Category Limit Warning" : "Event Budget Warning"}
                      </p>
                      <p
                        className={
                          alert.severity === "CRITICAL" ? "text-rose-700" : "text-amber-700"
                        }
                      >
                        {alert.message}
                      </p>
                    </div>
                  </div>
                ))}

                {totalNotifications === 0 && (
                  <p className="py-4 text-center text-xs text-gray-500">
                    No active alerts. All budgets are healthy!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Pill (Crucial for Demo/Testing) */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/80 px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
            title="Switch User Role to test permissions"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-7 w-7 rounded-full object-cover ring-1 ring-gray-300"
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-gray-900 leading-none">{currentUser.name}</p>
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
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-2 shadow-xl z-50">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Switch Active Role (Demo Mode)
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Test the system from each stakeholder's perspective:
                </p>
              </div>
              <div className="mt-1 space-y-1">
                {allUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchUser(user.id);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                      currentUser.id === user.id
                        ? "bg-blue-50 text-blue-900"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{user.name}</p>
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
