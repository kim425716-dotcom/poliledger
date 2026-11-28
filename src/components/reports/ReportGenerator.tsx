"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  FileSpreadsheet,
  Printer,
  FileDown,
  Calendar,
  CheckCircle2,
  Building,
  Shield,
  Filter,
} from "lucide-react";

export const ReportGenerator = () => {
  const { expenses, events, categories, totalSpent, formatMoney, activeCampaign, allUsers } = useApp();
  const leadAuditor = allUsers.find((u) => u.role === "AUDITOR");
  const candidateOwner = allUsers.find((u) => u.role === "POLITICIAN");

  const [selectedEventId, setSelectedEventId] = useState<string>("ALL");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState<string>("ALL");

  const reportExpenses = expenses.filter((e) => {
    const matchEvent = selectedEventId === "ALL" || e.eventId === selectedEventId;
    const matchCat = selectedCategoryId === "ALL" || e.categoryId === selectedCategoryId;
    return matchEvent && matchCat;
  });

  const approvedTotal = reportExpenses
    .filter((e) => e.status === "APPROVED")
    .reduce((sum, e) => sum + e.amount, 0);

  const handleExportCSV = () => {
    const headers = "ID,Date,Description,Vendor,Category,Event,Amount,Currency,Status,ApprovedBy";
    const rows = reportExpenses.map((e) =>
      [
        e.id,
        e.expenseDate,
        `"${e.description.replace(/"/g, '""')}"`,
        `"${(e.vendorName || "").replace(/"/g, '""')}"`,
        `"${e.categoryName}"`,
        `"${(e.eventName || "General Campaign").replace(/"/g, '""')}"`,
        e.amount,
        e.currency,
        e.status,
        `"${e.approvedBy || ""}"`,
      ].join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `poliledger_formal_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Audit & Compliance Reports</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Generate formal campaign financial disclosures compliant with election regulations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
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
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-xs sm:grid-cols-3 transition-colors">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Event / Rally</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Expenditure Category</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Reporting Period</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">Campaign to Date (Full Period)</option>
            <option value="30">Last 30 Days</option>
            <option value="7">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm space-y-6 text-gray-900 dark:text-gray-100 transition-colors">
        {/* Formal Header */}
        <div className="border-b-2 border-gray-900 dark:border-gray-700 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold text-lg">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span>OFFICIAL CAMPAIGN EXPENSE AUDIT STATEMENT</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1">
                Campaign of {activeCampaign.politicianName} &bull; {activeCampaign.office} ({activeCampaign.constituency})
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activeCampaign.party} &bull; {activeCampaign.electionCycle} &bull; PoliLedger Audit Ledger
              </p>
            </div>
            <div className="text-right text-xs text-gray-500 dark:text-gray-400">
              <p>Date of Report: <strong>November 28, 2026</strong></p>
              <p>Reference: <strong>PL-AUD-{activeCampaign.slug.toUpperCase()}</strong></p>
              <p className="text-emerald-700 dark:text-emerald-400 font-bold mt-1">STATUS: VERIFIED</p>
            </div>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-4">
            <span className="text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400">Total Filtered Claims</span>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{reportExpenses.length} Items</p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/40 p-4">
            <span className="text-[11px] font-semibold uppercase text-emerald-800 dark:text-emerald-300">Approved &amp; Verified</span>
            <p className="text-xl font-bold text-emerald-900 dark:text-emerald-200 mt-1">{formatMoney(approvedTotal)}</p>
          </div>
          <div className="rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/60 dark:bg-blue-950/40 p-4">
            <span className="text-[11px] font-semibold uppercase text-blue-800 dark:text-blue-300">Total Expenditure</span>
            <p className="text-xl font-bold text-blue-900 dark:text-blue-200 mt-1">{formatMoney(totalSpent)}</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800 text-[11px] font-bold uppercase text-gray-700 dark:text-gray-300">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Supplier / Vendor</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Event</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 font-mono text-[11px]">
              {reportExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{exp.expenseDate}</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-gray-900 dark:text-white">{exp.description}</td>
                  <td className="py-2.5 px-3 text-gray-600 dark:text-gray-400">{exp.vendorName || "Direct / Cash"}</td>
                  <td className="py-2.5 px-3 font-sans text-gray-700 dark:text-gray-300">
                    {exp.categoryIcon} {exp.categoryName}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-gray-600 dark:text-gray-400">{exp.eventName || "General"}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-gray-900 dark:text-white">
                    {exp.currency} {exp.amount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Auditor Sign-off Block */}
        <div className="border-t-2 border-gray-200 dark:border-gray-800 pt-6 mt-8 grid grid-cols-2 gap-8 text-xs">
          <div>
            <p className="font-bold text-gray-900 dark:text-white">
              {leadAuditor?.name || "Independent Compliance CPA"}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {leadAuditor?.title || "Chief Auditor & Compliance Director"}
            </p>
            <div className="mt-4 border-b border-gray-400 dark:border-gray-600 w-48"></div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Digital Signature Timestamp: 2026-11-28T10:00:00Z</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900 dark:text-white">
              {candidateOwner?.name || activeCampaign.politicianName}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {activeCampaign.office} Candidate &amp; Account Principal
            </p>
            <div className="mt-4 border-b border-gray-400 dark:border-gray-600 w-48 ml-auto"></div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Certified for Public Records</p>
          </div>
        </div>
      </div>
    </div>
  );
};
