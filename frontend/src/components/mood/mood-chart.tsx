"use client";

import { useMemo, useState } from "react";
import type { MoodEntry } from "@/types/api";

type RangeDays = 7 | 30;

interface MoodChartProps {
  entries: MoodEntry[];
}

function getCutoff(days: RangeDays): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function MoodChart({ entries }: MoodChartProps) {
  const [range, setRange] = useState<RangeDays>(7);

  const { points, average } = useMemo(() => {
    const cutoff = getCutoff(range);
    const filtered = entries
      .filter((e) => new Date(e.recordedAt) >= cutoff)
      .sort(
        (a, b) =>
          new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
      );

    const pts = filtered.map((e, i) => ({
      x: i,
      y: e.score,
      label: new Date(e.recordedAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      }),
    }));

    const avg =
      filtered.length > 0
        ? filtered.reduce((s, e) => s + e.score, 0) / filtered.length
        : 0;

    return { points: pts, average: Math.round(avg * 10) / 10 };
  }, [entries, range]);

  const width = 400;
  const height = 160;
  const padding = { top: 12, right: 12, bottom: 28, left: 28 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const linePath =
    points.length > 0
      ? points
          .map((p, i) => {
            const x =
              padding.left +
              (points.length === 1 ? chartW / 2 : (i / (points.length - 1)) * chartW);
            const y = padding.top + chartH - ((p.y - 1) / 9) * chartH;
            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
          })
          .join(" ")
      : "";

  const areaPath =
    points.length > 0 && linePath
      ? `${linePath} L ${padding.left + chartW} ${padding.top + chartH} L ${padding.left} ${padding.top + chartH} Z`
      : "";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm theme-muted">Moyenne sur la période</p>
          <p className="text-2xl font-bold text-emerald-400">
            {points.length > 0 ? `${average}/10` : "—"}
          </p>
        </div>
        <div className="theme-toggle-group inline-flex rounded-lg border p-1">
          {([7, 30] as RangeDays[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setRange(d)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                range === d
                  ? "bg-emerald-600 text-white"
                  : "theme-muted hover:theme-text"
              }`}
            >
              {d} jours
            </button>
          ))}
        </div>
      </div>

      {points.length === 0 ? (
        <p className="text-sm theme-muted">
          Pas assez de données sur les {range} derniers jours. Enregistrez votre humeur.
        </p>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-lg theme-chart"
          role="img"
          aria-label={`Graphique humeur sur ${range} jours`}
        >
          {[1, 5, 10].map((tick) => {
            const y = padding.top + chartH - ((tick - 1) / 9) * chartH;
            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartW}
                  y2={y}
                  className="theme-chart-grid"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 6}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-[var(--muted)] text-[10px]"
                >
                  {tick}
                </text>
              </g>
            );
          })}
          {areaPath && (
            <path d={areaPath} className="fill-emerald-500/20" stroke="none" />
          )}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {points.map((p, i) => {
            const x =
              padding.left +
              (points.length === 1 ? chartW / 2 : (i / (points.length - 1)) * chartW);
            const y = padding.top + chartH - ((p.y - 1) / 9) * chartH;
            return (
              <circle key={i} cx={x} cy={y} r="4" fill="#10b981" />
            );
          })}
        </svg>
      )}
    </div>
  );
}
