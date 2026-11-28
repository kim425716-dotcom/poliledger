"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatCards } from "@/components/dashboard/StatCards";
import { BudgetAlertBanner } from "@/components/dashboard/BudgetAlertBanner";
import { SpendingCharts } from "@/components/dashboard/SpendingCharts";
import { RecentExpenses } from "@/components/dashboard/RecentExpenses";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseFormModal } from "@/components/expenses/ExpenseFormModal";
import { ReceiptViewerModal } from "@/components/expenses/ReceiptViewerModal";
import { EventList } from "@/components/events/EventList";
import { EventDetailModal } from "@/components/events/EventDetailModal";
import { EventFormModal } from "@/components/events/EventFormModal";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { PublicTransparencyView } from "@/components/transparency/PublicTransparencyView";
import { AuditTrailView } from "@/components/audit/AuditTrailView";
import { BudgetManager } from "@/components/budgets/BudgetManager";
import { SecurityCenterView } from "@/components/security/SecurityCenterView";
import { SessionLockModal } from "@/components/security/SessionLockModal";
import { TwoFactorModal } from "@/components/security/TwoFactorModal";
import { SecurityViolationModal } from "@/components/security/SecurityViolationModal";
import { CampaignsOverviewView } from "@/components/campaigns/CampaignsOverviewView";
import { CampaignFormModal } from "@/components/campaigns/CampaignFormModal";

export default function Home() {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 transition-colors">
      {/* Top Navigation */}
      <Navbar />

      <div className="flex">
        {/* Left Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Active Tab View */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Alert Banners (Budget approaching / critical) */}
              <BudgetAlertBanner />

              {/* Metric Overview Cards */}
              <StatCards />

              {/* Spending Breakdown & Event Charts */}
              <SpendingCharts />

              {/* Latest Logged Expenses Table */}
              <RecentExpenses />
            </div>
          )}

          {activeTab === "campaigns" && <CampaignsOverviewView />}

          {activeTab === "expenses" && <ExpenseList />}

          {activeTab === "events" && <EventList />}

          {activeTab === "budgets" && <BudgetManager />}

          {activeTab === "reports" && <ReportGenerator />}

          {activeTab === "transparency" && <PublicTransparencyView />}

          {activeTab === "audit" && <AuditTrailView />}

          {activeTab === "security" && <SecurityCenterView />}
        </main>
      </div>

      {/* Global Modals */}
      <CampaignFormModal />
      <ExpenseFormModal />
      <ReceiptViewerModal />
      <EventDetailModal />
      <EventFormModal />
      <SessionLockModal />
      <TwoFactorModal />
      <SecurityViolationModal />
    </div>
  );
}
