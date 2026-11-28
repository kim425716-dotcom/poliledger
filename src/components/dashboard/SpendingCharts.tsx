"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export const SpendingCharts = () => {
  const { categories, expenses, events, formatMoney } = useApp();

  // Calculate category spending
  const categoryStats = categories.map((cat) => {
    const spent = expenses
      .filter((e) => e.categoryId === cat.id && (e.status === "APPROVED" || e.status === "SUBMITTED"))
      .reduce((sum, e) => sum + e.amount, 0);

    const percentageOfLimit = Math.round((spent / cat.budgetLimit) * 100);

    return {
      ...cat,
      spent,
      percentageOfLimit,
    };
  }).sort((a, b) => b.spent - a.spent);

  // Total for percentage shares
  const totalCategorySpent = categoryStats.reduce((sum, c) => sum + c.spent, 0) || 1;

  // Event spending
  const eventStats = events.map((evt) => {
    const spent = expenses
      .filter((e) => e.eventId === evt.id && (e.status === "APPROVED" || e.status === "SUBMITTED"))
      .reduce((sum, e) => sum + e.amount, 0);

    const percentageOfBudget = Math.round((spent / evt.budget) * 100);

    return {
      ...evt,
      spent,
      percentageOfBudget,
    };
  }).sort((a, b) => b.spent - a.spent);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* 1. Spending by Category (Budget vs Actual) */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Category Spending vs Budget Limits</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Track allocations across political operations</p>
          </div>
          <span className="rounded-lg bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:text-gray-300">
            {categories.length} Categories
          </span>
        </div>

        <div className="space-y-4">
          {categoryStats.slice(0, 6).map((cat) => {
            const share = Math.round((cat.spent / totalCategorySpent) * 100);
            const isWarning = cat.percentageOfLimit >= 75 && cat.percentageOfLimit < 90;
            const isCritical = cat.percentageOfLimit >= 90;

            return (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{cat.name}</span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">({share}% of total)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 dark:text-white">{formatMoney(cat.spent)}</span>
                    <span className="text-gray-400 dark:text-gray-500"> / {formatMoney(cat.budgetLimit)}</span>
                  </div>
                </div>

                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCritical
                        ? "bg-rose-500"
                        : isWarning
                        ? "bg-amber-500"
                        : "bg-blue-600"
                    }`}
                    style={{ width: `${Math.min(100, cat.percentageOfLimit)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
                  <span>Limit: {formatMoney(cat.budgetLimit)}</span>
                  <span
                    className={`font-semibold ${
                      isCritical ? "text-rose-600 dark:text-rose-400" : isWarning ? "text-amber-600 dark:text-amber-400" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {cat.percentageOfLimit}% utilized
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Spending by Event (Meetings & Rallies) */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Event Budget Utilization</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Expenses grouped by political meeting or rally</p>
          </div>
          <span className="rounded-lg bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
            Rallies & Meetings
          </span>
        </div>

        <div className="space-y-4">
          {eventStats.map((evt) => {
            const isCritical = evt.percentageOfBudget >= 90;
            const isWarning = evt.percentageOfBudget >= 75 && evt.percentageOfBudget < 90;

            return (
              <div key={evt.id} className="rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{evt.name}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {evt.eventType} • Expected: {evt.expectedAttendance?.toLocaleString()} attendees
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isCritical
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300"
                        : isWarning
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                    }`}
                  >
                    {evt.percentageOfBudget}% Budget
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCritical
                        ? "bg-rose-500"
                        : isWarning
                        ? "bg-amber-500"
                        : "bg-blue-600"
                    }`}
                    style={{ width: `${Math.min(100, evt.percentageOfBudget)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-0.5">
                  <span>Spent: <strong className="text-gray-900 dark:text-white">{formatMoney(evt.spent)}</strong></span>
                  <span>Budget: <strong className="text-gray-900 dark:text-white">{formatMoney(evt.budget)}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
