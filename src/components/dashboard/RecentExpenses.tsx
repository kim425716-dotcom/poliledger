"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Check,
  X,
  Eye,
  ExternalLink,
} from "lucide-react";

export const RecentExpenses = () => {
  const {
    expenses,
    currentUser,
    approveExpense,
    rejectExpense,
    setSelectedReceiptExpense,
    formatMoney,
    setActiveTab,
  } = useApp();

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const canApprove = currentUser.role === "AUDITOR" || currentUser.role === "POLITICIAN" || currentUser.role === "ADMIN";

  const handleRejectSubmit = (id: string) => {
    if (!rejectReason.trim()) return;
    rejectExpense(id, rejectReason);
    setRejectingId(null);
    setRejectReason("");
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Recent Expenses & Invoices</h3>
          <p className="text-xs text-gray-500">Live feed of campaign expenditures</p>
        </div>
        <button
          onClick={() => setActiveTab("expenses")}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          <span>View All ({expenses.length})</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Description & Vendor</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Linked Event</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Receipt / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {expenses.slice(0, 6).map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50/70 transition-colors">
                {/* Date */}
                <td className="py-3 px-3 whitespace-nowrap text-gray-500 font-medium">
                  {formatDate(exp.expenseDate)}
                </td>

                {/* Description & Vendor */}
                <td className="py-3 px-3 max-w-[220px]">
                  <p className="font-semibold text-gray-900 truncate">{exp.description}</p>
                  <p className="text-[11px] text-gray-500 truncate">{exp.vendorName || "Direct / Cash"}</p>
                </td>

                {/* Category */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                    <span>{exp.categoryIcon}</span>
                    <span>{exp.categoryName}</span>
                  </span>
                </td>

                {/* Linked Event */}
                <td className="py-3 px-3 max-w-[160px]">
                  {exp.eventName ? (
                    <span className="truncate block font-medium text-blue-700 hover:underline cursor-pointer">
                      {exp.eventName}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">General Campaign</span>
                  )}
                </td>

                {/* Amount */}
                <td className="py-3 px-3 whitespace-nowrap text-right font-bold text-gray-900">
                  {formatMoney(exp.amount)}
                </td>

                {/* Status */}
                <td className="py-3 px-3 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      exp.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : exp.status === "SUBMITTED"
                        ? "bg-amber-100 text-amber-800"
                        : exp.status === "REJECTED"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {exp.status === "APPROVED" && <CheckCircle className="h-3 w-3" />}
                    {exp.status === "SUBMITTED" && <Clock className="h-3 w-3" />}
                    {exp.status === "REJECTED" && <XCircle className="h-3 w-3" />}
                    <span>{exp.status}</span>
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 px-3 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Receipt */}
                    {exp.receiptName && (
                      <button
                        onClick={() => setSelectedReceiptExpense(exp)}
                        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                        title="Inspect receipt"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    )}

                    {/* Approve / Reject Actions for Auditors & Politicians */}
                    {canApprove && exp.status === "SUBMITTED" && (
                      <>
                        <button
                          onClick={() => approveExpense(exp.id)}
                          className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition-all shadow-xs"
                          title="Approve this expense"
                        >
                          <Check className="h-3 w-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => setRejectingId(exp.id)}
                          className="flex items-center gap-1 rounded bg-rose-100 px-2 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-200 transition-colors"
                          title="Reject with note"
                        >
                          <X className="h-3 w-3" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl space-y-4">
            <h4 className="font-bold text-gray-900 text-sm">Reject Expense — Provide Justification</h4>
            <p className="text-xs text-gray-500">
              The submitter will be notified with this audit comment to revise or clarify the expense.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Receipt is blurry, missing procurement pre-authorization form, or exceeding budget allowance..."
              className="w-full rounded-lg border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectingId(null)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectSubmit(rejectingId)}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
