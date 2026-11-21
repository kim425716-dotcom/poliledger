"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";
import { ExpenseStatus } from "@/lib/types";
import {
  Search,
  Filter,
  Plus,
  FileDown,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Check,
  X,
  ExternalLink,
  MapPin,
  Building,
} from "lucide-react";

export const ExpenseList = () => {
  const {
    expenses,
    events,
    categories,
    currentUser,
    approveExpense,
    rejectExpense,
    deleteExpense,
    setSelectedReceiptExpense,
    setIsAddExpenseOpen,
    formatMoney,
  } = useApp();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [eventFilter, setEventFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "amount-desc" | "amount-asc">("date-desc");

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const canApprove = currentUser.role === "AUDITOR" || currentUser.role === "POLITICIAN" || currentUser.role === "ADMIN";
  const canCreate = currentUser.role !== "AUDITOR";

  // Filtered & Sorted list
  const filteredExpenses = expenses
    .filter((exp) => {
      const matchesSearch =
        exp.description.toLowerCase().includes(search.toLowerCase()) ||
        exp.vendorName?.toLowerCase().includes(search.toLowerCase()) ||
        exp.location?.toLowerCase().includes(search.toLowerCase());

      const matchesCat = categoryFilter === "ALL" || exp.categoryId === categoryFilter;
      const matchesEvent = eventFilter === "ALL" || exp.eventId === eventFilter;
      const matchesStatus = statusFilter === "ALL" || exp.status === statusFilter;

      return matchesSearch && matchesCat && matchesEvent && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime();
      if (sortBy === "date-asc") return new Date(a.expenseDate).getTime() - new Date(b.expenseDate).getTime();
      if (sortBy === "amount-desc") return b.amount - a.amount;
      if (sortBy === "amount-asc") return a.amount - b.amount;
      return 0;
    });

  // Calculate filtered totals
  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = ["ID,Date,Description,Vendor,Category,Event,Amount (KES),Status,Approved By,Notes"];
    const rows = filteredExpenses.map((e) =>
      [
        e.id,
        e.expenseDate,
        `"${e.description.replace(/"/g, '""')}"`,
        `"${(e.vendorName || "").replace(/"/g, '""')}"`,
        `"${e.categoryName}"`,
        `"${(e.eventName || "General Campaign").replace(/"/g, '""')}"`,
        e.amount,
        e.status,
        `"${e.approvedBy || ""}"`,
        `"${(e.notes || "").replace(/"/g, '""')}"`,
      ].join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `poliledger_expenses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Campaign Expenses</h2>
          <p className="text-xs text-gray-500">
            Log, verify, and approve all meetings, rallies, and operational spending
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition-colors"
          >
            <FileDown className="h-4 w-4 text-gray-500" />
            <span>Export CSV</span>
          </button>

          {canCreate && (
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Log New Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description, vendor, city..."
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Event Filter */}
          <div>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Meetings & Rallies</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.eventType}: {evt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">⏳ Pending Review</option>
              <option value="APPROVED">✅ Approved</option>
              <option value="REJECTED">❌ Rejected</option>
              <option value="DRAFT">📝 Draft</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Total */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
          <div>
            Showing <strong className="text-gray-900">{filteredExpenses.length}</strong> of{" "}
            <strong>{expenses.length}</strong> recorded expenditures
          </div>
          <div>
            Total Filtered Amount:{" "}
            <strong className="text-gray-900 text-sm">{formatMoney(totalFilteredAmount)}</strong>
          </div>
        </div>
      </div>

      {/* Main Expense Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description & Notes</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Event Link</th>
                <th className="py-3 px-4">Logged By</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50/80 transition-colors">
                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-gray-500 font-medium">
                    {formatDate(exp.expenseDate)}
                  </td>

                  {/* Description & Vendor */}
                  <td className="py-3.5 px-4 max-w-[260px]">
                    <p className="font-semibold text-gray-900">{exp.description}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                      {exp.vendorName && (
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3 text-gray-400" />
                          <span>{exp.vendorName}</span>
                        </span>
                      )}
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span>{exp.location}</span>
                        </span>
                      )}
                    </div>
                    {exp.rejectionReason && (
                      <p className="mt-1 text-[11px] text-rose-600 bg-rose-50 p-1.5 rounded">
                        <strong>Reason:</strong> {exp.rejectionReason}
                      </p>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-800">
                      <span>{exp.categoryIcon}</span>
                      <span>{exp.categoryName}</span>
                    </span>
                  </td>

                  {/* Event */}
                  <td className="py-3.5 px-4 max-w-[180px]">
                    {exp.eventName ? (
                      <span className="font-medium text-blue-700 block truncate" title={exp.eventName}>
                        {exp.eventName}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">General Campaign</span>
                    )}
                  </td>

                  {/* Logged By */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-gray-600">
                    <p className="font-medium text-gray-900">{exp.createdByName}</p>
                    <p className="text-[10px] text-gray-400">{exp.createdByRole}</p>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right font-bold text-gray-900 text-sm">
                    {formatMoney(exp.amount)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
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
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Receipt */}
                      {exp.receiptName && (
                        <button
                          onClick={() => setSelectedReceiptExpense(exp)}
                          className="rounded-md border border-gray-200 p-1.5 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                          title="View attached receipt / invoice"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      )}

                      {/* Approval buttons for Auditor/Politician */}
                      {canApprove && exp.status === "SUBMITTED" && (
                        <>
                          <button
                            onClick={() => approveExpense(exp.id)}
                            className="flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 transition-all shadow-xs"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => setRejectingId(exp.id)}
                            className="flex items-center gap-1 rounded-md bg-rose-50 border border-rose-200 px-2 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {/* Delete */}
                      {(currentUser.role === "ADMIN" || exp.status === "DRAFT") && (
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="rounded-md p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No expenses match the current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl space-y-4">
            <h4 className="font-bold text-gray-900 text-sm">Reject Expense — Auditor Note</h4>
            <p className="text-xs text-gray-500">
              Please enter the compliance reason for rejecting this claim:
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Missing official VAT invoice, duplicate claim, or expenditure not approved in rally budget..."
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
                onClick={() => {
                  if (!rejectReason.trim()) return;
                  rejectExpense(rejectingId, rejectReason);
                  setRejectingId(null);
                  setRejectReason("");
                }}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 shadow-xs"
              >
                Reject Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
