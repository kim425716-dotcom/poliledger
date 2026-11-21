import { z } from "zod";

// ─── AUTH VALIDATIONS ────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── WORKSPACE VALIDATIONS ──────────────────────────────────────────

export const workspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters"),
  description: z.string().optional(),
  currencyDefault: z.string().default("KES"),
});

// ─── EVENT VALIDATIONS ──────────────────────────────────────────────

export const eventSchema = z.object({
  name: z.string().min(2, "Event name is required"),
  description: z.string().optional(),
  eventType: z.enum(["MEETING", "RALLY", "FUNDRAISER", "PRESS_CONFERENCE", "OTHER"]),
  eventDate: z.string().min(1, "Event date is required"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  locationName: z.string().optional(),
  locationAddress: z.string().optional(),
  expectedAttendance: z.coerce.number().int().positive().optional(),
  status: z.enum(["PLANNED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("PLANNED"),
});

// ─── EXPENSE VALIDATIONS ────────────────────────────────────────────

export const expenseSchema = z.object({
  eventId: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  expenseDate: z.string().min(1, "Date is required"),
  description: z.string().min(2, "Description is required"),
  notes: z.string().optional(),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  currency: z.string().default("KES"),
  vendorName: z.string().optional(),
  location: z.string().optional(),
});

// ─── BUDGET VALIDATIONS ─────────────────────────────────────────────

export const budgetSchema = z.object({
  eventId: z.string().optional(),
  categoryId: z.string().optional(),
  limitAmount: z.coerce.number().positive("Budget limit must be greater than 0"),
  currency: z.string().default("KES"),
  alertThresholdPct: z.coerce.number().min(0).max(100).default(75),
});

// ─── APPROVAL VALIDATIONS ───────────────────────────────────────────

export const approvalSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED", "NEEDS_REVISION"]),
  comment: z.string().optional(),
});

// ─── TYPE EXPORTS ────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type WorkspaceInput = z.infer<typeof workspaceSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type ExpenseInput = z.infer<typeof expenseSchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;
export type ApprovalInput = z.infer<typeof approvalSchema>;
