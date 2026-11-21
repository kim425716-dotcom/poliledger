import { db } from "./db";
import { compare, hash } from "bcryptjs";
import type { Role } from "./types";

// ─── PASSWORD HELPERS ────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

// ─── SESSION USER TYPE ──────────────────────────────────────────────

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  workspaceId?: string;
  role?: Role;
}

// ─── AUTH HELPERS ────────────────────────────────────────────────────

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email },
    include: {
      workspaces: {
        include: {
          workspace: true,
        },
      },
    },
  });
}

export async function getUserWorkspaceRole(userId: string, workspaceId: string): Promise<Role | null> {
  const membership = await db.userWorkspace.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
  return (membership?.role as Role) ?? null;
}

// ─── ROLE PERMISSION CHECKS ─────────────────────────────────────────

const ROLE_HIERARCHY: Record<Role, number> = {
  ADMIN: 100,
  POLITICIAN: 80,
  CAMPAIGN_MANAGER: 60,
  STAFF: 40,
  AUDITOR: 30,
};

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canCreateExpense(role: Role): boolean {
  return ["ADMIN", "POLITICIAN", "CAMPAIGN_MANAGER", "STAFF"].includes(role);
}

export function canApproveExpense(role: Role): boolean {
  return ["ADMIN", "POLITICIAN", "AUDITOR"].includes(role);
}

export function canEditExpense(role: Role): boolean {
  return ["ADMIN", "POLITICIAN", "CAMPAIGN_MANAGER", "STAFF"].includes(role);
}

export function canManageEvents(role: Role): boolean {
  return ["ADMIN", "POLITICIAN", "CAMPAIGN_MANAGER"].includes(role);
}

export function canManageTeam(role: Role): boolean {
  return ["ADMIN", "POLITICIAN"].includes(role);
}

export function canViewReports(role: Role): boolean {
  return ["ADMIN", "POLITICIAN", "AUDITOR", "CAMPAIGN_MANAGER"].includes(role);
}

export function canManageSettings(role: Role): boolean {
  return ["ADMIN", "POLITICIAN"].includes(role);
}
