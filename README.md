# 🏛️ PoliLedger

> **Political Expense Tracking, Meeting & Rally Auditing, and Campaign Finance Transparency System**

PoliLedger is an enterprise-grade web application designed for politicians, campaign managers, staff, auditors, and oversight bodies to track, manage, verify, and publicly report campaign-related expenditures for rallies, political meetings, and grassroots operations.

---

## 🌟 Key Features

### 1. Multi-Stakeholder Role-Based Access (RBAC)
- **Politician (Account Principal):** Complete visibility over campaign spending, high-level approvals, budget ceiling controls.
- **Campaign Manager / Staff:** Log operational expenditures, schedule rallies, link expenses to specific meetings, and attach digital invoices/receipts.
- **Auditor / Finance Officer:** Independent compliance verification, review vouchers, and approve or reject claims with recorded audit notes.
- **Admin:** System settings, category limits, and access governance.

### 2. Event & Rally Management
- Schedule and categorize political events: **Public Rallies**, **Closed-Door Meetings**, **Press Conferences**, and **Fundraisers**.
- Track expected attendance vs. actual crowds.
- Allocate dedicated event budgets with automated calculation of cost-per-attendee and budget exhaustion.
- Drill down into itemized expenditures tied specifically to individual rallies.

### 3. Expense Tracking & Receipt Verification
- Detailed logging: Date, Category (Venue, Transport, Catering, Security, Media, etc.), Description, Amount, Vendor, and Town/Location.
- Digital document upload (receipts, contracts, invoices) with an interactive verification canvas.
- Multi-currency view with real-time conversion: **KES (Kenyan Shillings)**, **USD**, **EUR**, and **GBP**.
- Real-time budget warning banners triggered automatically at **75%** and **90%** of category/event limits.

### 4. Regulatory Reporting & Public Transparency
- **Formal Audit Statements:** Pre-formatted reports compliant with election commission standards with digital signature blocks.
- **1-Click Export:** Download full itemized logs in **CSV / Excel** or trigger **PDF print generation**.
- **Public Transparency Portal:** A shareable, read-only URL showing certified expenditures to constituents, journalists, and oversight institutions while safeguarding private staff communications.
- **Immutable Audit Trail:** Append-only cryptographic activity log recording every creation, approval, rejection, and alert.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **ORM & Database:** [Prisma 6](https://www.prisma.io/) + PostgreSQL
- **Icons:** [Lucide React](https://lucide.dev/)
- **Validation:** [Zod](https://zod.dev/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/kim425716-dotcom/poliledger.git
cd poliledger

# 2. Install dependencies
npm install

# 3. Generate Prisma client
npx prisma generate

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Data Privacy

- **Immutable Audit Logging:** Financial records are append-only; soft deletes are enforced.
- **Separation of Duties:** Submitting staff cannot approve their own expense claims.
- **Data Minimization:** Public transparency views strip vendor contact information, attendee PII, and internal notes.

---

## 📄 License

MIT License. Developed for political transparency and campaign accountability.
