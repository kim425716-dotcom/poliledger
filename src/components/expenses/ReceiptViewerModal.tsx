"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";
import { X, CheckCircle, Clock, XCircle, FileText, Download, ShieldCheck } from "lucide-react";

export const ReceiptViewerModal = () => {
  const { selectedReceiptExpense, setSelectedReceiptExpense, formatMoney } = useApp();

  if (!selectedReceiptExpense) return null;

  const exp = selectedReceiptExpense;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Receipt & Verification Proof</h3>
              <p className="text-xs text-gray-500">Document ID: {exp.id}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedReceiptExpense(null)}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200/60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 text-xs sm:grid-cols-4">
            <div>
              <p className="text-gray-400 font-medium">Amount</p>
              <p className="font-bold text-gray-900 text-base mt-0.5">{formatMoney(exp.amount)}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Category</p>
              <p className="font-semibold text-gray-800 mt-0.5">
                {exp.categoryIcon} {exp.categoryName}
              </p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Date</p>
              <p className="font-semibold text-gray-800 mt-0.5">{formatDate(exp.expenseDate)}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Status</p>
              <span
                className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  exp.status === "APPROVED"
                    ? "bg-emerald-100 text-emerald-800"
                    : exp.status === "SUBMITTED"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {exp.status}
              </span>
            </div>
          </div>

          {/* Description & Vendor */}
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-semibold text-gray-700">Description: </span>
              <span className="text-gray-900">{exp.description}</span>
            </div>
            {exp.vendorName && (
              <div>
                <span className="font-semibold text-gray-700">Vendor: </span>
                <span className="text-gray-900">{exp.vendorName}</span>
              </div>
            )}
            {exp.notes && (
              <div>
                <span className="font-semibold text-gray-700">Notes: </span>
                <span className="text-gray-600">{exp.notes}</span>
              </div>
            )}
          </div>

          {/* Receipt Preview Canvas / Mock Display */}
          <div className="rounded-xl border border-gray-200 bg-gray-100/60 p-6 text-center">
            <div className="mx-auto max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-left font-mono text-[11px] space-y-3">
              <div className="border-b border-dashed border-gray-300 pb-3 text-center">
                <p className="font-bold text-xs uppercase tracking-wider">{exp.vendorName || "OFFICIAL RECEIPT"}</p>
                <p className="text-gray-500 text-[10px]">{exp.location || "Nairobi, Kenya"}</p>
                <p className="text-gray-400 text-[9px]">TAX PIN: P051289341X</p>
              </div>

              <div className="flex justify-between">
                <span>DATE:</span>
                <span>{exp.expenseDate}</span>
              </div>
              <div className="flex justify-between">
                <span>ITEM:</span>
                <span className="font-semibold">{exp.description}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-gray-300 pt-2 font-bold text-xs">
                <span>TOTAL PAID:</span>
                <span>{exp.currency} {exp.amount.toLocaleString()}</span>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-2 text-center text-[10px] text-gray-400">
                <p>ATTACHMENT: {exp.receiptName}</p>
                <p>DIGITALLY SIGNED FOR POLILEDGER AUDIT</p>
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="flex items-center justify-between rounded-lg bg-blue-50/70 p-3 text-xs text-blue-900 border border-blue-200/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span>
                {exp.approvedBy ? (
                  <>Verified & Approved by <strong>{exp.approvedBy}</strong></>
                ) : (
                  "Submitted and awaiting compliance verification"
                )}
              </span>
            </div>
            <button
              onClick={() => alert(`Downloading verified copy of ${exp.receiptName}...`)}
              className="flex items-center gap-1 font-semibold text-blue-700 hover:underline"
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
