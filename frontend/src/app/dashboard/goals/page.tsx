"use client";

import { FormEvent, useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api/client";
import { goalsApi } from "@/lib/api/services";
import type { Goal } from "@/types/api";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadGoals() {
    setLoading(true);
    try {
      const data = await goalsApi.list();
      setGoals(data);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Impossible de charger les objectifs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGoals();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await goalsApi.create({ title });
      setTitle("");
      await loadGoals();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Impossible de créer l'objectif");
    }
  }

  async function handleProgress(id: string, progress: number) {
    try {
      await goalsApi.updateProgress(id, progress);
      await loadGoals();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Impossible de mettre à jour");
    }
  }

  return (
    <div>
      <PageHeader title="Objectifs" description="Suivez vos objectifs de vie et votre progression" />
      {error && <Alert variant="error">{error}</Alert>}

      <div className="space-y-6">
        <Card title="Nouvel objectif">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Apprendre Next.js"
              className="flex-1"
              required
            />
            <Button type="submit">Ajouter</Button>
          </form>
        </Card>

        <Card title="Mes objectifs">
          {loading ? (
            <p className="text-sm text-slate-400">Chargement...</p>
          ) : goals.length === 0 ? (
            <p className="text-sm text-slate-400">Aucun objectif défini.</p>
          ) : (
            <ul className="space-y-4">
              {goals.map((goal) => (
                <li key={goal.id} className="rounded-lg border border-slate-800 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-medium text-white">{goal.title}</p>
                    <span className="text-sm text-emerald-400">{goal.progress}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={goal.progress}
                    onChange={(e) => handleProgress(goal.id, Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
