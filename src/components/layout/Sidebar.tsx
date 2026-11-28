"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  Receipt,
  CalendarDays,
  Target,
  FileSpreadsheet,
  Globe2,
  History,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export const Sidebar = () => {
  const { activeTab, setActiveTab, expenses, budgetAlerts, dismissedAlerts, totalSpent, formatMoney } = useApp();

  const pendingApprovalsCount = expenses.filter((e) => e.status === "SUBMITTED").length;
  const activeAlertsCount = budgetAlerts.filter((a) => !dismissedAlerts.includes(a.id)).length;

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "expenses",
      label: "Expenses",
      icon: Receipt,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : null,
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      id: "events",
      label: "Meetings & Rallies",
      icon: CalendarDays,
      badge: null,
    },
    {
      id: "budgets",
      label: "Budgets & Limits",
      icon: Target,
      badge: activeAlertsCount > 0 ? "Alert" : null,
      badgeColor: "bg-rose-100 text-rose-800",
    },
    {
      id: "reports",
      label: "Reports & Exports",
      icon: FileSpreadsheet,
      badge: null,
    },
    {
      id: "transparency",
      label: "Public Portal",
      icon: Globe2,
      badge: "Public",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      id: "audit",
      label: "Audit Trail",
      icon: History,
      badge: null,
    },
    {
      id: "security",
      label: "Security Center",
      icon: ShieldCheck,
      badge: "A+",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-gray-200 bg-white min-h-[calc(100vh-4rem)] p-4 justify-between">
      {/* Navigation List */}
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Navigation
          </p>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive ? "bg-white/20 text-white" : item.badgeColor || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Campaign Summary Card in Sidebar */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30 p-3.5 text-xs">
        <div className="flex items-center gap-2 text-blue-900 font-semibold mb-1">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <span>IEBC Compliance Ready</span>
        </div>
        <p className="text-[11px] text-gray-500 mb-2 leading-relaxed">
          All expenses are tracked with receipts and immutable audit logs.
        </p>
        <div className="border-t border-gray-200/60 pt-2 flex items-center justify-between text-gray-600">
          <span>Total Logged</span>
          <span className="font-bold text-gray-900">{formatMoney(totalSpent)}</span>
        </div>
      </div>
    </aside>
  );
};
