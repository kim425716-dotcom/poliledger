import { CampaignAccentColor } from "./types";

export interface AccentStyleSet {
  badge: string;
  gradient: string;
  ring: string;
  progress: string;
  softBg: string;
  text: string;
  swatch: string;
}

const ACCENT_MAP: Record<CampaignAccentColor, AccentStyleSet> = {
  blue: {
    badge:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800/60",
    gradient: "from-blue-600 to-indigo-600",
    ring: "ring-blue-500/40",
    progress: "bg-blue-600",
    softBg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-400",
    swatch: "bg-blue-600",
  },
  emerald: {
    badge:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/60",
    gradient: "from-emerald-600 to-teal-600",
    ring: "ring-emerald-500/40",
    progress: "bg-emerald-600",
    softBg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    swatch: "bg-emerald-600",
  },
  purple: {
    badge:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800/60",
    gradient: "from-purple-600 to-fuchsia-600",
    ring: "ring-purple-500/40",
    progress: "bg-purple-600",
    softBg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-700 dark:text-purple-400",
    swatch: "bg-purple-600",
  },
  amber: {
    badge:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/60",
    gradient: "from-amber-500 to-orange-600",
    ring: "ring-amber-500/40",
    progress: "bg-amber-500",
    softBg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-400",
    swatch: "bg-amber-500",
  },
  rose: {
    badge:
      "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/60",
    gradient: "from-rose-600 to-pink-600",
    ring: "ring-rose-500/40",
    progress: "bg-rose-600",
    softBg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-400",
    swatch: "bg-rose-600",
  },
};

export function getCampaignAccentClasses(color: CampaignAccentColor): AccentStyleSet {
  return ACCENT_MAP[color] || ACCENT_MAP.blue;
}

export function getNameInitials(fullName: string): string {
  const cleaned = fullName.replace(/^hon\.?\s*/i, "").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "PL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
