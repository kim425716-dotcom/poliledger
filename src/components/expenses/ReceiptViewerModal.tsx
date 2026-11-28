"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";
import { X, CheckCircle, Clock, XCircle, FileText, Download, ShieldCheck } from "lucide-react";

export const ReceiptViewerModal = () => {
  const { selectedReceiptExpense, setSelectedReceiptExpense, formatMoney, activeCampaign } = useApp();

  if (!selectedReceiptExpense) return null;

  const exp = selectedReceiptExpense;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden my-8 text-gray-900 dark:text-gray-100 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-950/70 p-2 text-blue-700 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Receipt & Verification Proof</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Document ID: {exp.id}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedReceiptExpense(null)}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-4 text-xs sm:grid-cols-4">
            <div>
              <p className="text-gray-400 dark:text-gray-500 font-medium">Amount</p>
              <p className="font-bold text-gray-900 dark:text-white text-base mt-0.5">{formatMoney(exp.amount)}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500 font-medium">Category</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                {exp.categoryIcon} {exp.categoryName}
              </p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500 font-medium">Date</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{formatDate(exp.expenseDate)}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500 font-medium">Status</p>
              <span
                className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  exp.status === "APPROVED"
                    ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300"
                    : exp.status === "SUBMITTED"
                    ? "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300"
                    : "bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300"
                }`}
              >
                {exp.status}
              </span>
            </div>
          </div>

          {/* Description & Vendor */}
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Description: </span>
              <span className="text-gray-900 dark:text-white">{exp.description}</span>
            </div>
            {exp.vendorName && (
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Vendor: </span>
                <span className="text-gray-900 dark:text-white">{exp.vendorName}</span>
              </div>
            )}
            {exp.notes && (
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Notes: </span>
                <span className="text-gray-600 dark:text-gray-400">{exp.notes}</span>
              </div>
            )}
          </div>

          {/* Receipt Preview Canvas / Mock Display */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100/60 dark:bg-gray-800/40 p-6 text-center">
            <div className="mx-auto max-w-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-6 shadow-sm text-left font-mono text-[11px] space-y-3 text-gray-900 dark:text-gray-100">
              <div className="border-b border-dashed border-gray-300 dark:border-gray-700 pb-3 text-center">
                <p className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white">{exp.vendorName || "OFFICIAL RECEIPT"}</p>
                <p className="text-gray-500 dark:text-gray-400 text-[10px]">{exp.location || activeCampaign.constituency}</p>
                <p className="text-gray-400 dark:text-gray-500 text-[9px]">TAX PIN: P051289341X</p>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">DATE:</span>
                <span>{exp.expenseDate}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500 dark:text-gray-400">ITEM:</span>
                <span className="font-semibold text-right">{exp.description}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-gray-300 dark:border-gray-700 pt-2 font-bold text-xs">
                <span>TOTAL PAID:</span>
                <span>{exp.currency} {exp.amount.toLocaleString()}</span>
              </div>

              <div className="border-t border-dashed border-gray-300 dark:border-gray-700 pt-2 text-center text-[10px] text-gray-400 dark:text-gray-500">
                <p>ATTACHMENT: {exp.receiptName}</p>
                <p>DIGITALLY SIGNED FOR POLILEDGER AUDIT</p>
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="flex items-center justify-between rounded-lg bg-blue-50/70 dark:bg-blue-950/40 p-3 text-xs text-blue-900 dark:text-blue-200 border border-blue-200/50 dark:border-blue-800/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>
                {exp.approvedBy ? (
                  <>Verified &amp; Approved by <strong>{exp.approvedBy}</strong></>
                ) : (
                  "Submitted and awaiting compliance verification"
                )}
              </span>
            </div>
            <button
              onClick={() => alert(`Downloading verified copy of ${exp.receiptName}...`)}
              className="flex items-center gap-1 font-semibold text-blue-700 dark:text-blue-400 hover:underline"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
