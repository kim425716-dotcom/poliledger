// PoliLedger - Shared TypeScript Types

// ─── ROLE & STATUS TYPES ─────────────────────────────────────────────

export type Role = "POLITICIAN" | "CAMPAIGN_MANAGER" | "STAFF" | "AUDITOR" | "ADMIN";

export type EventType = "MEETING" | "RALLY" | "FUNDRAISER" | "PRESS_CONFERENCE" | "OTHER";

export type EventStatus = "PLANNED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type ExpenseStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "REIMBURSED";

export type ApprovalDecision = "APPROVED" | "REJECTED" | "NEEDS_REVISION";

// ─── DISPLAY MAPPINGS ────────────────────────────────────────────────

export const ROLE_LABELS: Record<Role, string> = {
  POLITICIAN: "Politician",
  CAMPAIGN_MANAGER: "Campaign Manager",
  STAFF: "Staff",
  AUDITOR: "Auditor / Finance Officer",
  ADMIN: "Administrator",
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  MEETING: "Meeting",
  RALLY: "Rally",
  FUNDRAISER: "Fundraiser",
  PRESS_CONFERENCE: "Press Conference",
  OTHER: "Other",
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  PLANNED: "Planned",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const EXPENSE_STATUS_LABELS: Record<ExpenseStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  REIMBURSED: "Reimbursed",
};

export const STATUS_COLORS: Record<ExpenseStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SUBMITTED: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  REIMBURSED: "bg-blue-100 text-blue-700",
};

export const EVENT_STATUS_COLORS: Record<EventStatus, string> = {
  PLANNED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-green-100 text-green-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
};

// ─── DEFAULT CATEGORIES ──────────────────────────────────────────────

export const DEFAULT_CATEGORIES = [
  { name: "Venue", icon: "🏛️", colorHex: "#3B82F6" },
  { name: "Transport", icon: "🚌", colorHex: "#10B981" },
  { name: "Catering", icon: "🍽️", colorHex: "#F59E0B" },
  { name: "Security", icon: "🛡️", colorHex: "#EF4444" },
  { name: "Media & Publicity", icon: "📰", colorHex: "#8B5CF6" },
  { name: "Accommodation", icon: "🏨", colorHex: "#EC4899" },
  { name: "Printing", icon: "🖨️", colorHex: "#06B6D4" },
  { name: "Communication", icon: "📱", colorHex: "#84CC16" },
  { name: "Miscellaneous", icon: "📁", colorHex: "#6B7280" },
] as const;

// ─── CURRENCY TYPES ──────────────────────────────────────────────────

export const SUPPORTED_CURRENCIES = [
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
] as const;

// ─── DASHBOARD TYPES ─────────────────────────────────────────────────

export interface DashboardStats {
  totalSpent: number;
  pendingApprovals: number;
  budgetUsedPercent: number;
  totalBudget: number;
  activeEvents: number;
  currency: string;
}

export interface CategorySpending {
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  totalAmount: number;
  percentage: number;
}

export interface MonthlySpending {
  month: string;
  amount: number;
}

export interface BudgetProgress {
  name: string;
  spent: number;
  limit: number;
  percentage: number;
  isOverBudget: boolean;
  isNearLimit: boolean;
}

// ─── FORM TYPES ──────────────────────────────────────────────────────

export interface ExpenseFormData {
  eventId?: string;
  categoryId: string;
  expenseDate: string;
  description: string;
  notes?: string;
  amount: number;
  currency: string;
  vendorName?: string;
  location?: string;
}

export interface EventFormData {
  name: string;
  description?: string;
  eventType: EventType;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  locationName?: string;
  locationAddress?: string;
  expectedAttendance?: number;
  status: EventStatus;
}

// ─── API RESPONSE TYPES ──────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
