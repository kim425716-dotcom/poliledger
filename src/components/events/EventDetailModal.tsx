"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";
import {
  X,
  Calendar,
  MapPin,
  Users,
  Target,
  FileText,
  CheckCircle,
  Plus,
} from "lucide-react";

export const EventDetailModal = () => {
  const {
    selectedEventDetail,
    setSelectedEventDetail,
    expenses,
    formatMoney,
    setSelectedReceiptExpense,
    setIsAddExpenseOpen,
  } = useApp();

  if (!selectedEventDetail) return null;

  const evt = selectedEventDetail;
  const eventExpenses = expenses.filter((e) => e.eventId === evt.id);
  const totalSpent = eventExpenses
    .filter((e) => e.status === "APPROVED" || e.status === "SUBMITTED")
    .reduce((sum, e) => sum + e.amount, 0);

  const percentage = Math.round((totalSpent / evt.budget) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden my-8 text-gray-900 dark:text-gray-100 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-100 dark:bg-blue-950/70 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:text-blue-300">
                {evt.eventType}
              </span>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                {evt.status}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mt-1">{evt.name}</h3>
          </div>
          <button
            onClick={() => setSelectedEventDetail(null)}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-4 text-xs sm:grid-cols-4">
            <div>
              <p className="text-gray-400 dark:text-gray-500 font-medium">Event Date</p>
              <p className="font-bold text-gray-900 dark:text-white text-sm mt-0.5">{formatDate(evt.eventDate)}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{evt.startTime} - {evt.endTime}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500 font-medium">Location</p>
              <p className="font-bold text-gray-900 dark:text-white text-sm mt-0.5 truncate">{evt.locationName}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{evt.locationAddress}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500 font-medium">Expected Crowd</p>
              <p className="font-bold text-gray-900 dark:text-white text-sm mt-0.5">
                {evt.expectedAttendance?.toLocaleString()} people
              </p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500 font-medium">Budget Consumed</p>
              <p className="font-bold text-gray-900 dark:text-white text-sm mt-0.5">
                {formatMoney(totalSpent)} <span className="text-xs text-gray-400 dark:text-gray-500">/ {formatMoney(evt.budget)}</span>
              </p>
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{percentage}% utilized</p>
            </div>
          </div>

          {/* Description */}
          {evt.description && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-800 dark:text-gray-200">Objective: </span>
              {evt.description}
            </div>
          )}

          {/* Linked Expenses */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                Itemized Expenses Linked to this Event ({eventExpenses.length})
              </h4>
              <button
                onClick={() => {
                  setSelectedEventDetail(null);
                  setIsAddExpenseOpen(true);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Expense to this Event</span>
              </button>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {eventExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40">
                      <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">{formatDate(exp.expenseDate)}</td>
                      <td className="py-2.5 px-3 font-semibold text-gray-900 dark:text-gray-100">{exp.description}</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-700 dark:text-gray-300">
                          {exp.categoryIcon} {exp.categoryName}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-gray-900 dark:text-white">
                        {formatMoney(exp.amount)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            exp.status === "APPROVED"
                              ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300"
                              : exp.status === "SUBMITTED"
                              ? "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300"
                              : "bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300"
                          }`}
                        >
                          {exp.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {exp.receiptName && (
                          <button
                            onClick={() => setSelectedReceiptExpense(exp)}
                            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            title="View receipt"
                          >
                            <FileText className="h-4 w-4 inline" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}

                  {eventExpenses.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-400 dark:text-gray-500">
                        No expenses logged for this event yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
