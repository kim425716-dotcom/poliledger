"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  Wallet,
  Clock,
  PieChart,
  Calendar,
  TrendingUp,
} from "lucide-react";

export const StatCards = () => {
  const { totalSpent, totalCampaignBudget, expenses, events, formatMoney, setActiveTab, setSelectedStatusFilter } = useApp();

  const pendingApprovals = expenses.filter((e) => e.status === "SUBMITTED");
  const budgetPercentage = Math.round((totalSpent / totalCampaignBudget) * 100);
  const remainingBudget = Math.max(0, totalCampaignBudget - totalSpent);
  const activeEventsCount = events.filter((e) => e.status === "CONFIRMED" || e.status === "IN_PROGRESS").length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Spent */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Campaign Spent
          </span>
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/60 p-2 text-blue-600 dark:text-blue-400">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {formatMoney(totalSpent)}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> {budgetPercentage}%
            </span>
            <span>of {formatMoney(totalCampaignBudget)} limit</span>
          </div>
        </div>
      </div>

      {/* 2. Pending Approvals */}
      <div
        onClick={() => {
          setSelectedStatusFilter("SUBMITTED");
          setActiveTab("expenses");
        }}
        className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs transition-all hover:shadow-md cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Pending Approvals
          </span>
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/60 p-2 text-amber-600 dark:text-amber-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/60 transition-colors">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {pendingApprovals.length}
            </h3>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {pendingApprovals.length > 0 ? "Needs Review" : "Up to date"}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {pendingApprovals.length > 0
              ? `${formatMoney(pendingApprovals.reduce((s, e) => s + e.amount, 0))} awaiting sign-off`
              : "All submitted receipts approved"}
          </p>
        </div>
      </div>

      {/* 3. Budget Remaining */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Budget Balance
          </span>
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/60 p-2 text-emerald-600 dark:text-emerald-400">
            <PieChart className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {formatMoney(remainingBudget)}
          </h3>
          <div className="mt-2 w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetPercentage > 90
                  ? "bg-rose-500"
                  : budgetPercentage > 75
                  ? "bg-amber-500"
                  : "bg-blue-600"
              }`}
              style={{ width: `${Math.min(100, budgetPercentage)}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-gray-400 dark:text-gray-500">
            <span>0%</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{budgetPercentage}% used</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* 4. Active Rallies & Meetings */}
      <div
        onClick={() => setActiveTab("events")}
        className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs transition-all hover:shadow-md cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Active Rallies & Events
          </span>
          <div className="rounded-lg bg-purple-50 dark:bg-purple-950/60 p-2 text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/60 transition-colors">
            <Calendar className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {activeEventsCount}
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {events.length} total scheduled events in campaign
          </p>
        </div>
      </div>
    </div>
  );
};
