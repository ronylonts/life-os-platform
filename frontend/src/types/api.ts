export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type AiSuggestionType = "task" | "schedule" | "mood" | "goal";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  userId: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  userId: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  progress: number;
  userId: string;
}

export interface MoodEntry {
  id: string;
  score: number;
  note?: string;
  recordedAt: string;
  userId: string;
}

export interface FocusSession {
  id: string;
  durationMinutes: number;
  taskId?: string;
  completedAt: string;
  userId: string;
}

export interface AiSuggestion {
  id: string;
  type: AiSuggestionType;
  content: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface WeeklyReport {
  report: string;
  generatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
}

export interface CreateGoalPayload {
  title: string;
  description?: string;
  targetDate?: string;
}

export interface CreateMoodPayload {
  score: number;
  note?: string;
}

export interface CreateFocusPayload {
  durationMinutes: number;
  taskId?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
