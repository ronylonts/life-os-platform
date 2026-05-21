"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api/client";
import { tasksApi } from "@/lib/api/services";
import { useToast } from "@/contexts/toast-context";
import type { Task, TaskPriority, TaskStatus } from "@/types/api";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ViewToggle, type ViewMode } from "@/components/ui/view-toggle";
import { TaskKanban } from "@/components/tasks/task-kanban";

const STORAGE_VIEW_KEY = "life_os_tasks_view";

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
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_VIEW_KEY) as ViewMode | null;
    if (saved === "list" || saved === "kanban") {
      setViewMode(saved);
    }
  }, []);

  function handleViewChange(mode: ViewMode) {
    setViewMode(mode);
    localStorage.setItem(STORAGE_VIEW_KEY, mode);
  }

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
      const msg =
        err instanceof ApiClientError ? err.message : "Impossible de charger les tâches";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [filterPriority, filterStatus, showToast]);

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
      showToast("Tâche créée", "success");
      await loadTasks();
    } catch (err) {
      const msg =
        err instanceof ApiClientError ? err.message : "Impossible de créer la tâche";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(id: string, status: TaskStatus) {
    const previous = tasks.find((t) => t.id === id);
    if (previous?.status === status) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t)),
    );

    try {
      await tasksApi.update(id, { status });
      showToast("Statut mis à jour", "success");
    } catch (err) {
      await loadTasks();
      const msg =
        err instanceof ApiClientError ? err.message : "Impossible de mettre à jour";
      showToast(msg, "error");
    }
  }

  async function handleDelete(id: string) {
    try {
      await tasksApi.delete(id);
      showToast("Tâche supprimée", "success");
      await loadTasks();
    } catch (err) {
      const msg =
        err instanceof ApiClientError ? err.message : "Impossible de supprimer";
      showToast(msg, "error");
    }
  }

  function handleDropOnColumn(status: TaskStatus) {
    if (draggingId) {
      handleStatusChange(draggingId, status);
      setDraggingId(null);
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
            className="theme-input rounded-lg border px-3 py-2 text-sm"
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

      <Card
        title="Mes tâches"
        description={
          viewMode === "kanban"
            ? "Glissez les cartes entre les colonnes"
            : "Liste de toutes vos tâches"
        }
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <ViewToggle
            value={viewMode}
            onChange={handleViewChange}
            modes={[
              { id: "kanban", label: "Kanban" },
              { id: "list", label: "Liste" },
            ]}
          />
          <div className="flex flex-wrap gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="theme-input rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Tous les statuts</option>
              <option value="todo">À faire</option>
              <option value="in_progress">En cours</option>
              <option value="done">Terminée</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="theme-input rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Toutes les priorités</option>
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-sm theme-muted">Chargement...</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm theme-muted">Aucune tâche pour le moment.</p>
        ) : viewMode === "kanban" ? (
          <TaskKanban
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            draggingId={draggingId}
            onDragStart={setDraggingId}
            onDragEnd={() => setDraggingId(null)}
            onDropOnColumn={handleDropOnColumn}
          />
        ) : (
          <ul className="space-y-3">
            {tasks.map((task, index) => (
              <li
                key={task.id}
                style={{ animationDelay: `${index * 0.06}s` }}
                className="theme-list-item animate-list-item flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium theme-text">{task.title}</p>
                  <p className="text-xs theme-muted">
                    Priorité : {priorityLabels[task.priority]} · Statut :{" "}
                    {statusLabels[task.status]}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value as TaskStatus)
                    }
                    className="theme-input rounded-lg border px-2 py-1 text-xs"
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
