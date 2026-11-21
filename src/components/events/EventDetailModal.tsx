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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                {evt.eventType}
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                {evt.status}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mt-1">{evt.name}</h3>
          </div>
          <button
            onClick={() => setSelectedEventDetail(null)}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200/60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 text-xs sm:grid-cols-4">
            <div>
              <p className="text-gray-400 font-medium">Event Date</p>
              <p className="font-bold text-gray-900 text-sm mt-0.5">{formatDate(evt.eventDate)}</p>
              <p className="text-[10px] text-gray-500">{evt.startTime} - {evt.endTime}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Location</p>
              <p className="font-bold text-gray-900 text-sm mt-0.5 truncate">{evt.locationName}</p>
              <p className="text-[10px] text-gray-500 truncate">{evt.locationAddress}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Expected Crowd</p>
              <p className="font-bold text-gray-900 text-sm mt-0.5">
                {evt.expectedAttendance?.toLocaleString()} people
              </p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Budget Consumed</p>
              <p className="font-bold text-gray-900 text-sm mt-0.5">
                {formatMoney(totalSpent)} <span className="text-xs text-gray-400">/ {formatMoney(evt.budget)}</span>
              </p>
              <p className="text-[10px] font-bold text-blue-600">{percentage}% utilized</p>
            </div>
          </div>

          {/* Description */}
          {evt.description && (
            <div className="text-xs text-gray-600">
              <span className="font-semibold text-gray-800">Objective: </span>
              {evt.description}
            </div>
          )}

          {/* Linked Expenses */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-sm">
                Itemized Expenses Linked to this Event ({eventExpenses.length})
              </h4>
              <button
                onClick={() => {
                  setSelectedEventDetail(null);
                  setIsAddExpenseOpen(true);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Expense to this Event</span>
              </button>
            </div>

            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-semibold uppercase text-gray-500">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {eventExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-gray-50/70">
                      <td className="py-2.5 px-3 text-gray-500">{formatDate(exp.expenseDate)}</td>
                      <td className="py-2.5 px-3 font-semibold text-gray-900">{exp.description}</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                          {exp.categoryIcon} {exp.categoryName}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-gray-900">
                        {formatMoney(exp.amount)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            exp.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800"
                              : exp.status === "SUBMITTED"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {exp.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {exp.receiptName && (
                          <button
                            onClick={() => setSelectedReceiptExpense(exp)}
                            className="text-gray-400 hover:text-blue-600"
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
                      <td colSpan={6} className="py-6 text-center text-gray-400">
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
