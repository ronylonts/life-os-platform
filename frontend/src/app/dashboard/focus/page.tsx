"use client";

import { FormEvent, useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api/client";
import { focusApi } from "@/lib/api/services";
import type { FocusSession } from "@/types/api";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function FocusPage() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadSessions() {
    setLoading(true);
    try {
      const data = await focusApi.list();
      setSessions(data);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Impossible de charger les sessions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSessions();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await focusApi.create({ durationMinutes });
      await loadSessions();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Impossible d'enregistrer la session");
    }
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <div>
      <PageHeader title="Focus" description="Enregistrez vos sessions de concentration" />
      {error && <Alert variant="error">{error}</Alert>}

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card title="Sessions" className="!p-4">
          <p className="text-3xl font-bold text-emerald-400">{sessions.length}</p>
        </Card>
        <Card title="Minutes totales" className="!p-4">
          <p className="text-3xl font-bold text-sky-400">{totalMinutes}</p>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Enregistrer une session">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input
              label="Durée (minutes)"
              type="number"
              min={1}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              required
            />
            <div className="flex items-end">
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </Card>

        <Card title="Historique">
          {loading ? (
            <p className="text-sm text-slate-400">Chargement...</p>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-slate-400">Aucune session enregistrée.</p>
          ) : (
            <ul className="space-y-3">
              {sessions.map((session) => (
                <li key={session.id} className="rounded-lg border border-slate-800 p-3 text-sm text-slate-300">
                  {session.durationMinutes} min —{" "}
                  {new Date(session.completedAt).toLocaleString("fr-FR")}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
