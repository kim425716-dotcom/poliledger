"use client";

import React, { useState } from "react";
import { useApp, EXCHANGE_RATES } from "@/context/AppContext";
import { X, Upload, CheckCircle2, Trash2 } from "lucide-react";

const ExpenseFormContent = ({
  initialEventId,
  initialCategoryId,
  initialCurrency,
  onClose,
}: {
  initialEventId: string;
  initialCategoryId: string;
  initialCurrency: string;
  onClose: () => void;
}) => {
  const { categories, events, addExpense, activeCampaign, formatMoney } = useApp();

  const [eventId, setEventId] = useState(initialEventId);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(initialCurrency);
  const [description, setDescription] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptDataUrl, setReceiptDataUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    setReceiptFile(file);
    // Keep small files in localStorage safely via Data URL so Download works on the viewer modal
    if (file.size <= 1_500_000) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setReceiptDataUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setReceiptDataUrl(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || Number(amount) <= 0) return;

    const rate = EXCHANGE_RATES[currency] || 1;
    const rawAmount = Number(amount);
    const amountInKes = Math.round(rawAmount * rate);
    const conversionNote =
      currency !== "KES" ? `Original entry: ${currency} ${rawAmount.toLocaleString()}` : "";
    const combinedNotes = [notes.trim(), conversionNote].filter(Boolean).join(" • ");

    addExpense({
      eventId: eventId || undefined,
      categoryId,
      expenseDate,
      description: description.trim(),
      amount: amountInKes,
      currency: "KES",
      vendorName: vendorName.trim() || "Direct / Supplier",
      location: location.trim() || activeCampaign.constituency,
      notes: combinedNotes || undefined,
      status: "SUBMITTED",
      receiptName: receiptFile ? receiptFile.name : "receipt_manual_upload.pdf",
      receiptSize: receiptFile
        ? `${Math.max(1, Math.round(receiptFile.size / 1024))} KB`
        : "420 KB",
      receiptUrl: receiptDataUrl || undefined,
    });

    onClose();
  };

  const kesEquivalent =
    amount && Number(amount) > 0 && currency !== "KES"
      ? Math.round(Number(amount) * (EXCHANGE_RATES[currency] || 1))
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-2xl space-y-5 my-8 text-gray-900 dark:text-gray-100 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Log Expense &mdash; {activeCampaign.politicianName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {activeCampaign.office} &bull; Attach receipt or invoice for auditor verification
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Linked Event & Category in 2 columns */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Link to Meeting / Rally
              </label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">General Campaign (No specific event)</option>
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.eventType}: {evt.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Expense Category *
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Amount */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Date of Expenditure *
              </label>
              <input
                type="date"
                required
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Amount &amp; Currency *
              </label>
              <div className="flex">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2.5 py-2 text-xs text-gray-700 dark:text-gray-300 font-medium"
                >
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  placeholder="e.g. 150000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-r-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {kesEquivalent !== null && (
                <p className="mt-1 text-[10px] text-blue-600 dark:text-blue-400">
                  Ledger equivalent: {formatMoney(kesEquivalent)}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. PA sound system rental and stage lighting setup"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Vendor & Location */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Vendor / Supplier Name
              </label>
              <input
                type="text"
                placeholder="e.g. KICC Corp, Toyota Kenya, Safaricom"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Location / Town
              </label>
              <input
                type="text"
                placeholder={`e.g. ${activeCampaign.constituency}`}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Supporting Receipt / Document Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Attach Receipt / Official Invoice (Photo or PDF)
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) {
                  handleFileSelect(e.dataTransfer.files[0]);
                }
              }}
              className={`flex justify-center rounded-xl border-2 border-dashed px-6 py-5 transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
                  : "border-gray-300 dark:border-gray-700 hover:border-blue-400"
              }`}
            >
              <div className="text-center">
                {receiptFile ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-bold">{receiptFile.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setReceiptFile(null);
                        setReceiptDataUrl(null);
                      }}
                      className="rounded p-1 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400"
                      title="Remove attachment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
                    <div className="mt-2 flex text-xs text-gray-600 dark:text-gray-400 justify-center">
                      <label className="relative cursor-pointer rounded-md font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500">
                        <span>Upload a document</span>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                          }}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                      PNG, JPG, WEBP, PDF up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Internal Campaign Notes / Justification
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Approved under emergency youth transport allocation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
            >
              Submit for Audit Approval
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ExpenseFormModal = () => {
  const {
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    preselectedEventId,
    categories,
    activeCampaign,
  } = useApp();

  if (!isAddExpenseOpen) return null;

  return (
    <ExpenseFormContent
      key={`${activeCampaign.id}-${preselectedEventId || "general"}`}
      initialEventId={preselectedEventId || ""}
      initialCategoryId={categories[0]?.id || ""}
      initialCurrency={activeCampaign.defaultCurrency || "KES"}
      onClose={() => setIsAddExpenseOpen(false)}
    />
  );
};
