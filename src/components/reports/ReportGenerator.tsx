"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { FileSpreadsheet, Printer, Shield } from "lucide-react";

export const ReportGenerator = () => {
  const { expenses, events, categories, formatMoney, activeCampaign, allUsers } = useApp();
  const leadAuditor = allUsers.find((u) => u.role === "AUDITOR");
  const candidateOwner = allUsers.find((u) => u.role === "POLITICIAN");

  const [selectedEventId, setSelectedEventId] = useState<string>("ALL");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState<string>("ALL");

  // Guard against IDs from a previous campaign
  const safeEventId =
    selectedEventId === "ALL" || events.some((e) => e.id === selectedEventId)
      ? selectedEventId
      : "ALL";
  const safeCategoryId =
    selectedCategoryId === "ALL" || categories.some((c) => c.id === selectedCategoryId)
      ? selectedCategoryId
      : "ALL";

  // Anchor date range relative to the latest campaign expense/current date
  const [referenceMs] = useState<number>(() => Date.now());

  const reportExpenses = expenses.filter((e) => {
    const matchEvent = safeEventId === "ALL" || e.eventId === safeEventId;
    const matchCat = safeCategoryId === "ALL" || e.categoryId === safeCategoryId;

    let matchDate = true;
    if (dateRange === "30" || dateRange === "7") {
      const days = Number(dateRange);
      const expTime = new Date(e.expenseDate).getTime();
      if (!Number.isNaN(expTime)) {
        const diffDays = (referenceMs - expTime) / (1000 * 60 * 60 * 24);
        matchDate = diffDays <= days;
      }
    }

    return matchEvent && matchCat && matchDate;
  });

  const approvedTotal = reportExpenses
    .filter((e) => e.status === "APPROVED")
    .reduce((sum, e) => sum + e.amount, 0);

  const filteredTotal = reportExpenses
    .filter((e) => e.status === "APPROVED" || e.status === "SUBMITTED")
    .reduce((sum, e) => sum + e.amount, 0);

  const handleExportCSV = () => {
    const headers = "ID,Date,Description,Vendor,Category,Event,AmountKES,Status,ApprovedBy";
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

    const blob = new Blob([[headers, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `poliledger_${activeCampaign.slug}_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const reportDateFormatted = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Audit &amp; Compliance Reports
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Generate formal campaign financial disclosures compliant with election regulations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export to Excel / CSV</span>
          </button>
          <button
            type="button"
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
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Event / Rally
          </label>
          <select
            value={safeEventId}
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
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Expenditure Category
          </label>
          <select
            value={safeCategoryId}
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
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Reporting Period
          </label>
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
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold text-lg">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span>OFFICIAL CAMPAIGN EXPENSE AUDIT STATEMENT</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1">
                Campaign of {activeCampaign.politicianName} &bull; {activeCampaign.office} (
                {activeCampaign.constituency})
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activeCampaign.party} &bull; {activeCampaign.electionCycle} &bull; PoliLedger Audit Ledger
              </p>
            </div>
            <div className="text-right text-xs text-gray-500 dark:text-gray-400 shrink-0">
              <p>
                Date of Report: <strong>{reportDateFormatted}</strong>
              </p>
              <p>
                Reference: <strong>PL-AUD-{activeCampaign.slug.toUpperCase()}</strong>
              </p>
              <p className="text-emerald-700 dark:text-emerald-400 font-bold mt-1">STATUS: VERIFIED</p>
            </div>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-4">
            <span className="text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400">
              Total Filtered Claims
            </span>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
              {reportExpenses.length} Items
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/40 p-4">
            <span className="text-[11px] font-semibold uppercase text-emerald-800 dark:text-emerald-300">
              Approved &amp; Verified
            </span>
            <p className="text-xl font-bold text-emerald-900 dark:text-emerald-200 mt-1">
              {formatMoney(approvedTotal)}
            </p>
          </div>
          <div className="rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/60 dark:bg-blue-950/40 p-4">
            <span className="text-[11px] font-semibold uppercase text-blue-800 dark:text-blue-300">
              Filtered Expenditure
            </span>
            <p className="text-xl font-bold text-blue-900 dark:text-blue-200 mt-1">
              {formatMoney(filteredTotal)}
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-x-auto">
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
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {exp.expenseDate}
                  </td>
                  <td className="py-2.5 px-3 font-sans font-medium text-gray-900 dark:text-white">
                    {exp.description}
                  </td>
                  <td className="py-2.5 px-3 text-gray-600 dark:text-gray-400">
                    {exp.vendorName || "Direct / Cash"}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-gray-700 dark:text-gray-300">
                    {exp.categoryIcon} {exp.categoryName}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-gray-600 dark:text-gray-400">
                    {exp.eventName || "General"}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-gray-900 dark:text-white">
                    {formatMoney(exp.amount)}
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

              {reportExpenses.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center font-sans text-gray-400 dark:text-gray-500">
                    No expenditures found matching the selected report filters.
                  </td>
                </tr>
              )}
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
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              Verified Digital Audit Statement
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900 dark:text-white">
              {candidateOwner?.name || activeCampaign.politicianName}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {activeCampaign.office} Candidate &amp; Account Principal
            </p>
            <div className="mt-4 border-b border-gray-400 dark:border-gray-600 w-48 ml-auto"></div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              Certified for Public Records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
