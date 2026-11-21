"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  MOCK_USERS,
  MOCK_CATEGORIES,
  MOCK_EVENTS,
  MOCK_EXPENSES,
  MockUser,
  MockCategory,
  MockEvent,
  MockExpense,
  MockBudgetAlert,
} from "@/data/mock-data";
import { Role, ExpenseStatus, EventStatus } from "@/lib/types";

// ─── CURRENCY RATES (Relative to KES) ─────────────────────────────────

export const EXCHANGE_RATES: Record<string, number> = {
  KES: 1,
  USD: 130.5,
  EUR: 141.8,
  GBP: 168.2,
  UGX: 0.035,
  TZS: 0.051,
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  KES: "KSh",
  USD: "$",
  EUR: "€",
  GBP: "£",
  UGX: "USh",
  TZS: "TSh",
};

interface AppContextType {
  // Current user & role switching
  currentUser: MockUser;
  switchUser: (userId: string) => void;
  allUsers: MockUser[];

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Currency
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  formatMoney: (amountInKes: number) => string;
  convertFromKes: (amountInKes: number) => number;

  // Expenses CRUD & Approvals
  expenses: MockExpense[];
  addExpense: (expense: Omit<MockExpense, "id" | "createdAt" | "createdById" | "createdByName" | "createdByRole" | "categoryName" | "categoryIcon" | "categoryColor" | "eventName">) => void;
  updateExpense: (id: string, updates: Partial<MockExpense>) => void;
  deleteExpense: (id: string) => void;
  approveExpense: (id: string, notes?: string) => void;
  rejectExpense: (id: string, reason: string) => void;

  // Events CRUD
  events: MockEvent[];
  addEvent: (event: Omit<MockEvent, "id">) => void;
  updateEvent: (id: string, updates: Partial<MockEvent>) => void;
  deleteEvent: (id: string) => void;

  // Categories & Budgets
  categories: MockCategory[];
  totalCampaignBudget: number;
  totalSpent: number;
  budgetAlerts: MockBudgetAlert[];

  // UI state & Modals
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (open: boolean) => void;
  isAddEventOpen: boolean;
  setIsAddEventOpen: (open: boolean) => void;
  selectedReceiptExpense: MockExpense | null;
  setSelectedReceiptExpense: (expense: MockExpense | null) => void;
  selectedEventDetail: MockEvent | null;
  setSelectedEventDetail: (event: MockEvent | null) => void;

  // Filters & Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  selectedEventFilter: string;
  setSelectedEventFilter: (evt: string) => void;
  selectedStatusFilter: string;
  setSelectedStatusFilter: (status: string) => void;

  // Notification dismissed list
  dismissedAlerts: string[];
  dismissAlert: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Users
  const [currentUser, setCurrentUser] = useState<MockUser>(MOCK_USERS[0]);

  // Navigation
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Currency view
  const [selectedCurrency, setSelectedCurrency] = useState<string>("KES");

