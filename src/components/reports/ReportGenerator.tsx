"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";
import {
  FileSpreadsheet,
  FileDown,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  Building,
  Shield,
} from "lucide-react";

export const ReportGenerator = () => {
  const { expenses, categories, events, formatMoney } = useApp();

  const [dateRange, setDateRange] = useState<string>("ALL");
  const [selectedEventId, setSelectedEventId] = useState<string>("ALL");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");

  // Filtered expenses for report
  const reportExpenses = expenses.filter((exp) => {
    const matchesEvent = selectedEventId === "ALL" || exp.eventId === selectedEventId;
    const matchesCategory = selectedCategoryId === "ALL" || exp.categoryId === selectedCategoryId;
    return matchesEvent && matchesCategory;
  });

  const totalSpent = reportExpenses.reduce((sum, e) => sum + e.amount, 0);
  const approvedTotal = reportExpenses
    .filter((e) => e.status === "APPROVED")
    .reduce((sum, e) => sum + e.amount, 0);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Expense ID,Date,Description,Vendor,Category,Event,Amount (KES),Status,Approved By"];
    const rows = reportExpenses.map((e) =>
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
      ].join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `poliledger_campaign_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Report (Triggers browser print which allows saving as PDF)
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Campaign Financial Reports</h2>
          <p className="text-xs text-gray-500">
            Generate formal expense audits for party oversight, donors, and regulatory bodies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Export to Excel / CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-xs sm:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Event / Rally</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Campaign Events</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Expenditure Category</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Reporting Period</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">Campaign to Date (Full Period)</option>
            <option value="30">Last 30 Days</option>
            <option value="7">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
        {/* Formal Header */}
        <div className="border-b-2 border-gray-900 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-blue-900 font-bold text-lg">
                <Shield className="h-6 w-6 text-blue-600" />
                <span>OFFICIAL CAMPAIGN EXPENSE AUDIT STATEMENT</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                Campaign of Hon. Jane Muthoni • Nairobi Senatorial Contest 2026
              </p>
              <p className="text-xs text-gray-500">
                Generated from PoliLedger Immutable Audit Database
              </p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>Date of Report: <strong>November 21, 2026</strong></p>
              <p>Reference: <strong>PL-AUD-2026-NBI</strong></p>
              <p className="text-emerald-700 font-bold mt-1">STATUS: VERIFIED</p>
            </div>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <span className="text-[11px] font-semibold uppercase text-gray-500">Total Filtered Claims</span>
            <p className="text-xl font-bold text-gray-900 mt-1">{reportExpenses.length} Items</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <span className="text-[11px] font-semibold uppercase text-emerald-800">Approved & Verified</span>
            <p className="text-xl font-bold text-emerald-900 mt-1">{formatMoney(approvedTotal)}</p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
            <span className="text-[11px] font-semibold uppercase text-blue-800">Total Expenditure</span>
            <p className="text-xl font-bold text-blue-900 mt-1">{formatMoney(totalSpent)}</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-[11px] font-bold uppercase text-gray-700">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Supplier / Vendor</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Event</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-mono text-[11px]">
              {reportExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td className="py-2.5 px-3 whitespace-nowrap">{exp.expenseDate}</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-gray-900">{exp.description}</td>
                  <td className="py-2.5 px-3 text-gray-600">{exp.vendorName || "Direct / Cash"}</td>
                  <td className="py-2.5 px-3 font-sans">
                    {exp.categoryIcon} {exp.categoryName}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-gray-600">{exp.eventName || "General"}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-gray-900">
                    {exp.currency} {exp.amount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Auditor Sign-off Block */}
        <div className="border-t-2 border-gray-200 pt-6 mt-8 grid grid-cols-2 gap-8 text-xs">
          <div>
            <p className="font-bold text-gray-900">Patrick Mwangi, CPA</p>
            <p className="text-gray-500">Chief Auditor & Compliance Director</p>
            <div className="mt-4 border-b border-gray-400 w-48"></div>
            <p className="text-[10px] text-gray-400 mt-1">Digital Signature Timestamp: 2026-11-21T10:00:00Z</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900">Hon. Jane Muthoni</p>
            <p className="text-gray-500">Candidate & Account Principal</p>
            <div className="mt-4 border-b border-gray-400 w-48 ml-auto"></div>
            <p className="text-[10px] text-gray-400 mt-1">Certified for Public Records</p>
          </div>
        </div>
      </div>
    </div>
  );
};
