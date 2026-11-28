"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";
import {
  CalendarDays,
  Plus,
  Users,
  MapPin,
  ChevronRight,
} from "lucide-react";

export const EventList = () => {
  const {
    events,
    expenses,
    setIsAddEventOpen,
    setSelectedEventDetail,
    formatMoney,
    currentUser,
  } = useApp();

  const [filterType, setFilterType] = useState<string>("ALL");

  const canCreate = currentUser.role === "POLITICIAN" || currentUser.role === "CAMPAIGN_MANAGER" || currentUser.role === "ADMIN";

  const filteredEvents = events.filter((e) => {
    if (filterType === "ALL") return true;
    return e.eventType === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Political Events &amp; Rallies</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Track budgets, expected attendance, and itemized expenses per political activity
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canCreate && (
            <button
              type="button"
              onClick={() => setIsAddEventOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Schedule Event / Rally</span>
            </button>
          )}
        </div>
      </div>

      {/* Type Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {["ALL", "RALLY", "MEETING", "PRESS_CONFERENCE", "FUNDRAISER", "OTHER"].map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setFilterType(t)}
            className={`rounded-lg px-3 py-1.5 font-semibold transition-colors whitespace-nowrap ${
              filterType === t
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {t === "ALL" ? "All Events" : t.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filteredEvents.map((evt) => {
          // Calculate event spending
          const eventExpenses = expenses.filter(
            (e) => e.eventId === evt.id && (e.status === "APPROVED" || e.status === "SUBMITTED")
          );
          const totalSpent = eventExpenses.reduce((sum, e) => sum + e.amount, 0);
          const percentage = Math.round((totalSpent / evt.budget) * 100);
          const isOver = percentage > 100;
          const isNear = percentage >= 75 && percentage <= 100;

          return (
            <div
              key={evt.id}
              className="flex flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs hover:shadow-md transition-all"
            >
              <div>
                {/* Status & Type */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      evt.eventType === "RALLY"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300"
                        : evt.eventType === "MEETING"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                    }`}
                  >
                    {evt.eventType}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      evt.status === "CONFIRMED"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                        : evt.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300"
                        : evt.status === "COMPLETED"
                        ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{evt.name}</h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{evt.description}</p>

                {/* Details list */}
                <div className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
                    <span>{formatDate(evt.eventDate)} ({evt.startTime} - {evt.endTime})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
                    <span className="truncate">{evt.locationName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
                    <span>
                      Expected: <strong>{evt.expectedAttendance?.toLocaleString()}</strong> attendees
                      {evt.actualAttendance && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold"> • Actual: {evt.actualAttendance.toLocaleString()}</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Budget Progress & Linked Expenses */}
              <div className="mt-5 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-500 dark:text-gray-400">Budget Consumed:</span>
                    <span className={isOver ? "text-rose-600 dark:text-rose-400" : isNear ? "text-amber-600 dark:text-amber-400" : "text-gray-900 dark:text-white"}>
                      {formatMoney(totalSpent)} / {formatMoney(evt.budget)} ({percentage}%)
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver ? "bg-rose-500" : isNear ? "bg-amber-500" : "bg-blue-600"
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>{eventExpenses.length}</strong> linked expenditures
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedEventDetail(evt)}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <span>View Breakdown</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-10 text-center text-xs text-gray-500 dark:text-gray-400">
            No {filterType === "ALL" ? "" : filterType.toLowerCase().replace("_", " ")} events scheduled yet. Click &ldquo;Schedule Event / Rally&rdquo; to add one.
          </div>
        )}
      </div>
    </div>
  );
};
