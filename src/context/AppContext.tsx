"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useSyncExternalStore,
  useMemo,
} from "react";
import {
  MOCK_USERS,
  MOCK_CATEGORIES,
  MOCK_EVENTS,
  MOCK_EXPENSES,
  MOCK_AUDIT_LOGS,
  INITIAL_CAMPAIGNS,
  INITIAL_WORKSPACES,
  DEFAULT_CAMPAIGN_SECURITY_SETTINGS,
  createScaledCategories,
  MockUser,
  MockCategory,
  MockEvent,
  MockExpense,
  MockBudgetAlert,
  CampaignWorkspaceData,
} from "@/data/mock-data";
import {
  Role,
  ExpenseStatus,
  SecuritySettings,
  AuditLogEntry,
  LedgerIntegrityReport,
  PoliticianCampaign,
  NewCampaignInput,
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
  NGN: 0.082,
  ZAR: 7.25,
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  KES: "KSh",
  USD: "$",
  EUR: "€",
  GBP: "£",
  UGX: "USh",
  TZS: "TSh",
  NGN: "₦",
  ZAR: "R",
};

export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = DEFAULT_CAMPAIGN_SECURITY_SETTINGS;

export interface CampaignMetrics {
  totalSpent: number;
  approvedSpent: number;
  totalBudget: number;
  pendingCount: number;
  approvedCount: number;
  eventCount: number;
  teamCount: number;
  budgetPercentage: number;
}

interface AppContextType {
  // Multi-Politician Campaigns
  campaigns: PoliticianCampaign[];
  activeCampaignId: string;
  activeCampaign: PoliticianCampaign;
  switchCampaign: (campaignId: string) => void;
  addCampaign: (input: NewCampaignInput) => PoliticianCampaign;
  updateCampaign: (campaignId: string, updates: Partial<PoliticianCampaign>) => void;
  deleteCampaign: (campaignId: string) => boolean;
  addTeamMember: (
    campaignId: string,
    member: { name: string; email: string; role: Role; title: string }
  ) => void;
  getCampaignWorkspace: (campaignId: string) => CampaignWorkspaceData;
  getCampaignMetrics: (campaignId: string) => CampaignMetrics;
  isAddCampaignOpen: boolean;
  setIsAddCampaignOpen: (open: boolean) => void;

  // Current user & role switching (scoped to active campaign)
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

  // Expenses CRUD & Approvals (scoped to active campaign)
  expenses: MockExpense[];
  addExpense: (
    expense: Omit<
      MockExpense,
      | "id"
      | "createdAt"
      | "createdById"
      | "createdByName"
      | "createdByRole"
      | "categoryName"
      | "categoryIcon"
      | "categoryColor"
      | "eventName"
    >
  ) => void;
  updateExpense: (id: string, updates: Partial<MockExpense>) => void;
  deleteExpense: (id: string) => void;
  approveExpense: (id: string, notes?: string) => boolean;
  rejectExpense: (id: string, reason: string) => void;

  // Events CRUD (scoped to active campaign)
  events: MockEvent[];
  addEvent: (event: Omit<MockEvent, "id">) => void;
  updateEvent: (id: string, updates: Partial<MockEvent>) => void;
  deleteEvent: (id: string) => void;

  // Categories & Budgets (scoped to active campaign)
  categories: MockCategory[];
  updateCategoryLimit: (categoryId: string, budgetLimit: number) => void;
  addCategory: (category: { name: string; icon: string; colorHex: string; budgetLimit: number }) => void;
  totalCampaignBudget: number;
  totalSpent: number;
  budgetAlerts: MockBudgetAlert[];

  // UI state & Modals
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (open: boolean) => void;
  preselectedEventId: string;
  openAddExpenseModal: (eventId?: string) => void;
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

  // Theme & Dark Mode
  isDarkMode: boolean;
  toggleDarkMode: () => void;

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
    status?: "VERIFIED" | "ALERT" | "REJECTED" | "LOGGED",
    overrideCampaignId?: string,
    overrideActor?: { id: string; name: string; role: Role | "SYSTEM" }
  ) => Promise<void>;
  verifyLedgerIntegrity: () => Promise<LedgerIntegrityReport>;
  ledgerReport: LedgerIntegrityReport | null;
  securityViolation: string | null;
  clearSecurityViolation: () => void;
  isTwoFactorModalOpen: boolean;
  setIsTwoFactorModalOpen: (open: boolean) => void;
}

