"use client";

import { FormEvent, useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api/client";
import { moodApi } from "@/lib/api/services";
import { useToast } from "@/contexts/toast-context";
import type { MoodEntry } from "@/types/api";
import { MoodChart } from "@/components/mood/mood-chart";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function MoodTracker() {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [score, setScore] = useState(7);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadEntries() {
    setLoading(true);
    try {
      const data = await moodApi.list();
      setEntries(data);
    } catch (err) {
      const msg =
        err instanceof ApiClientError ? err.message : "Impossible de charger l'historique";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEntries();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await moodApi.create({ score, note: note || undefined });
      setNote("");
      showToast("Humeur enregistrée", "success");
      await loadEntries();
    } catch (err) {
      const msg =
        err instanceof ApiClientError ? err.message : "Impossible d'enregistrer l'entrée";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      <Card title="Évolution de l'humeur" description="Courbe sur 7 ou 30 jours">
        {loading ? (
          <p className="text-sm theme-muted">Chargement du graphique...</p>
        ) : (
          <MoodChart entries={entries} />
        )}
      </Card>

      <Card title="Comment vous sentez-vous ?" description="Score de 1 (faible) à 10 (excellent)">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="score" className="mb-2 block text-sm theme-text">
              Score : {score}/10
            </label>
            <input
              id="score"
              type="range"
              min={1}
              max={10}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
          <Input
            label="Note (optionnelle)"
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Bonne journée, bien concentré..."
          />
          <Button type="submit" loading={submitting}>
            Enregistrer
          </Button>
        </form>
      </Card>

      <Card title="Historique">
        {loading ? (
          <p className="text-sm theme-muted">Chargement...</p>
        ) : entries.length === 0 ? (
          <p className="text-sm theme-muted">Aucune entrée enregistrée.</p>
        ) : (
          <ul className="space-y-3">
            {entries.map((entry) => (
              <li key={entry.id} className="theme-list-item rounded-lg border p-3">
                <p className="font-medium theme-text">Score : {entry.score}/10</p>
                {entry.note && <p className="text-sm theme-muted">{entry.note}</p>}
                <p className="mt-1 text-xs theme-muted">
                  {new Date(entry.recordedAt).toLocaleString("fr-FR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
