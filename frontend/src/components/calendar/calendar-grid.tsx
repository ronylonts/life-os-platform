"use client";

import { useMemo, useState } from "react";
import type { Event } from "@/types/api";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Monday = 0 */
function mondayBasedWeekday(date: Date): number {
  return (date.getDay() + 6) % 7;
}

interface CalendarGridProps {
  events: Event[];
  onSelectDay?: (date: Date) => void;
}

export function CalendarGrid({ events, onSelectDay }: CalendarGridProps) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));

  const { cells, monthLabel } = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const leading = mondayBasedWeekday(first);
    const totalDays = daysInMonth(year, month);
    const cells: { date: Date | null; key: string }[] = [];

    for (let i = 0; i < leading; i++) {
      cells.push({ date: null, key: `empty-${i}` });
    }
    for (let d = 1; d <= totalDays; d++) {
      cells.push({ date: new Date(year, month, d), key: `day-${d}` });
    }

    const label = cursor.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });

    return { cells, monthLabel: label };
  }, [cursor]);

  function eventsForDay(date: Date): Event[] {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return events.filter((ev) => {
      const start = new Date(ev.startAt);
      return start >= dayStart && start <= dayEnd;
    });
  }

  function prevMonth() {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  }

  const today = new Date();
  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="theme-nav-btn rounded-lg px-3 py-1 text-sm"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold capitalize theme-text">{monthLabel}</h3>
        <button
          type="button"
          onClick={nextMonth}
          className="theme-nav-btn rounded-lg px-3 py-1 text-sm"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium theme-muted">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          if (!cell.date) {
            return <div key={cell.key} className="min-h-[72px]" />;
          }

          const dayEvents = eventsForDay(cell.date);

          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => onSelectDay?.(cell.date!)}
              className={`theme-calendar-day min-h-[72px] rounded-lg border p-1 text-left transition hover:border-emerald-600/50 ${
                isToday(cell.date) ? "border-emerald-500 ring-1 ring-emerald-500/40" : ""
              }`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  isToday(cell.date) ? "bg-emerald-600 text-white" : "theme-muted"
                }`}
              >
                {cell.date.getDate()}
              </span>
              <ul className="mt-1 space-y-0.5">
                {dayEvents.slice(0, 2).map((ev) => (
                  <li
                    key={ev.id}
                    className="truncate rounded bg-emerald-600/25 px-1 text-[9px] text-emerald-200"
                    title={ev.title}
                  >
                    {ev.title}
                  </li>
                ))}
                {dayEvents.length > 2 && (
                  <li className="text-[9px] theme-muted">+{dayEvents.length - 2}</li>
                )}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}
