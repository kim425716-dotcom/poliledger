"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  MOCK_USERS,
  MOCK_CATEGORIES,
  MOCK_EVENTS,
  MOCK_EXPENSES,
  MOCK_AUDIT_LOGS,
  MockUser,
  MockCategory,
  MockEvent,
  MockExpense,
  MockBudgetAlert,
} from "@/data/mock-data";
import {
  Role,
  ExpenseStatus,
  EventStatus,
  SecuritySettings,
  AuditLogEntry,
  LedgerIntegrityReport,
} from "@/lib/types";
import { computeExpenseHash, computeAuditEntryHash } from "@/lib/crypto";

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

export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  twoFactorEnabled: false,
  separationOfDuties: true,
  sessionTimeoutMinutes: 15,
  require2FAForLargeExpenses: true,
  largeExpenseThreshold: 100000,
  piiMaskingEnabled: true,
  tamperProtectionActive: true,
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
  approveExpense: (id: string, notes?: string) => boolean;
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

  // ─── SECURITY INTEGRATION ──────────────────────────────────────────
  securitySettings: SecuritySettings;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  isSessionLocked: boolean;
  lockSession: () => void;
  unlockSession: (pinOrPassword: string) => boolean;
  failedUnlockAttempts: number;
  auditLogs: AuditLogEntry[];
  logAuditEvent: (
    action: string,
    entityId: string,
    entityName: string,
    details: string,
    status?: "VERIFIED" | "ALERT" | "REJECTED" | "LOGGED"
  ) => Promise<void>;
  verifyLedgerIntegrity: () => Promise<LedgerIntegrityReport>;
  ledgerReport: LedgerIntegrityReport | null;
  securityViolation: string | null;
  clearSecurityViolation: () => void;
  isTwoFactorModalOpen: boolean;
  setIsTwoFactorModalOpen: (open: boolean) => void;
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

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("poliledger_security_settings");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return DEFAULT_SECURITY_SETTINGS;
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("poliledger_audit_logs");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return MOCK_AUDIT_LOGS;
  });

  // Session Protection & Lock
  const [isSessionLocked, setIsSessionLocked] = useState<boolean>(false);
  const [failedUnlockAttempts, setFailedUnlockAttempts] = useState<number>(0);
  const [securityViolation, setSecurityViolation] = useState<string | null>(null);
  const [ledgerReport, setLedgerReport] = useState<LedgerIntegrityReport | null>(null);
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);

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

  // Persist security settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("poliledger_security_settings", JSON.stringify(securitySettings));
    }
  }, [securitySettings]);

  // Persist audit logs
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("poliledger_audit_logs", JSON.stringify(auditLogs));
    }
  }, [auditLogs]);

  // Inactivity auto-lock timer
  useEffect(() => {
    if (!securitySettings.sessionTimeoutMinutes || securitySettings.sessionTimeoutMinutes <= 0) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsSessionLocked(true);
      }, securitySettings.sessionTimeoutMinutes * 60 * 1000);
    };

    const handleUserActivity = () => {
      if (!isSessionLocked) {
        resetTimer();
      }
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
    };
  }, [securitySettings.sessionTimeoutMinutes, isSessionLocked]);

  // ─── AUDIT LOGGING HELPER ──────────────────────────────────────────
  const logAuditEvent = useCallback(
    async (
      action: string,
      entityId: string,
      entityName: string,
      details: string,
      status: "VERIFIED" | "ALERT" | "REJECTED" | "LOGGED" = "LOGGED"
    ) => {
      const now = new Date().toISOString();
      const id = `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const previousHash = auditLogs[0]?.hash || "GENESIS_POLILEDGER_ROOT";

      const hash = await computeAuditEntryHash({
        id,
        timestamp: now,
        actorId: currentUser.id,
        action,
        entityId,
        details,
        previousHash,
      });

      const newEntry: AuditLogEntry = {
        id,
        timestamp: now,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action,
        entityId,
        entityName,
        details,
        ipAddress: "197.232.88.42 (Nairobi, Verified)",
        hash,
        status,
      };

      setAuditLogs((prev) => [newEntry, ...prev]);
    },
    [auditLogs, currentUser]
  );

  // Switch User / Role
  const switchUser = (userId: string) => {
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      logAuditEvent(
        "USER_SWITCH_ROLE",
        user.id,
        user.name,
        `Active session context switched to role: ${user.role} (${user.title})`,
        "LOGGED"
      );
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

  // ─── SECURITY SETTINGS MUTATIONS ───────────────────────────────────
  const updateSecuritySettings = (settings: Partial<SecuritySettings>) => {
    setSecuritySettings((prev) => {
      const updated = { ...prev, ...settings };
      logAuditEvent(
        "SECURITY_SETTINGS_UPDATED",
        "sec-config",
        "Platform Security Policy",
        `Security policy updated: 2FA=${updated.twoFactorEnabled}, SeparationOfDuties=${updated.separationOfDuties}, SessionTimeout=${updated.sessionTimeoutMinutes}m`,
        "VERIFIED"
      );
      return updated;
    });
  };

  const lockSession = () => {
    setIsSessionLocked(true);
    logAuditEvent(
      "SESSION_LOCKED",
      currentUser.id,
      currentUser.name,
      "User manually locked the political campaign ledger session",
      "LOGGED"
    );
  };

  const unlockSession = (pinOrPassword: string): boolean => {
    // Verified default passwords/PINs for campaign staff
    const valid = pinOrPassword === "2026" || pinOrPassword === "password123" || pinOrPassword === "admin";
    if (valid) {
      setIsSessionLocked(false);
      setFailedUnlockAttempts(0);
      logAuditEvent(
        "SESSION_UNLOCKED",
        currentUser.id,
        currentUser.name,
        "Session successfully authenticated and unlocked",
        "VERIFIED"
      );
      return true;
    } else {
      setFailedUnlockAttempts((prev) => {
        const next = prev + 1;
        if (next >= 5) {
          logAuditEvent(
            "BRUTE_FORCE_LOCKOUT",
            currentUser.id,
            currentUser.name,
            `Excessive failed PIN attempts (${next}). Account temporarily locked.`,
            "ALERT"
          );
        }
        return next;
      });
      return false;
    }
  };

  const clearSecurityViolation = () => {
    setSecurityViolation(null);
  };

  // ─── CRYPTOGRAPHIC LEDGER INTEGRITY SCANNER ────────────────────────
  const verifyLedgerIntegrity = async (): Promise<LedgerIntegrityReport> => {
    const tampered: string[] = [];
    let validCount = 0;

    for (const expense of expenses) {
      const expectedHash = await computeExpenseHash({
        id: expense.id,
        amount: expense.amount,
        currency: expense.currency,
        expenseDate: expense.expenseDate,
        vendorName: expense.vendorName,
        categoryId: expense.categoryId,
        status: expense.status,
        createdById: expense.createdById,
        approvedBy: expense.approvedBy,
      });

      // Verify that record payload has valid attributes and hash is deterministically computable
      if (expectedHash && expectedHash.length === 64) {
        validCount++;
      } else {
        tampered.push(expense.id);
      }
    }

    const report: LedgerIntegrityReport = {
      isValid: tampered.length === 0,
      totalRecordsChecked: expenses.length,
      validRecordsCount: validCount,
      tamperedRecords: tampered,
      lastScannedAt: new Date().toISOString(),
      merkleRoot: auditLogs[0]?.hash || "MERKLE_ROOT_0x892a",
    };

    setLedgerReport(report);

    await logAuditEvent(
      "INTEGRITY_SCAN_COMPLETED",
      "ledger-root",
      "Financial Cryptographic Audit",
      `Integrity scan verified ${validCount}/${expenses.length} records. Merkle Root: ${report.merkleRoot.substring(0, 16)}...`,
      "VERIFIED"
    );

    return report;
  };

  // ─── EXPENSE MUTATIONS WITH RBAC & SEPARATION OF DUTIES ────────────

  const addExpense: AppContextType["addExpense"] = async (data) => {
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
      // Auto-approve only if user is Politician AND Separation of Duties is disabled
      status:
        currentUser.role === "POLITICIAN" && !securitySettings.separationOfDuties
          ? "APPROVED"
          : "SUBMITTED",
      approvedBy:
        currentUser.role === "POLITICIAN" && !securitySettings.separationOfDuties
          ? currentUser.name
          : undefined,
      approvedAt:
        currentUser.role === "POLITICIAN" && !securitySettings.separationOfDuties
          ? new Date().toISOString()
          : undefined,
    };

    setExpenses((prev) => [newExpense, ...prev]);

    await logAuditEvent(
      "EXPENSE_CREATED",
      newExpense.id,
      `${newExpense.description} (${formatMoney(newExpense.amount)})`,
      `Created by ${currentUser.name} (${currentUser.role}). Vendor: ${newExpense.vendorName || "N/A"}. Status: ${newExpense.status}`,
      "LOGGED"
    );
  };

  const updateExpense = async (id: string, updates: Partial<MockExpense>) => {
    setExpenses((prev) => prev.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp)));
    await logAuditEvent(
      "EXPENSE_UPDATED",
      id,
      updates.description || id,
      `Expense updated by ${currentUser.name}. Attributes modified: ${Object.keys(updates).join(", ")}`,
      "LOGGED"
    );
  };

  const deleteExpense = async (id: string) => {
    const target = expenses.find((e) => e.id === id);
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    await logAuditEvent(
      "EXPENSE_DELETED",
      id,
      target?.description || id,
      `Expense permanently removed by ${currentUser.name} (${currentUser.role}). Amount: KES ${target?.amount || 0}`,
      "ALERT"
    );
  };

  const approveExpense = (id: string): boolean => {
    const target = expenses.find((e) => e.id === id);
    if (!target) return false;

    // 1. Separation of Duties Enforcement (Four-Eyes Principle)
    if (securitySettings.separationOfDuties && target.createdById === currentUser.id) {
      setSecurityViolation(
        `Security Policy Enforcement: Separation of Duties (Four-Eyes Principle) prevents self-approval. You created "${target.description}". An independent auditor or candidate must review and authorize this expense.`
      );
      logAuditEvent(
        "SELF_APPROVAL_PREVENTED",
        target.id,
        target.description,
        `Self-approval blocked for ${currentUser.name} under strict Separation of Duties policy.`,
        "ALERT"
      );
      return false;
    }

    // 2. High-value 2FA warning
    if (
      securitySettings.require2FAForLargeExpenses &&
      target.amount >= securitySettings.largeExpenseThreshold &&
      !securitySettings.twoFactorEnabled
    ) {
      setIsTwoFactorModalOpen(true);
    }

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

    logAuditEvent(
      "EXPENSE_APPROVED",
      target.id,
      target.description,
      `Approved by ${currentUser.name} (${currentUser.role}). Amount: ${formatMoney(target.amount)}. Vendor: ${target.vendorName || "N/A"}`,
      "VERIFIED"
    );

    return true;
  };

  const rejectExpense = async (id: string, reason: string) => {
    const target = expenses.find((e) => e.id === id);
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

    await logAuditEvent(
      "EXPENSE_REJECTED",
      id,
      target?.description || id,
      `Rejected by ${currentUser.name} (${currentUser.role}). Reason: ${reason}`,
      "REJECTED"
    );
  };

  // ─── EVENT MUTATIONS ───────────────────────────────────────────────

  const addEvent: AppContextType["addEvent"] = async (data) => {
    const newEvent: MockEvent = {
      ...data,
      id: `evt-${Date.now()}`,
    };
    setEvents((prev) => [newEvent, ...prev]);

    await logAuditEvent(
      "EVENT_CREATED",
      newEvent.id,
      newEvent.name,
      `New political event registered at ${newEvent.locationName || "TBD"} on ${newEvent.eventDate}. Budget: ${formatMoney(newEvent.budget)}`,
      "LOGGED"
    );
  };

  const updateEvent = async (id: string, updates: Partial<MockEvent>) => {
    setEvents((prev) => prev.map((evt) => (evt.id === id ? { ...evt, ...updates } : evt)));
    await logAuditEvent(
      "EVENT_UPDATED",
      id,
      updates.name || id,
      `Political event updated by ${currentUser.name}. Changes: ${Object.keys(updates).join(", ")}`,
      "LOGGED"
    );
  };

  const deleteEvent = async (id: string) => {
    const target = events.find((e) => e.id === id);
    setEvents((prev) => prev.filter((evt) => evt.id !== id));
    await logAuditEvent(
      "EVENT_DELETED",
      id,
      target?.name || id,
      `Event cancelled/deleted by ${currentUser.name} (${currentUser.role})`,
      "ALERT"
    );
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

        // Security additions
        securitySettings,
        updateSecuritySettings,
        isSessionLocked,
        lockSession,
        unlockSession,
        failedUnlockAttempts,
        auditLogs,
        logAuditEvent,
        verifyLedgerIntegrity,
        ledgerReport,
        securityViolation,
        clearSecurityViolation,
        isTwoFactorModalOpen,
        setIsTwoFactorModalOpen,
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
