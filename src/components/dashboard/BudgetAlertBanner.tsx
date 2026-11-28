"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { AlertTriangle, AlertCircle, X, ChevronRight } from "lucide-react";

export const BudgetAlertBanner = () => {
  const { budgetAlerts, dismissedAlerts, dismissAlert, setActiveTab } = useApp();

  // Active alerts that haven't been dismissed
  const activeAlerts = budgetAlerts.filter((a) => !dismissedAlerts.includes(a.id));

  if (activeAlerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {activeAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center justify-between rounded-xl border p-3.5 shadow-xs transition-all ${
            alert.severity === "CRITICAL"
              ? "border-rose-200 dark:border-rose-800/60 bg-rose-50/90 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200"
              : "border-amber-200 dark:border-amber-800/60 bg-amber-50/90 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`rounded-lg p-2 ${
                alert.severity === "CRITICAL"
                  ? "bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400"
                  : "bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400"
              }`}
            >
              {alert.severity === "CRITICAL" ? (
                <AlertCircle className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {alert.severity === "CRITICAL" ? "Budget Critical Limit" : "Budget Approach Warning"}
                </span>
                <span
                  className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                    alert.severity === "CRITICAL"
                      ? "bg-rose-200 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200"
                      : "bg-amber-200 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200"
                  }`}
                >
                  {alert.percentage}% used
                </span>
              </div>
              <p className="text-xs mt-0.5 font-medium">{alert.message}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("budgets")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold underline underline-offset-2 transition-colors ${
                alert.severity === "CRITICAL"
                  ? "hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-800 dark:text-rose-300"
                  : "hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300"
              }`}
            >
              <span>Manage Budget</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              title="Dismiss warning"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
