"use client";

import { FormEvent, useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api/client";
import { moodApi } from "@/lib/api/services";
import type { MoodEntry } from "@/types/api";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function MoodTracker() {
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
      setError(err instanceof ApiClientError ? err.message : "Impossible de charger l'historique");
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
      await loadEntries();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Impossible d'enregistrer l'entrée");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      <Card title="Comment vous sentez-vous ?" description="Score de 1 (faible) à 10 (excellent)">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="score" className="mb-2 block text-sm text-slate-300">
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
          <p className="text-sm text-slate-400">Chargement...</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-slate-400">Aucune entrée enregistrée.</p>
        ) : (
          <ul className="space-y-3">
            {entries.map((entry) => (
              <li key={entry.id} className="rounded-lg border border-slate-800 p-3">
                <p className="font-medium text-white">Score : {entry.score}/10</p>
                {entry.note && <p className="text-sm text-slate-400">{entry.note}</p>}
                <p className="mt-1 text-xs text-slate-500">
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
