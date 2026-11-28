"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Check, Plus, Edit2, X } from "lucide-react";

const CATEGORY_ICONS = ["🏛️", "🚌", "🍽️", "🛡️", "📰", "🏨", "🖨️", "📱", "🎤", "⚖️", "📁"];

export const BudgetManager = () => {
  const { categories, expenses, formatMoney, updateCategoryLimit, addCategory, currentUser, activeCampaign } =
    useApp();

  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editLimitValue, setEditLimitValue] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("🎤");
  const [newLimit, setNewLimit] = useState("300000");

  const canManageBudgets =
    currentUser.role === "POLITICIAN" ||
    currentUser.role === "CAMPAIGN_MANAGER" ||
    currentUser.role === "ADMIN";

  const handleStartEdit = (catId: string, currentLimit: number) => {
    setEditingCatId(catId);
    setEditLimitValue(String(currentLimit));
  };

  const handleSaveEdit = (catId: string) => {
    const parsed = Number(editLimitValue);
    if (parsed > 0) {
      updateCategoryLimit(catId, parsed);
    }
    setEditingCatId(null);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum = Number(newLimit);
    if (!newName.trim() || !limitNum || limitNum <= 0) return;

    addCategory({
      name: newName.trim(),
      icon: newIcon,
      colorHex: "#3B82F6",
      budgetLimit: limitNum,
    });

    setNewName("");
    setNewLimit("300000");
    setIsAddingCategory(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Budget Limits &amp; Thresholds
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Define expenditure ceilings and alert triggers for {activeCampaign.politicianName}&apos;s campaign categories
          </p>
        </div>

        {canManageBudgets && (
          <button
            type="button"
            onClick={() => setIsAddingCategory(!isAddingCategory)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors self-start sm:self-auto"
          >
            {isAddingCategory ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{isAddingCategory ? "Cancel" : "Add Budget Category"}</span>
          </button>
        )}
      </div>

      {/* Add Category Drawer */}
      {isAddingCategory && (
        <form
          onSubmit={handleCreateCategory}
          className="rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/40 dark:bg-blue-950/30 p-4 space-y-3"
        >
          <p className="text-xs font-bold text-blue-900 dark:text-blue-200">
            Create New Campaign Budget Category
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Digital Advertising"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Ceiling Limit (KES) *
              </label>
              <input
                type="number"
                required
                min="1000"
                step="1000"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-bold text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Icon
              </label>
              <div className="flex flex-wrap gap-1">
                {CATEGORY_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setNewIcon(ic)}
                    className={`rounded-md px-1.5 py-1 text-sm border ${
                      newIcon === ic
                        ? "border-blue-600 bg-blue-100 dark:bg-blue-900/60"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingCategory(false)}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const catExpenses = expenses.filter(
            (e) => e.categoryId === cat.id && (e.status === "APPROVED" || e.status === "SUBMITTED")
          );
          const spent = catExpenses.reduce((sum, e) => sum + e.amount, 0);
          const percentage = cat.budgetLimit > 0 ? Math.round((spent / cat.budgetLimit) * 100) : 0;
          const isCritical = percentage >= 90;
          const isWarning = percentage >= 75 && percentage < 90;
          const remaining = Math.max(0, cat.budgetLimit - spent);
          const isEditing = editingCatId === cat.id;

          return (
            <div
              key={cat.id}
              className={`rounded-xl border bg-white dark:bg-gray-900 p-5 shadow-xs space-y-4 transition-colors ${
                isCritical
                  ? "border-rose-200 dark:border-rose-800/60"
                  : isWarning
                  ? "border-amber-200 dark:border-amber-800/60"
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl">{cat.icon}</span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">Alert at 75% &amp; 90%</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {canManageBudgets && !isEditing && (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(cat.id, cat.budgetLimit)}
                      className="rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                      title="Edit Category Limit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isCritical
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300"
                        : isWarning
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                    }`}
                  >
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Inline Limit Editor */}
              {isEditing && (
                <div className="flex items-center gap-1.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/40 p-2">
                  <input
                    type="number"
                    min="1000"
                    step="5000"
                    value={editLimitValue}
                    onChange={(e) => setEditLimitValue(e.target.value)}
                    className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-xs font-bold text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(cat.id)}
                    className="rounded bg-blue-600 p-1.5 text-white hover:bg-blue-700"
                    title="Save Limit"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCatId(null)}
                    className="rounded border border-gray-300 dark:border-gray-700 p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="Cancel"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCritical ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs pt-1">
                  <span className="text-gray-500 dark:text-gray-400">
                    Spent: <strong className="text-gray-900 dark:text-white">{formatMoney(spent)}</strong>
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    Limit:{" "}
                    <strong className="text-gray-900 dark:text-white">{formatMoney(cat.budgetLimit)}</strong>
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>
                  Remaining:{" "}
                  <strong className="text-gray-900 dark:text-white">{formatMoney(remaining)}</strong>
                </span>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                  {catExpenses.length} claims
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
