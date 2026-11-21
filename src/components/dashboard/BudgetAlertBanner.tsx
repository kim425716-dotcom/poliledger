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
              ? "border-rose-200 bg-rose-50/90 text-rose-900"
              : "border-amber-200 bg-amber-50/90 text-amber-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`rounded-lg p-2 ${
                alert.severity === "CRITICAL"
                  ? "bg-rose-100 text-rose-600"
                  : "bg-amber-100 text-amber-600"
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
                      ? "bg-rose-200 text-rose-800"
                      : "bg-amber-200 text-amber-800"
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
              onClick={() => setActiveTab(alert.type === "CATEGORY" ? "budgets" : "events")}
              className="flex items-center gap-1 text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              <span>Manage</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="rounded-lg p-1 hover:bg-black/5 transition-colors"
              title="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
