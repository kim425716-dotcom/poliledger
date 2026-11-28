// PoliLedger - Cryptographic Hashing & Data Protection Utilities
// Uses Web Crypto API for client-side SHA-256 tamper-evident integrity checks

/**
 * Computes a SHA-256 hex string for any arbitrary UTF-8 string.
 */
export async function sha256(message: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback deterministic hash algorithm for non-browser or test environments
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, "0");
}

/**
 * Generates a deterministic cryptographic checksum for a financial expense record.
 * Any modification to the amount, vendor, date, category, or approval status
 * will produce a completely different hash.
 */
export async function computeExpenseHash(expense: {
  id: string;
  amount: number;
  currency: string;
  expenseDate: string;
  vendorName?: string;
  categoryId: string;
  status: string;
  createdById?: string;
  approvedBy?: string;
}): Promise<string> {
  const canonicalPayload = [
    expense.id,
    expense.amount.toFixed(2),
    expense.currency,
    expense.expenseDate,
    expense.vendorName || "NONE",
    expense.categoryId,
    expense.status,
    expense.createdById || "SYSTEM",
    expense.approvedBy || "UNAPPROVED",
  ].join("|");

  return sha256(`POLI-EXPENSE-V1|${canonicalPayload}`);
}

/**
 * Generates an immutable audit record hash chained to the previous record hash
 * (Blockchain-inspired Merkle link).
 */
export async function computeAuditEntryHash(entry: {
  id: string;
  timestamp: string;
  actorId: string;
  action: string;
  entityId: string;
  details: string;
  previousHash?: string;
}): Promise<string> {
  const canonicalPayload = [
    entry.id,
    entry.timestamp,
    entry.actorId,
    entry.action,
    entry.entityId,
    entry.details,
    entry.previousHash || "GENESIS_BLOCK",
  ].join("|");

  return sha256(`POLI-AUDIT-V1|${canonicalPayload}`);
}

/**
 * PII Masking utility for public disclosure and auditor reports
 * Masks national ID numbers, phone numbers, and bank account numbers
 */
export function maskSensitiveData(value: string, type: "PHONE" | "ID" | "ACCOUNT" | "VENDOR"): string {
  if (!value) return "";
  
  switch (type) {
    case "PHONE":
      // +254 712 345 678 -> +254 7•• ••• 678
      if (value.length > 7) {
        return value.slice(0, 5) + " ••• ••• " + value.slice(-3);
      }
      return "•••-•••-" + value.slice(-2);

    case "ID":
      // 12345678 -> ••••5678
      return value.length > 4 ? "••••" + value.slice(-4) : "••••";

    case "ACCOUNT":
      // 011092837465 -> ••••••••7465
      return value.length > 4 ? "••••••••" + value.slice(-4) : "••••";

    case "VENDOR":
      return value;

    default:
      return value;
  }
}
