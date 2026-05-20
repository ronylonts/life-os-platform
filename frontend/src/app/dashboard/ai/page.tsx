"use client";

import { useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api/client";
import { aiApi } from "@/lib/api/services";
import type { AiSuggestion, WeeklyReport } from "@/types/api";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AiPage() {
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [error, setError] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    aiApi
      .suggestions()
      .then(setSuggestions)
      .catch(() => setSuggestions([]));
  }, []);

  async function loadReport() {
    setLoadingReport(true);
    setError("");
    try {
      const data = await aiApi.weeklyReport();
      setReport(data);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Impossible de générer le rapport");
    } finally {
      setLoadingReport(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Intelligence artificielle"
        description="Suggestions et rapports hebdomadaires personnalisés"
      />
      {error && <Alert variant="error">{error}</Alert>}

      <div className="space-y-6">
        <Card title="Suggestions du jour">
          {suggestions.length === 0 ? (
            <p className="text-sm text-slate-400">
              Les suggestions apparaîtront ici une fois le backend IA connecté.
            </p>
          ) : (
            <ul className="space-y-3">
              {suggestions.map((s) => (
                <li key={s.id} className="rounded-lg border border-slate-800 p-3">
                  <span className="text-xs uppercase text-emerald-400">{s.type}</span>
                  <p className="mt-1 text-sm text-slate-300">{s.content}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Rapport hebdomadaire">
          <Button onClick={loadReport} loading={loadingReport} className="mb-4">
            Générer le rapport
          </Button>
          {report && (
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <p className="whitespace-pre-wrap text-sm text-slate-300">{report.report}</p>
              <p className="mt-3 text-xs text-slate-500">
                Généré le {new Date(report.generatedAt).toLocaleString("fr-FR")}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
