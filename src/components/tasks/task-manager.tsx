"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api/client";
import { tasksApi } from "@/lib/api/services";
import type { Task, TaskPriority, TaskStatus } from "@/types/api";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const priorityLabels: Record<TaskPriority, string> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
};

const statusLabels: Record<TaskStatus, string> = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminée",
};

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await tasksApi.list({
        priority: filterPriority || undefined,
        status: filterStatus || undefined,
      });
      setTasks(data);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Impossible de charger les tâches");
    } finally {
      setLoading(false);
    }
  }, [filterPriority, filterStatus]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError("");
    try {
      await tasksApi.create({ title, priority });
      setTitle("");
      await loadTasks();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Impossible de créer la tâche");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(id: string, status: TaskStatus) {
    try {
      await tasksApi.update(id, { status });
      await loadTasks();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Impossible de mettre à jour la tâche");
    }
  }

  async function handleDelete(id: string) {
    try {
      await tasksApi.delete(id);
      await loadTasks();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Impossible de supprimer la tâche");
    }
  }

  return (
    <div className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      <Card title="Nouvelle tâche" description="Ajoutez une tâche avec une priorité">
        <form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row">
          <Input
            name="title"
            placeholder="Ex: Finaliser le rapport"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
          <Button type="submit" loading={submitting}>
            Ajouter
          </Button>
        </form>
      </Card>

      <Card title="Mes tâches">
        <div className="mb-4 flex flex-wrap gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          >
            <option value="">Tous les statuts</option>
            <option value="todo">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="done">Terminée</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          >
            <option value="">Toutes les priorités</option>
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Chargement...</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-slate-400">Aucune tâche pour le moment.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task, index) => (
              <li
                key={task.id}
                style={{ animationDelay: `${index * 0.06}s` }}
                className="animate-list-item flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-950/60 p-4 transition-all duration-300 hover:border-emerald-700/40 hover:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-white">{task.title}</p>
                  <p className="text-xs text-slate-500">
                    Priorité : {priorityLabels[task.priority]} · Statut : {statusLabels[task.status]}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white"
                  >
                    <option value="todo">À faire</option>
                    <option value="in_progress">En cours</option>
                    <option value="done">Terminée</option>
                  </select>
                  <Button variant="danger" onClick={() => handleDelete(task.id)}>
                    Supprimer
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
