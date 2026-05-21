"use client";

import type { Task, TaskPriority, TaskStatus } from "@/types/api";
import { Button } from "@/components/ui/button";

const columns: { status: TaskStatus; label: string; accent: string }[] = [
  { status: "todo", label: "À faire", accent: "border-t-slate-500" },
  { status: "in_progress", label: "En cours", accent: "border-t-amber-500" },
  { status: "done", label: "Terminé", accent: "border-t-emerald-500" },
];

const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-slate-600/80 text-slate-200",
  medium: "bg-amber-600/80 text-amber-100",
  high: "bg-red-600/80 text-red-100",
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
};

interface TaskKanbanProps {
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDropOnColumn: (status: TaskStatus) => void;
}

export function TaskKanban({
  tasks,
  onStatusChange,
  onDelete,
  draggingId,
  onDragStart,
  onDragEnd,
  onDropOnColumn,
}: TaskKanbanProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);

        return (
          <div
            key={col.status}
            className={`theme-kanban-column flex min-h-[320px] w-72 shrink-0 flex-col rounded-xl border border-t-4 ${col.accent} p-3`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDropOnColumn(col.status)}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold theme-text">{col.label}</h3>
              <span className="theme-badge rounded-full px-2 py-0.5 text-xs">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              {columnTasks.map((task) => (
                <article
                  key={task.id}
                  draggable
                  onDragStart={() => onDragStart(task.id)}
                  onDragEnd={onDragEnd}
                  className={`theme-kanban-card cursor-grab rounded-lg border p-3 shadow-sm transition active:cursor-grabbing ${
                    draggingId === task.id ? "opacity-50" : ""
                  }`}
                >
                  <p className="text-sm font-medium theme-text">{task.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${priorityStyles[task.priority]}`}
                    >
                      {priorityLabels[task.priority]}
                    </span>
                    {task.dueDate && (
                      <span className="text-[10px] theme-muted">
                        {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex gap-1">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        onStatusChange(task.id, e.target.value as TaskStatus)
                      }
                      className="theme-input flex-1 rounded border px-1.5 py-1 text-[10px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="todo">À faire</option>
                      <option value="in_progress">En cours</option>
                      <option value="done">Terminé</option>
                    </select>
                    <Button
                      variant="danger"
                      className="!px-2 !py-1 text-[10px]"
                      onClick={() => onDelete(task.id)}
                    >
                      ×
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