  // Data states
  const [expenses, setExpenses] = useState<MockExpense[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("poliledger_expenses");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return MOCK_EXPENSES;
  });

  const [events, setEvents] = useState<MockEvent[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("poliledger_events");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return MOCK_EVENTS;
  });

  const [categories] = useState<MockCategory[]>(MOCK_CATEGORIES);

  // Modals & UI states
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedReceiptExpense, setSelectedReceiptExpense] = useState<MockExpense | null>(null);
  const [selectedEventDetail, setSelectedEventDetail] = useState<MockEvent | null>(null);

  // Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");
  const [selectedEventFilter, setSelectedEventFilter] = useState("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  // Persist expenses
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("poliledger_expenses", JSON.stringify(expenses));
    }
  }, [expenses]);

  // Persist events
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("poliledger_events", JSON.stringify(events));
    }
  }, [events]);

  // Switch User / Role
  const switchUser = (userId: string) => {
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  // Convert and format currency
  const convertFromKes = (amountInKes: number): number => {
    const rate = EXCHANGE_RATES[selectedCurrency] || 1;
    return amountInKes / rate;
  };

  const formatMoney = (amountInKes: number): string => {
    const converted = convertFromKes(amountInKes);
    const symbol = CURRENCY_SYMBOLS[selectedCurrency] || selectedCurrency;
    return `${symbol} ${new Intl.NumberFormat("en-KE", {
      maximumFractionDigits: selectedCurrency === "KES" || selectedCurrency === "UGX" || selectedCurrency === "TZS" ? 0 : 2,
      minimumFractionDigits: 0,
    }).format(converted)}`;
  };

  // Total spent calculation (only approved + submitted)
  const totalSpent = expenses
    .filter((e) => e.status === "APPROVED" || e.status === "SUBMITTED")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalCampaignBudget = categories.reduce((sum, c) => sum + c.budgetLimit, 0);

  // Dynamic Budget Alerts (75% warning, 90%+ critical)
  const budgetAlerts: MockBudgetAlert[] = [];

  // Category alerts
  categories.forEach((cat) => {
    const catSpent = expenses
      .filter((e) => e.categoryId === cat.id && (e.status === "APPROVED" || e.status === "SUBMITTED"))
      .reduce((sum, e) => sum + e.amount, 0);

    const pct = Math.round((catSpent / cat.budgetLimit) * 100);
    if (pct >= 90) {
      budgetAlerts.push({
        id: `alert-cat-${cat.id}`,
        type: "CATEGORY",
        targetId: cat.id,
        targetName: cat.name,
        spent: catSpent,
        limit: cat.budgetLimit,
        percentage: pct,
        threshold: 90,
        severity: "CRITICAL",
        message: `${cat.name} spending has reached ${pct}% of its budget limit (${formatMoney(catSpent)} / ${formatMoney(cat.budgetLimit)})!`,
      });
    } else if (pct >= 75) {
      budgetAlerts.push({
        id: `alert-cat-${cat.id}`,
        type: "CATEGORY",
        targetId: cat.id,
        targetName: cat.name,
        spent: catSpent,
        limit: cat.budgetLimit,
        percentage: pct,
        threshold: 75,
        severity: "WARNING",
        message: `${cat.name} spending is at ${pct}% of its budget allocation.`,
      });
    }
  });

  // Event alerts
  events.forEach((evt) => {
    const evtSpent = expenses
      .filter((e) => e.eventId === evt.id && (e.status === "APPROVED" || e.status === "SUBMITTED"))
      .reduce((sum, e) => sum + e.amount, 0);

    const pct = Math.round((evtSpent / evt.budget) * 100);
    if (pct >= 90) {
      budgetAlerts.push({
        id: `alert-evt-${evt.id}`,
        type: "EVENT",
        targetId: evt.id,
        targetName: evt.name,
        spent: evtSpent,
        limit: evt.budget,
        percentage: pct,
        threshold: 90,
        severity: "CRITICAL",
        message: `Event "${evt.name}" has consumed ${pct}% of its allocated budget!`,
      });
    } else if (pct >= 75) {
      budgetAlerts.push({
        id: `alert-evt-${evt.id}`,
        type: "EVENT",
        targetId: evt.id,
        targetName: evt.name,
        spent: evtSpent,
        limit: evt.budget,
        percentage: pct,
        threshold: 75,
        severity: "WARNING",
        message: `Event "${evt.name}" is approaching its budget limit (${pct}% used).`,
      });
    }
  });

  // Dismiss an alert
  const dismissAlert = (id: string) => {
    setDismissedAlerts((prev) => [...prev, id]);
  };

  // ─── EXPENSE MUTATIONS ─────────────────────────────────────────────

  const addExpense: AppContextType["addExpense"] = (data) => {
    const category = categories.find((c) => c.id === data.categoryId);
    const event = events.find((e) => e.id === data.eventId);

    const newExpense: MockExpense = {
      ...data,
      id: `exp-${Date.now()}`,
      categoryName: category?.name || "Miscellaneous",
      categoryIcon: category?.icon || "📁",
      categoryColor: category?.colorHex || "#6B7280",
      eventName: event?.name,
      createdById: currentUser.id,
      createdByName: currentUser.name,
      createdByRole: currentUser.role,
      createdAt: new Date().toISOString(),
      // Auto-approve if Politician creates it, otherwise default to SUBMITTED or DRAFT
      status: data.status || (currentUser.role === "POLITICIAN" ? "APPROVED" : "SUBMITTED"),
      approvedBy: currentUser.role === "POLITICIAN" ? currentUser.name : undefined,
      approvedAt: currentUser.role === "POLITICIAN" ? new Date().toISOString() : undefined,
    };

    setExpenses((prev) => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, updates: Partial<MockExpense>) => {
    setExpenses((prev) => prev.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp)));
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const approveExpense = (id: string) => {
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === id
          ? {
              ...exp,
              status: "APPROVED" as ExpenseStatus,
              approvedBy: currentUser.name,
              approvedAt: new Date().toISOString(),
              rejectionReason: undefined,
            }
          : exp
      )
    );
  };

  const rejectExpense = (id: string, reason: string) => {
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === id
          ? {
              ...exp,
              status: "REJECTED" as ExpenseStatus,
              rejectionReason: reason,
            }
          : exp
      )
    );
  };

  // ─── EVENT MUTATIONS ───────────────────────────────────────────────

  const addEvent: AppContextType["addEvent"] = (data) => {
    const newEvent: MockEvent = {
      ...data,
      id: `evt-${Date.now()}`,
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const updateEvent = (id: string, updates: Partial<MockEvent>) => {
    setEvents((prev) => prev.map((evt) => (evt.id === id ? { ...evt, ...updates } : evt)));
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        allUsers: MOCK_USERS,

        activeTab,
        setActiveTab,

        selectedCurrency,
        setSelectedCurrency,
        formatMoney,
        convertFromKes,

        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        approveExpense,
        rejectExpense,

        events,
        addEvent,
        updateEvent,
        deleteEvent,

        categories,
        totalCampaignBudget,
        totalSpent,
        budgetAlerts,

        isAddExpenseOpen,
        setIsAddExpenseOpen,
        isAddEventOpen,
        setIsAddEventOpen,
        selectedReceiptExpense,
        setSelectedReceiptExpense,
        selectedEventDetail,
        setSelectedEventDetail,

        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        selectedEventFilter,
        setSelectedEventFilter,
        selectedStatusFilter,
        setSelectedStatusFilter,

        dismissedAlerts,
        dismissAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
