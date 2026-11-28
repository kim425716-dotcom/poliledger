import { EventType, EventStatus, ExpenseStatus, Role } from "@/lib/types";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  title: string;
}

export interface MockCategory {
  id: string;
  name: string;
  icon: string;
  colorHex: string;
  budgetLimit: number;
}

export interface MockEvent {
  id: string;
  name: string;
  description: string;
  eventType: EventType;
  eventDate: string;
  startTime: string;
  endTime: string;
  locationName: string;
  locationAddress: string;
  expectedAttendance: number;
  actualAttendance?: number;
  budget: number;
  status: EventStatus;
}

export interface MockExpense {
  id: string;
  eventId?: string;
  eventName?: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  createdById: string;
  createdByName: string;
  createdByRole: Role;
  expenseDate: string;
  description: string;
  notes?: string;
  amount: number;
  currency: string;
  vendorName?: string;
  location?: string;
  status: ExpenseStatus;
  receiptName?: string;
  receiptUrl?: string;
  receiptSize?: string;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface MockBudgetAlert {
  id: string;
  type: "CATEGORY" | "EVENT";
  targetId: string;
  targetName: string;
  spent: number;
  limit: number;
  percentage: number;
  threshold: number;
  severity: "WARNING" | "CRITICAL";
  message: string;
}

// ─── USERS WITH DIFFERENT ROLES ──────────────────────────────────────

export const MOCK_USERS: MockUser[] = [
  {
    id: "usr-1",
    name: "Hon. Jane Muthoni",
    email: "jane.muthoni@campaign2026.ke",
    role: "POLITICIAN",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    title: "Senatorial Candidate & Account Owner",
  },
  {
    id: "usr-2",
    name: "David Ochieng",
    email: "david.o@campaign2026.ke",
    role: "CAMPAIGN_MANAGER",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    title: "Campaign Operations Director",
  },
  {
    id: "usr-3",
    name: "Amina Hassan",
    email: "amina.h@campaign2026.ke",
    role: "STAFF",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "Field Logistics & Event Coordinator",
  },
  {
    id: "usr-4",
    name: "Patrick Mwangi, CPA",
    email: "patrick.mwangi@auditfinance.co.ke",
    role: "AUDITOR",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    title: "Independent Finance & Compliance Officer",
  },
  {
    id: "usr-5",
    name: "Admin User",
    email: "admin@poliledger.ke",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    title: "System Administrator",
  },
];

// ─── CATEGORIES & BUDGET ALLOCATIONS ────────────────────────────────

export const MOCK_CATEGORIES: MockCategory[] = [
  { id: "cat-1", name: "Venue", icon: "🏛️", colorHex: "#3B82F6", budgetLimit: 1200000 },
  { id: "cat-2", name: "Transport", icon: "🚌", colorHex: "#10B981", budgetLimit: 950000 },
  { id: "cat-3", name: "Catering", icon: "🍽️", colorHex: "#F59E0B", budgetLimit: 750000 },
  { id: "cat-4", name: "Security", icon: "🛡️", colorHex: "#EF4444", budgetLimit: 600000 },
  { id: "cat-5", name: "Media & Publicity", icon: "📰", colorHex: "#8B5CF6", budgetLimit: 850000 },
  { id: "cat-6", name: "Accommodation", icon: "🏨", colorHex: "#EC4899", budgetLimit: 400000 },
  { id: "cat-7", name: "Printing & Signage", icon: "🖨️", colorHex: "#06B6D4", budgetLimit: 500000 },
  { id: "cat-8", name: "Communication", icon: "📱", colorHex: "#84CC16", budgetLimit: 300000 },
  { id: "cat-9", name: "Miscellaneous", icon: "📁", colorHex: "#6B7280", budgetLimit: 250000 },
];

// ─── EVENTS (MEETINGS, RALLIES, PUBLIC EVENTS) ──────────────────────

export const MOCK_EVENTS: MockEvent[] = [
  {
    id: "evt-1",
    name: "Nairobi Town Hall & Youth Mega Rally",
    description: "Grand public gathering focusing on youth employment, tech innovation hubs, and urban policy reform.",
    eventType: "RALLY",
    eventDate: "2026-11-28",
    startTime: "09:00",
    endTime: "16:00",
    locationName: "Kenyatta International Convention Centre (KICC) Grounds",
    locationAddress: "Harambee Avenue, City Square, Nairobi",
    expectedAttendance: 6500,
    actualAttendance: 7200,
    budget: 1500000,
    status: "CONFIRMED",
  },
  {
    id: "evt-2",
    name: "Business Leaders & Private Sector Round-Table",
    description: "Closed-door breakfast consultation with Kenya National Chamber of Commerce members on small enterprise taxation.",
    eventType: "MEETING",
    eventDate: "2026-11-22",
    startTime: "07:30",
    endTime: "11:00",
    locationName: "Villa Rosa Kempinski Ballroom",
    locationAddress: "Chiromo Road, Westlands, Nairobi",
    expectedAttendance: 120,
    actualAttendance: 115,
    budget: 450000,
    status: "COMPLETED",
  },
  {
    id: "evt-3",
    name: "Kibera Community Listening Tour & Health Camp",
    description: "Grassroots mobilization, maternal healthcare forum, and voter civic sensitization session.",
    eventType: "RALLY",
    eventDate: "2026-12-05",
    startTime: "10:00",
    endTime: "17:00",
    locationName: "Kamukunji Grounds, Kibera",
    locationAddress: "Olympic Estate Road, Kibera, Nairobi",
    expectedAttendance: 4500,
    budget: 850000,
    status: "IN_PROGRESS",
  },
  {
    id: "evt-4",
    name: "Campaign Manifesto Official Media Launch",
    description: "Televised press conference unveiling the 5-point legislative manifesto for Nairobi County development.",
    eventType: "PRESS_CONFERENCE",
    eventDate: "2026-12-12",
    startTime: "11:00",
    endTime: "13:30",
    locationName: "Nairobi Serena Hotel Hibiscus Room",
    locationAddress: "Processional Way, Central Park, Nairobi",
    expectedAttendance: 180,
    budget: 650000,
    status: "PLANNED",
  },
];

// ─── DETAILED EXPENSES WITH RECEIPTS & STATUSES ──────────────────────

export const MOCK_EXPENSES: MockExpense[] = [
  {
    id: "exp-1",
    eventId: "evt-1",
    eventName: "Nairobi Town Hall & Youth Mega Rally",
    categoryId: "cat-1",
    categoryName: "Venue",
    categoryIcon: "🏛️",
    categoryColor: "#3B82F6",
    createdById: "usr-3",
    createdByName: "Amina Hassan",
    createdByRole: "STAFF",
    expenseDate: "2026-11-18",
    description: "KICC Grounds hire deposit and main podium electrical rigging",
    notes: "Official receipt #KICC-2026-904. Includes stage structural setup and power generator backup fuel.",
    amount: 380000,
    currency: "KES",
    vendorName: "Kenyatta International Convention Centre Corporation",
    location: "Nairobi CBD",
    status: "APPROVED",
    receiptName: "kicc_venue_receipt_904.pdf",
    receiptUrl: "/receipts/sample-invoice.png",
    receiptSize: "1.4 MB",
    approvedBy: "Patrick Mwangi, CPA",
    approvedAt: "2026-11-19T14:30:00Z",
    createdAt: "2026-11-18T10:15:00Z",
  },
  {
    id: "exp-2",
    eventId: "evt-1",
    eventName: "Nairobi Town Hall & Youth Mega Rally",
    categoryId: "cat-2",
    categoryName: "Transport",
    categoryIcon: "🚌",
    categoryColor: "#10B981",
    createdById: "usr-2",
    createdByName: "David Ochieng",
    createdByRole: "CAMPAIGN_MANAGER",
    expenseDate: "2026-11-19",
    description: "Chartered coach transport for 12 sub-county volunteer delegate teams",
    notes: "Contract covering 8 50-seater buses with licensed drivers and fuel allowances.",
    amount: 280000,
    currency: "KES",
    vendorName: "Eastgate Express Coach Services Ltd",
    location: "Industrial Area, Nairobi",
    status: "APPROVED",
    receiptName: "eastgate_coaches_contract.pdf",
    receiptUrl: "/receipts/sample-invoice.png",
    receiptSize: "850 KB",
    approvedBy: "Hon. Jane Muthoni",
    approvedAt: "2026-11-20T09:10:00Z",
    createdAt: "2026-11-19T16:20:00Z",
  },
  {
    id: "exp-3",
    eventId: "evt-1",
    eventName: "Nairobi Town Hall & Youth Mega Rally",
    categoryId: "cat-4",
    categoryName: "Security",
    categoryIcon: "🛡️",
    categoryColor: "#EF4444",
    createdById: "usr-3",
    createdByName: "Amina Hassan",
    createdByRole: "STAFF",
    expenseDate: "2026-11-20",
    description: "Private crowd safety marshals and perimeter security protocol",
    notes: "45 uniformed stewards and accredited event crowd control personnel.",
    amount: 220000,
    currency: "KES",
    vendorName: "ShieldForce Protective Services",
    location: "KICC Grounds",
    status: "APPROVED",
    receiptName: "shieldforce_steward_invoice.pdf",
    receiptUrl: "/receipts/sample-invoice.png",
    receiptSize: "620 KB",
    approvedBy: "Patrick Mwangi, CPA",
    approvedAt: "2026-11-20T17:45:00Z",
    createdAt: "2026-11-20T11:00:00Z",
  },
  {
    id: "exp-4",
    eventId: "evt-1",
    eventName: "Nairobi Town Hall & Youth Mega Rally",
    categoryId: "cat-5",
    categoryName: "Media & Publicity",
    categoryIcon: "📰",
    categoryColor: "#8B5CF6",
    createdById: "usr-2",
    createdByName: "David Ochieng",
    createdByRole: "CAMPAIGN_MANAGER",
    expenseDate: "2026-11-20",
    description: "Digital livestream OB Van equipment, 4K cameras, and public address sound system",
    notes: "Line array speaker towers for 10,000 capacity coverage and multi-platform streaming feed.",
    amount: 350000,
    currency: "KES",
    vendorName: "SoundCraft Media & Event Audio Ltd",
    location: "Nairobi",
    status: "SUBMITTED",
    receiptName: "soundcraft_obvan_quote.pdf",
    receiptUrl: "/receipts/sample-invoice.png",
    receiptSize: "2.1 MB",
    createdAt: "2026-11-20T18:00:00Z",
  },
  {
    id: "exp-5",
    eventId: "evt-2",
    eventName: "Business Leaders & Private Sector Round-Table",
    categoryId: "cat-3",
    categoryName: "Catering",
    categoryIcon: "🍽️",
    categoryColor: "#F59E0B",
    createdById: "usr-3",
    createdByName: "Amina Hassan",
    createdByRole: "STAFF",
    expenseDate: "2026-11-21",
    description: "Executive breakfast buffet and beverage service for 120 guests",
    notes: "Includes continental breakfast menu, audiovisual projection screen, and stationery packets.",
    amount: 310000,
    currency: "KES",
    vendorName: "Villa Rosa Kempinski Nairobi",
    location: "Westlands, Nairobi",
    status: "APPROVED",
    receiptName: "kempinski_breakfast_banquet.pdf",
    receiptUrl: "/receipts/sample-invoice.png",
    receiptSize: "1.1 MB",
    approvedBy: "Patrick Mwangi, CPA",
    approvedAt: "2026-11-21T16:00:00Z",
    createdAt: "2026-11-21T12:00:00Z",
  },
  {
    id: "exp-6",
    eventId: "evt-2",
    eventName: "Business Leaders & Private Sector Round-Table",
    categoryId: "cat-7",
    categoryName: "Printing & Signage",
    categoryIcon: "🖨️",
    categoryColor: "#06B6D4",
    createdById: "usr-3",
    createdByName: "Amina Hassan",
    createdByRole: "STAFF",
    expenseDate: "2026-11-21",
    description: "Economic policy executive summaries, delegate folders, and name tags",
    notes: "150 embossed folders containing the 20-page Economic Revitalization Paper.",
    amount: 95000,
    currency: "KES",
    vendorName: "PrintMax Color Solutions Ltd",
    location: "Nairobi CBD",
    status: "APPROVED",
    receiptName: "printmax_folders_delivery.pdf",
    receiptUrl: "/receipts/sample-invoice.png",
    receiptSize: "780 KB",
    approvedBy: "Hon. Jane Muthoni",
    approvedAt: "2026-11-21T18:30:00Z",
    createdAt: "2026-11-21T14:15:00Z",
  },
  {
    id: "exp-7",
    eventId: "evt-3",
    eventName: "Kibera Community Listening Tour & Health Camp",
    categoryId: "cat-2",
    categoryName: "Transport",
    categoryIcon: "🚌",
    categoryColor: "#10B981",
    createdById: "usr-2",
    createdByName: "David Ochieng",
    createdByRole: "CAMPAIGN_MANAGER",
    expenseDate: "2026-11-19",
    description: "Mobilization vans, PA announcement trucks, and logistical fuel vouchers",
    notes: "3 branded roadshow trucks operating across Kibera wards for 3 days preceding the event.",
    amount: 195000,
    currency: "KES",
    vendorName: "Metro Fleet Rentals",
    location: "Nairobi South",
    status: "SUBMITTED",
    receiptName: "metrofleet_invoice_1092.pdf",
    receiptUrl: "/receipts/sample-invoice.png",
    receiptSize: "920 KB",
    createdAt: "2026-11-20T10:00:00Z",
  },
  {
    id: "exp-8",
    eventId: "evt-3",
    eventName: "Kibera Community Listening Tour & Health Camp",
    categoryId: "cat-3",
    categoryName: "Catering",
    categoryIcon: "🍽️",
    categoryColor: "#F59E0B",
    createdById: "usr-3",
    createdByName: "Amina Hassan",
    createdByRole: "STAFF",
    expenseDate: "2026-11-20",
    description: "Bottled mineral water cartons (200 cases) and volunteer lunch meals",
    notes: "Drinking water distribution for attendees and volunteers during the health outreach camp.",
    amount: 140000,
    currency: "KES",
    vendorName: "Highland Springs Water & Local Women Caterers Guild",
    location: "Kibera, Nairobi",
    status: "SUBMITTED",
    receiptName: "kibera_catering_vouchers.pdf",
    receiptUrl: "/receipts/sample-invoice.png",
    receiptSize: "1.6 MB",
    createdAt: "2026-11-20T15:30:00Z",
  },
  {
    id: "exp-9",
    eventId: "evt-1",
    eventName: "Nairobi Town Hall & Youth Mega Rally",
    categoryId: "cat-7",
    categoryName: "Printing & Signage",
    categoryIcon: "🖨️",
    categoryColor: "#06B6D4",
    createdById: "usr-3",
    createdByName: "Amina Hassan",
    createdByRole: "STAFF",
    expenseDate: "2026-11-17",
    description: "Stage backdrops (12m x 4m PVC), branded teardrop flags, and podium banners",
    notes: "Flame-retardant vinyl print with heavy duty eyelets for outdoor windy conditions.",
    amount: 165000,
    currency: "KES",
    vendorName: "SignCraft Outdoor Advertising",
    location: "Road A, Industrial Area",
    status: "APPROVED",
    receiptName: "signcraft_stage_banner.pdf",
    receiptUrl: "/receipts/sample-invoice.png",
    receiptSize: "2.4 MB",
    approvedBy: "Patrick Mwangi, CPA",
    approvedAt: "2026-11-18T11:00:00Z",
    createdAt: "2026-11-17T16:00:00Z",
  },
  {
    id: "exp-10",
    categoryId: "cat-8",
    categoryName: "Communication",
    categoryIcon: "📱",
    categoryColor: "#84CC16",
    createdById: "usr-2",
    createdByName: "David Ochieng",
    createdByRole: "CAMPAIGN_MANAGER",
    expenseDate: "2026-11-16",
    description: "Bulk SMS broadcast campaign (150,000 registered voters - Nairobi Central)",
    notes: "Invitation broadcast for the KICC youth rally and voter registration verification hotline info.",
    amount: 120000,
    currency: "KES",
    vendorName: "Africa's Talking Telecommunications",
    location: "Nairobi",
    status: "APPROVED",
    receiptName: "africastalking_sms_statement.pdf",
    receiptUrl: "/receipts/sample-invoice.png",
    receiptSize: "450 KB",
    approvedBy: "Hon. Jane Muthoni",
    approvedAt: "2026-11-17T08:30:00Z",
    createdAt: "2026-11-16T19:00:00Z",
  },
  {
    id: "exp-11",
    categoryId: "cat-9",
    categoryName: "Miscellaneous",
    categoryIcon: "📁",
    categoryColor: "#6B7280",
    createdById: "usr-3",
    createdByName: "Amina Hassan",
    createdByRole: "STAFF",
    expenseDate: "2026-11-19",
    description: "Emergency medical standby tent supplies and First Aid kit replenishment",
    notes: "Purchased from St. John Ambulance certified provider for rally standby unit.",
    amount: 45000,
    currency: "KES",
    vendorName: "MedEquip Supplies Kenya",
    location: "Upper Hill, Nairobi",
    status: "DRAFT",
    createdAt: "2026-11-19T14:00:00Z",
  },
  {
    id: "exp-12",
    eventId: "evt-4",
    eventName: "Campaign Manifesto Official Media Launch",
    categoryId: "cat-1",
    categoryName: "Venue",
    categoryIcon: "🏛️",
    categoryColor: "#3B82F6",
    createdById: "usr-2",
    createdByName: "David Ochieng",
    createdByRole: "CAMPAIGN_MANAGER",
    expenseDate: "2026-11-15",
    description: "Hotel ballroom reservation and media press gallery stage setup",
    amount: 250000,
    currency: "KES",
    vendorName: "Nairobi Serena Hotel",
    location: "Central Park, Nairobi",
    status: "APPROVED",
    receiptName: "serena_hotel_deposit.pdf",
    receiptUrl: "/receipts/sample-invoice.png",
    receiptSize: "1.2 MB",
    approvedBy: "Patrick Mwangi, CPA",
    approvedAt: "2026-11-16T10:00:00Z",
    createdAt: "2026-11-15T11:00:00Z",
  },
  {
    id: "exp-13",
    categoryId: "cat-2",
    categoryName: "Transport",
    categoryIcon: "🚌",
    categoryColor: "#10B981",
    createdById: "usr-3",
    createdByName: "Amina Hassan",
    createdByRole: "STAFF",
    expenseDate: "2026-11-14",
    description: "VIP security chase car rental (Unscheduled out of town trip)",
    notes: "Submitted without prior procurement pre-approval form attached.",
    amount: 110000,
    currency: "KES",
    vendorName: "Apex Executive Motors",
    location: "Nairobi",
    status: "REJECTED",
    rejectionReason: "Procurement pre-approval authorization form missing. Unscheduled movement without Campaign Director signature.",
    createdAt: "2026-11-14T15:00:00Z",
  },
];

// ─── INITIAL IMMUTABLE AUDIT LOGS ────────────────────────────────────

export const MOCK_AUDIT_LOGS = [
  {
    id: "aud-001",
    timestamp: "2026-11-21T10:15:00Z",
    actorId: "usr-4",
    actorName: "Patrick Mwangi, CPA",
    actorRole: "AUDITOR" as const,
    action: "EXPENSE_APPROVED",
    entityId: "exp-1",
    entityName: "KICC Grounds hire deposit (KES 380,000)",
    details: "Official invoice verified against KICC rate card and event permit #NBI-2026-119.",
    ipAddress: "197.232.88.42 (Nairobi, KE)",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    status: "VERIFIED" as const,
  },
  {
    id: "aud-002",
    timestamp: "2026-11-20T17:45:00Z",
    actorId: "usr-1",
    actorName: "Hon. Jane Muthoni",
    actorRole: "POLITICIAN" as const,
    action: "EXPENSE_APPROVED",
    entityId: "exp-2",
    entityName: "Eastgate Express Chartered Buses (KES 280,000)",
    details: "Delegate transportation authorization signed by campaign candidate.",
    ipAddress: "105.160.44.19 (Safaricom LTE, KE)",
    hash: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    status: "VERIFIED" as const,
  },
  {
    id: "aud-003",
    timestamp: "2026-11-20T11:00:00Z",
    actorId: "usr-3",
    actorName: "Amina Hassan",
    actorRole: "STAFF" as const,
    action: "EXPENSE_SUBMITTED",
    entityId: "exp-4",
    entityName: "Private Crowd Marshals & Security (KES 220,000)",
    details: "Receipt voucher and 45-person muster roll uploaded by logistics staff.",
    ipAddress: "197.232.89.15 (Nairobi, KE)",
    hash: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    status: "LOGGED" as const,
  },
  {
    id: "aud-004",
    timestamp: "2026-11-19T14:30:00Z",
    actorId: "sys-0",
    actorName: "Automated Compliance Sentinel",
    actorRole: "SYSTEM" as const,
    action: "BUDGET_WARNING_TRIGGERED",
    entityId: "cat-1",
    entityName: "Venue Category Limit (88% consumed)",
    details: "Automated alert dispatched to Campaign Manager and Finance Officer.",
    ipAddress: "127.0.0.1 (Internal Worker)",
    hash: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    status: "ALERT" as const,
  },
  {
    id: "aud-005",
    timestamp: "2026-11-14T15:00:00Z",
    actorId: "usr-4",
    actorName: "Patrick Mwangi, CPA",
    actorRole: "AUDITOR" as const,
    action: "EXPENSE_REJECTED",
    entityId: "exp-13",
    entityName: "VIP Security Chase Car Rental (KES 110,000)",
    details: "Procurement pre-approval missing. Rejection reason and audit flag recorded.",
    ipAddress: "197.232.88.42 (Nairobi, KE)",
    hash: "7d793037a0760186574b0282f2f435e7b1e516b9cfd6fbc479703273f8454b2f",
    status: "REJECTED" as const,
  },
];