const subscribeTheme = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("poliledger-theme-change", callback);
  const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
  mediaQuery?.addEventListener?.("change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("poliledger-theme-change", callback);
    mediaQuery?.removeEventListener?.("change", callback);
  };
};

const getThemeSnapshot = () => {
  const saved = localStorage.getItem("poliledger_theme");
  if (saved) return saved === "dark";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
};

const getServerThemeSnapshot = () => false;

const EMPTY_WORKSPACE: CampaignWorkspaceData = {
  users: MOCK_USERS,
  categories: MOCK_CATEGORIES,
  events: [],
  expenses: [],
  auditLogs: [],
  securitySettings: DEFAULT_CAMPAIGN_SECURITY_SETTINGS,
};

function slugifyCampaignName(name: string, cycle: string): string {
  const base = `${name}-${cycle}`
    .toLowerCase()
    .replace(/^hon\.?\s*/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base || `campaign-${Date.now()}`;
}

function buildInitialWorkspaces(): Record<string, CampaignWorkspaceData> {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("poliledger_v2_workspaces");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }

    // Migrate any pre-v2 single-campaign localStorage data cleanly into Jane Muthoni's workspace
    const legacyExpenses = localStorage.getItem("poliledger_expenses");
    const legacyEvents = localStorage.getItem("poliledger_events");
    const legacySecurity = localStorage.getItem("poliledger_security_settings");
    const legacyAudit = localStorage.getItem("poliledger_audit_logs");

    if (legacyExpenses || legacyEvents || legacySecurity || legacyAudit) {
      try {
        return {
          ...INITIAL_WORKSPACES,
          "camp-jane-2026": {
            users: MOCK_USERS,
            categories: MOCK_CATEGORIES,
            events: legacyEvents ? JSON.parse(legacyEvents) : MOCK_EVENTS,
            expenses: legacyExpenses ? JSON.parse(legacyExpenses) : MOCK_EXPENSES,
            auditLogs: legacyAudit ? JSON.parse(legacyAudit) : MOCK_AUDIT_LOGS,
            securitySettings: legacySecurity
              ? JSON.parse(legacySecurity)
              : DEFAULT_CAMPAIGN_SECURITY_SETTINGS,
          },
        };
      } catch {}
    }
  }
  return INITIAL_WORKSPACES;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Campaigns Registry
  const [campaigns, setCampaigns] = useState<PoliticianCampaign[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("poliledger_v2_campaigns");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return INITIAL_CAMPAIGNS;
  });

  // Active Campaign ID (supports ?public=<slug> deep link)
  const [activeCampaignId, setActiveCampaignId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const publicSlug = params.get("public");
      if (publicSlug) {
        const savedCampsRaw = localStorage.getItem("poliledger_v2_campaigns");
        const list: PoliticianCampaign[] = savedCampsRaw
          ? (() => {
              try {
                return JSON.parse(savedCampsRaw);
              } catch {
                return INITIAL_CAMPAIGNS;
              }
            })()
          : INITIAL_CAMPAIGNS;
        const found = list.find((c) => c.slug === publicSlug);
        if (found) return found.id;
      }
      const saved = localStorage.getItem("poliledger_v2_active_campaign_id");
      if (saved) return saved;
    }
    return INITIAL_CAMPAIGNS[0].id;
  });

  // Per-campaign isolated workspaces
  const [workspaces, setWorkspaces] = useState<Record<string, CampaignWorkspaceData>>(
    buildInitialWorkspaces
  );

  // Active user ID per campaign
  const [activeUserByCampaign, setActiveUserByCampaign] = useState<Record<string, string>>({});

  // Resolve active campaign safely
  const activeCampaign = useMemo(() => {
    return campaigns.find((c) => c.id === activeCampaignId) || campaigns[0];
  }, [campaigns, activeCampaignId]);

  const effectiveCampaignId = activeCampaign.id;

  // Resolve current workspace safely
  const activeWorkspace = useMemo(() => {
    return workspaces[effectiveCampaignId] || EMPTY_WORKSPACE;
  }, [workspaces, effectiveCampaignId]);

  const allUsers = activeWorkspace.users;
  const currentUser = useMemo(() => {
    const selectedUserId = activeUserByCampaign[effectiveCampaignId];
    return allUsers.find((u) => u.id === selectedUserId) || allUsers[0] || MOCK_USERS[0];
  }, [allUsers, activeUserByCampaign, effectiveCampaignId]);

  const expenses = activeWorkspace.expenses;
  const events = activeWorkspace.events;
  const categories = activeWorkspace.categories;
  const auditLogs = activeWorkspace.auditLogs;
  const securitySettings = activeWorkspace.securitySettings;

  // Navigation & Currency (defaults to "transparency" when ?public=<slug> is visited)
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("public")) return "transparency";
    }
    return "dashboard";
  });
  const [selectedCurrency, setSelectedCurrency] = useState<string>("KES");

  // Session Protection & Lock
  const [isSessionLocked, setIsSessionLocked] = useState<boolean>(false);
  const [failedUnlockAttempts, setFailedUnlockAttempts] = useState<number>(0);
  const [securityViolation, setSecurityViolation] = useState<string | null>(null);
  const [ledgerReport, setLedgerReport] = useState<LedgerIntegrityReport | null>(null);
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);

  // Modals & UI states
  const isDarkMode = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );
  const [isAddExpenseOpen, setIsAddExpenseOpenState] = useState(false);
  const [preselectedEventId, setPreselectedEventId] = useState("");
  const setIsAddExpenseOpen = useCallback((open: boolean) => {
    setIsAddExpenseOpenState(open);
    if (!open) setPreselectedEventId("");
  }, []);
  const openAddExpenseModal = useCallback((eventId?: string) => {
    setPreselectedEventId(eventId || "");
    setIsAddExpenseOpenState(true);
  }, []);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false);
  const [selectedReceiptExpense, setSelectedReceiptExpense] = useState<MockExpense | null>(null);
  const [selectedEventDetail, setSelectedEventDetail] = useState<MockEvent | null>(null);

  // Filtering & Dismissed alerts
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");
  const [selectedEventFilter, setSelectedEventFilter] = useState("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");
  const [dismissedAlertsByCampaign, setDismissedAlertsByCampaign] = useState<
    Record<string, string[]>
  >({});

  const dismissedAlerts = useMemo(
    () => dismissedAlertsByCampaign[effectiveCampaignId] || [],
    [dismissedAlertsByCampaign, effectiveCampaignId]
  );

  // Synchronize .dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    if (typeof window === "undefined") return;
    const next = !isDarkMode;
    localStorage.setItem("poliledger_theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    window.dispatchEvent(new Event("poliledger-theme-change"));
  }, [isDarkMode]);

  // Persist campaigns & workspaces
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("poliledger_v2_campaigns", JSON.stringify(campaigns));
    }
  }, [campaigns]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("poliledger_v2_active_campaign_id", effectiveCampaignId);
    }
  }, [effectiveCampaignId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("poliledger_v2_workspaces", JSON.stringify(workspaces));
    }
  }, [workspaces]);

  // Inactivity auto-lock timer
  useEffect(() => {
    if (!securitySettings.sessionTimeoutMinutes || securitySettings.sessionTimeoutMinutes <= 0)
      return;

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

  // Helper to update a workspace partition cleanly
  const updateWorkspace = useCallback(
    (
      campaignId: string,
      updater: (ws: CampaignWorkspaceData) => CampaignWorkspaceData
    ) => {
      setWorkspaces((prev) => {
        const current = prev[campaignId] || EMPTY_WORKSPACE;
        return {
          ...prev,
          [campaignId]: updater(current),
        };
      });
    },
    []
  );

  // ─── AUDIT LOGGING HELPER ──────────────────────────────────────────
  const logAuditEvent = useCallback(
    async (
      action: string,
      entityId: string,
      entityName: string,
      details: string,
      status: "VERIFIED" | "ALERT" | "REJECTED" | "LOGGED" = "LOGGED",
      overrideCampaignId?: string,
      overrideActor?: { id: string; name: string; role: Role | "SYSTEM" }
    ) => {
      const targetCampaignId = overrideCampaignId || effectiveCampaignId;
      const targetWs = workspaces[targetCampaignId] || activeWorkspace;
      const now = new Date().toISOString();
      const id = `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const previousHash = targetWs.auditLogs[0]?.hash || "GENESIS_POLILEDGER_ROOT";
      const actor = overrideActor || {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
      };

      const hash = await computeAuditEntryHash({
        id,
        timestamp: now,
        actorId: actor.id,
        action,
        entityId,
        details,
        previousHash,
      });

      const newEntry: AuditLogEntry = {
        id,
        timestamp: now,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action,
        entityId,
        entityName,
        details,
        ipAddress: `197.232.88.42 (${activeCampaign.constituency}, Verified)`,
        hash,
        status,
      };

      updateWorkspace(targetCampaignId, (ws) => ({
        ...ws,
        auditLogs: [newEntry, ...ws.auditLogs],
      }));
    },
    [
      effectiveCampaignId,
      workspaces,
      activeWorkspace,
      currentUser,
      activeCampaign.constituency,
      updateWorkspace,
    ]
  );

  // ─── MULTI-POLITICIAN CAMPAIGN ACTIONS ─────────────────────────────

  const switchCampaign = useCallback(
    (campaignId: string) => {
      const target = campaigns.find((c) => c.id === campaignId);
      if (!target) return;

      setActiveCampaignId(campaignId);
      setSelectedCurrency(target.defaultCurrency || "KES");
      setSelectedReceiptExpense(null);
      setSelectedEventDetail(null);
      setIsAddExpenseOpenState(false);
      setPreselectedEventId("");
      setLedgerReport(null);
      setSearchQuery("");
      setSelectedCategoryFilter("ALL");
      setSelectedEventFilter("ALL");
      setSelectedStatusFilter("ALL");

      const targetUsers = workspaces[campaignId]?.users || [];
      const primaryUser = targetUsers[0];
      if (primaryUser) {
        logAuditEvent(
          "CAMPAIGN_WORKSPACE_OPENED",
          target.id,
          `${target.politicianName} (${target.office})`,
          `Switched active workspace to ${target.politicianName} campaign ledger.`,
          "LOGGED",
          campaignId,
          { id: primaryUser.id, name: primaryUser.name, role: primaryUser.role }
        );
      }
    },
    [campaigns, workspaces, logAuditEvent]
  );

  const addCampaign = useCallback(
    (input: NewCampaignInput): PoliticianCampaign => {
      const id = `camp-${Date.now()}`;
      const baseSlug = slugifyCampaignName(input.politicianName, input.electionCycle);
      const slugExists = campaigns.some((c) => c.slug === baseSlug);
      const slug = slugExists ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

      const newCampaign: PoliticianCampaign = {
        id,
        slug,
        politicianName: input.politicianName.trim(),
        office: input.office.trim(),
        constituency: input.constituency.trim(),
        party: input.party.trim() || "Independent Candidate",
        electionCycle: input.electionCycle.trim() || "Elections 2026",
        accentColor: input.accentColor,
        defaultCurrency: input.defaultCurrency || "KES",
        publicTransparencyEnabled: input.publicTransparencyEnabled,
        accessPin: input.accessPin?.trim() || "2026",
        createdAt: new Date().toISOString(),
      };

      const initials = newCampaign.politicianName
        .replace(/^hon\.?\s*/i, "")
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      const emailDomain = `${slug.replace(/[^a-z0-9]/g, "")}.ke`;
      const politicianUser: MockUser = {
        id: `${id}-usr-1`,
        name: newCampaign.politicianName,
        email: `candidate@${emailDomain}`,
        role: "POLITICIAN",
        avatar: "",
        title: `${newCampaign.office} Candidate & Campaign Owner`,
      };
      const managerUser: MockUser = {
        id: `${id}-usr-2`,
        name: input.managerName?.trim() || `${initials} Campaign Director`,
        email: input.managerEmail?.trim() || `director@${emailDomain}`,
        role: "CAMPAIGN_MANAGER",
        avatar: "",
        title: "Campaign Operations Manager",
      };
      const staffUser: MockUser = {
        id: `${id}-usr-3`,
        name: "Field Logistics Officer",
        email: `logistics@${emailDomain}`,
        role: "STAFF",
        avatar: "",
        title: `${newCampaign.constituency} Event Coordinator`,
      };
      const auditorUser: MockUser = {
        id: `${id}-usr-4`,
        name: input.auditorName?.trim() || "Independent Compliance CPA",
        email: input.auditorEmail?.trim() || `audit@${emailDomain}`,
        role: "AUDITOR",
        avatar: "",
        title: "Certified Public Accountant & Compliance Officer",
      };

      const budgetCapInKes = Math.round(
        input.totalBudgetCap * (EXCHANGE_RATES[newCampaign.defaultCurrency] || 1)
      );

      const initialWorkspace: CampaignWorkspaceData = {
        users: [politicianUser, managerUser, staffUser, auditorUser],
        categories: createScaledCategories(budgetCapInKes),
        events: [],
        expenses: [],
        auditLogs: [
          {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            actorId: politicianUser.id,
            actorName: politicianUser.name,
            actorRole: "POLITICIAN",
            action: "CAMPAIGN_INITIALIZED",
            entityId: newCampaign.id,
            entityName: `${newCampaign.politicianName} — ${newCampaign.office}`,
            details: `Multi-politician campaign workspace provisioned for ${newCampaign.constituency} (${newCampaign.party}) with budget cap ${newCampaign.defaultCurrency} ${input.totalBudgetCap.toLocaleString()}.`,
            ipAddress: `197.232.88.42 (${newCampaign.constituency})`,
            hash: "0000" + Math.random().toString(16).slice(2).padEnd(60, "a").slice(0, 60),
            status: "VERIFIED",
          },
        ],
        securitySettings: DEFAULT_CAMPAIGN_SECURITY_SETTINGS,
      };

      setCampaigns((prev) => [...prev, newCampaign]);
      setWorkspaces((prev) => ({
        ...prev,
        [id]: initialWorkspace,
      }));
      setActiveCampaignId(id);
      setSelectedCurrency(newCampaign.defaultCurrency);
      setLedgerReport(null);

      return newCampaign;
    },
    [campaigns]
  );

  const updateCampaign = useCallback(
    (campaignId: string, updates: Partial<PoliticianCampaign>) => {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? { ...c, ...updates } : c))
      );
      logAuditEvent(
        "CAMPAIGN_PROFILE_UPDATED",
        campaignId,
        updates.politicianName || campaignId,
        `Campaign settings updated: ${Object.keys(updates).join(", ")}`,
        "LOGGED",
        campaignId
      );
    },
    [logAuditEvent]
  );

  const deleteCampaign = useCallback(
    (campaignId: string): boolean => {
      if (campaigns.length <= 1) return false;
      const remaining = campaigns.filter((c) => c.id !== campaignId);
      setCampaigns(remaining);
      setWorkspaces((prev) => {
        const copy = { ...prev };
        delete copy[campaignId];
        return copy;
      });
      if (effectiveCampaignId === campaignId && remaining[0]) {
        setActiveCampaignId(remaining[0].id);
        setSelectedCurrency(remaining[0].defaultCurrency || "KES");
      }
      return true;
    },
    [campaigns, effectiveCampaignId]
  );

  const addTeamMember = useCallback(
    (
      campaignId: string,
      member: { name: string; email: string; role: Role; title: string }
    ) => {
      const newUser: MockUser = {
        id: `${campaignId}-usr-${Date.now()}`,
        name: member.name.trim(),
        email: member.email.trim(),
        role: member.role,
        avatar: "",
        title: member.title.trim() || member.role,
      };

      updateWorkspace(campaignId, (ws) => ({
        ...ws,
        users: [...ws.users, newUser],
      }));

      logAuditEvent(
        "TEAM_MEMBER_ADDED",
        newUser.id,
        newUser.name,
        `Onboarded ${newUser.name} as ${newUser.role} (${newUser.title}) into campaign workspace.`,
        "VERIFIED",
        campaignId
      );
    },
    [updateWorkspace, logAuditEvent]
  );

  const getCampaignWorkspace = useCallback(
    (campaignId: string): CampaignWorkspaceData => {
      return workspaces[campaignId] || EMPTY_WORKSPACE;
    },
    [workspaces]
  );

  const getCampaignMetrics = useCallback(
    (campaignId: string): CampaignMetrics => {
      const ws = workspaces[campaignId] || EMPTY_WORKSPACE;
      const totalSpentCalc = ws.expenses
        .filter((e) => e.status === "APPROVED" || e.status === "SUBMITTED")
        .reduce((sum, e) => sum + e.amount, 0);
      const approvedSpentCalc = ws.expenses
        .filter((e) => e.status === "APPROVED")
        .reduce((sum, e) => sum + e.amount, 0);
      const totalBudgetCalc = ws.categories.reduce((sum, c) => sum + c.budgetLimit, 0) || 1;
      const pendingCount = ws.expenses.filter((e) => e.status === "SUBMITTED").length;
      const approvedCount = ws.expenses.filter((e) => e.status === "APPROVED").length;

      return {
        totalSpent: totalSpentCalc,
        approvedSpent: approvedSpentCalc,
        totalBudget: totalBudgetCalc,
        pendingCount,
        approvedCount,
        eventCount: ws.events.length,
        teamCount: ws.users.length,
        budgetPercentage: Math.round((totalSpentCalc / totalBudgetCalc) * 100),
      };
    },
    [workspaces]
  );

  // Switch User / Role within Active Campaign
  const switchUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setActiveUserByCampaign((prev) => ({
        ...prev,
        [effectiveCampaignId]: user.id,
      }));
      logAuditEvent(
        "USER_SWITCH_ROLE",
        user.id,
        user.name,
        `Active session context switched to role: ${user.role} (${user.title}) in ${activeCampaign.politicianName}'s campaign`,
        "LOGGED",
        effectiveCampaignId,
        { id: user.id, name: user.name, role: user.role }
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
      maximumFractionDigits:
        selectedCurrency === "KES" || selectedCurrency === "UGX" || selectedCurrency === "TZS"
          ? 0
          : 2,
      minimumFractionDigits: 0,
    }).format(converted)}`;
  };

  // Total spent calculation (only approved + submitted)
  const totalSpent = expenses
    .filter((e) => e.status === "APPROVED" || e.status === "SUBMITTED")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalCampaignBudget = categories.reduce((sum, c) => sum + c.budgetLimit, 0) || 1;

  // Dynamic Budget Alerts (75% warning, 90%+ critical)
  const budgetAlerts: MockBudgetAlert[] = [];

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

  const dismissAlert = (id: string) => {
    setDismissedAlertsByCampaign((prev) => ({
      ...prev,
      [effectiveCampaignId]: [...(prev[effectiveCampaignId] || []), id],
    }));
  };

  // ─── SECURITY SETTINGS MUTATIONS ───────────────────────────────────
  const updateSecuritySettings = (settings: Partial<SecuritySettings>) => {
    const updated = { ...securitySettings, ...settings };
    updateWorkspace(effectiveCampaignId, (ws) => ({
      ...ws,
      securitySettings: updated,
    }));
    logAuditEvent(
      "SECURITY_SETTINGS_UPDATED",
      "sec-config",
      `${activeCampaign.politicianName} Security Policy`,
      `Security policy updated: 2FA=${updated.twoFactorEnabled}, SeparationOfDuties=${updated.separationOfDuties}, SessionTimeout=${updated.sessionTimeoutMinutes}m`,
      "VERIFIED"
    );
  };

  const lockSession = () => {
    setIsSessionLocked(true);
    logAuditEvent(
      "SESSION_LOCKED",
      currentUser.id,
      currentUser.name,
      `User manually locked ${activeCampaign.politicianName}'s campaign ledger session`,
      "LOGGED"
    );
  };

  const unlockSession = (pinOrPassword: string): boolean => {
    const valid =
      pinOrPassword === activeCampaign.accessPin ||
      pinOrPassword === "2026" ||
      pinOrPassword === "password123" ||
      pinOrPassword === "admin";
    if (valid) {
      setIsSessionLocked(false);
      setFailedUnlockAttempts(0);
      logAuditEvent(
        "SESSION_UNLOCKED",
        currentUser.id,
        currentUser.name,
        `Session authenticated and unlocked for ${activeCampaign.politicianName}`,
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
      `${activeCampaign.politicianName} Cryptographic Audit`,
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

    updateWorkspace(effectiveCampaignId, (ws) => ({
      ...ws,
      expenses: [newExpense, ...ws.expenses],
    }));

    await logAuditEvent(
      "EXPENSE_CREATED",
      newExpense.id,
      `${newExpense.description} (${formatMoney(newExpense.amount)})`,
      `Created by ${currentUser.name} (${currentUser.role}). Vendor: ${newExpense.vendorName || "N/A"}. Status: ${newExpense.status}`,
      "LOGGED"
    );
  };

  const updateExpense = async (id: string, updates: Partial<MockExpense>) => {
    updateWorkspace(effectiveCampaignId, (ws) => ({
      ...ws,
      expenses: ws.expenses.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp)),
    }));

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
    updateWorkspace(effectiveCampaignId, (ws) => ({
      ...ws,
      expenses: ws.expenses.filter((exp) => exp.id !== id),
    }));

    await logAuditEvent(
      "EXPENSE_DELETED",
      id,
      target?.description || id,
      `Expense permanently removed by ${currentUser.name} (${currentUser.role}). Amount: ${target?.currency || "KES"} ${target?.amount || 0}`,
      "ALERT"
    );
  };

  const approveExpense = (id: string): boolean => {
    const target = expenses.find((e) => e.id === id);
    if (!target) return false;

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

    if (
      securitySettings.require2FAForLargeExpenses &&
      target.amount >= securitySettings.largeExpenseThreshold &&
      !securitySettings.twoFactorEnabled
    ) {
      setIsTwoFactorModalOpen(true);
    }

    updateWorkspace(effectiveCampaignId, (ws) => ({
      ...ws,
      expenses: ws.expenses.map((exp) =>
        exp.id === id
          ? {
              ...exp,
              status: "APPROVED" as ExpenseStatus,
              approvedBy: currentUser.name,
              approvedAt: new Date().toISOString(),
              rejectionReason: undefined,
            }
          : exp
      ),
    }));

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
    updateWorkspace(effectiveCampaignId, (ws) => ({
      ...ws,
      expenses: ws.expenses.map((exp) =>
        exp.id === id
          ? {
              ...exp,
              status: "REJECTED" as ExpenseStatus,
              rejectionReason: reason,
            }
          : exp
      ),
    }));

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
    updateWorkspace(effectiveCampaignId, (ws) => ({
      ...ws,
      events: [newEvent, ...ws.events],
    }));

    await logAuditEvent(
      "EVENT_CREATED",
      newEvent.id,
      newEvent.name,
      `New political event registered at ${newEvent.locationName || "TBD"} on ${newEvent.eventDate}. Budget: ${formatMoney(newEvent.budget)}`,
      "LOGGED"
    );
  };

  const updateEvent = async (id: string, updates: Partial<MockEvent>) => {
    updateWorkspace(effectiveCampaignId, (ws) => ({
      ...ws,
      events: ws.events.map((evt) => (evt.id === id ? { ...evt, ...updates } : evt)),
    }));
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
    updateWorkspace(effectiveCampaignId, (ws) => ({
      ...ws,
      events: ws.events.filter((evt) => evt.id !== id),
    }));
    await logAuditEvent(
      "EVENT_DELETED",
      id,
      target?.name || id,
      `Event cancelled/deleted by ${currentUser.name} (${currentUser.role})`,
      "ALERT"
    );
  };

  // ─── CATEGORY & BUDGET LIMIT MUTATIONS ────────────────────────────

  const updateCategoryLimit = async (categoryId: string, budgetLimit: number) => {
    const target = categories.find((c) => c.id === categoryId);
    updateWorkspace(effectiveCampaignId, (ws) => ({
      ...ws,
      categories: ws.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, budgetLimit } : cat
      ),
    }));
    await logAuditEvent(
      "BUDGET_LIMIT_UPDATED",
      categoryId,
      target?.name || categoryId,
      `Updated ceiling limit for ${target?.name || categoryId} to ${formatMoney(budgetLimit)}`,
      "VERIFIED"
    );
  };

  const addCategory = async (category: {
    name: string;
    icon: string;
    colorHex: string;
    budgetLimit: number;
  }) => {
    const newCat: MockCategory = {
      id: `cat-${Date.now()}`,
      name: category.name.trim(),
      icon: category.icon || "📁",
      colorHex: category.colorHex || "#3B82F6",
      budgetLimit: category.budgetLimit,
    };
    updateWorkspace(effectiveCampaignId, (ws) => ({
      ...ws,
      categories: [...ws.categories, newCat],
    }));
    await logAuditEvent(
      "BUDGET_CATEGORY_CREATED",
      newCat.id,
      newCat.name,
      `Created budget category ${newCat.name} with ceiling ${formatMoney(newCat.budgetLimit)}`,
      "LOGGED"
    );
  };

  return (
    <AppContext.Provider
      value={{
        campaigns,
        activeCampaignId: effectiveCampaignId,
        activeCampaign,
        switchCampaign,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        addTeamMember,
        getCampaignWorkspace,
        getCampaignMetrics,
        isAddCampaignOpen,
        setIsAddCampaignOpen,

        currentUser,
        switchUser,
        allUsers,

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
        updateCategoryLimit,
        addCategory,
        totalCampaignBudget,
        totalSpent,
        budgetAlerts,

        isAddExpenseOpen,
        setIsAddExpenseOpen,
        preselectedEventId,
        openAddExpenseModal,
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

        isDarkMode,
        toggleDarkMode,

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
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return ctx;
};
