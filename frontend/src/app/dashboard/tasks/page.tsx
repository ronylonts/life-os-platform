import { PageHeader } from "@/components/layout/page-header";
import { TaskManager } from "@/components/tasks/task-manager";

export default function TasksPage() {
  return (
    <div>
      <PageHeader
        title="Tâches"
        description="Organisez votre charge de travail quotidienne"
      />
      <TaskManager />
    </div>
  );
}
