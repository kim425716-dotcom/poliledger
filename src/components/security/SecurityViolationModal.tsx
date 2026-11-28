"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ShieldAlert, X, ArrowRight } from "lucide-react";

export const SecurityViolationModal = () => {
  const { securityViolation, clearSecurityViolation, setActiveTab } = useApp();

  if (!securityViolation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-gray-900 p-6 shadow-2xl text-gray-900 dark:text-gray-100 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 font-bold text-sm">
            <ShieldAlert className="h-5 w-5" />
            <span>Security Policy Violation</span>
          </div>
          <button
            onClick={clearSecurityViolation}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-rose-100 dark:border-rose-900/50 bg-rose-50/80 dark:bg-rose-950/40 p-4 text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
            {securityViolation}
          </div>

          <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-3.5 text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
            <p className="font-semibold text-gray-800 dark:text-gray-200">Why was this action blocked?</p>
            <p>
              Under election finance laws and the <strong>Separation of Duties (Four-Eyes Principle)</strong>, the individual who logs an expenditure cannot also be the authorizing signatory. This eliminates internal fraud, fictitious claims, and conflict of interest.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              clearSecurityViolation();
              setActiveTab("security");
            }}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <span>Review Security Policy</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={clearSecurityViolation}
            className="rounded-xl bg-gray-900 dark:bg-gray-700 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 dark:hover:bg-gray-600"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
