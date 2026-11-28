"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Target, AlertTriangle, Shield, Check, Plus, Edit2 } from "lucide-react";

export const BudgetManager = () => {
  const { categories, expenses, formatMoney } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Budget Limits &amp; Thresholds</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Define expenditure ceilings and alert triggers per political operation category
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const catExpenses = expenses.filter(
            (e) => e.categoryId === cat.id && (e.status === "APPROVED" || e.status === "SUBMITTED")
          );
          const spent = catExpenses.reduce((sum, e) => sum + e.amount, 0);
          const percentage = Math.round((spent / cat.budgetLimit) * 100);
          const isCritical = percentage >= 90;
          const isWarning = percentage >= 75 && percentage < 90;
          const remaining = Math.max(0, cat.budgetLimit - spent);

          return (
            <div
              key={cat.id}
              className={`rounded-xl border bg-white dark:bg-gray-900 p-5 shadow-xs space-y-4 transition-colors ${
                isCritical
                  ? "border-rose-200 dark:border-rose-800/60"
                  : isWarning
                  ? "border-amber-200 dark:border-amber-800/60"
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{cat.name}</h3>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">Alert at 75% &amp; 90%</p>
                  </div>
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
                  {percentage}%
                </span>
              </div>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCritical
                        ? "bg-rose-500"
                        : isWarning
                        ? "bg-amber-500"
                        : "bg-blue-600"
                    }`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs pt-1">
                  <span className="text-gray-500 dark:text-gray-400">Spent: <strong className="text-gray-900 dark:text-white">{formatMoney(spent)}</strong></span>
                  <span className="text-gray-500 dark:text-gray-400">Limit: <strong className="text-gray-900 dark:text-white">{formatMoney(cat.budgetLimit)}</strong></span>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>Remaining: <strong className="text-gray-900 dark:text-white">{formatMoney(remaining)}</strong></span>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{catExpenses.length} claims</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
