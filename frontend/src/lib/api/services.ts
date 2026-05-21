import { apiRequest } from "@/lib/api/client";
import { normalizeAuthResponse } from "@/lib/api/auth-response";
import type {
  AiSuggestion,
  AuthResponse,
  CreateEventPayload,
  CreateFocusPayload,
  CreateGoalPayload,
  CreateMoodPayload,
  CreateTaskPayload,
  Event,
  FocusSession,
  Goal,
  LoginPayload,
  MoodEntry,
  RegisterPayload,
  Task,
  UpdateTaskPayload,
  User,
  WeeklyReport,
} from "@/types/api";

async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const raw = await apiRequest<unknown>("/auth/login", {
    method: "POST",
    body: payload,
  });
  return normalizeAuthResponse(raw);
}

async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const raw = await apiRequest<unknown>("/auth/register", {
    method: "POST",
    body: payload,
  });
  return normalizeAuthResponse(raw);
}

export const authApi = {
  register: (payload: RegisterPayload) => registerRequest(payload),

  login: (payload: LoginPayload) => loginRequest(payload),

  me: () => apiRequest<User>("/auth/me", { auth: true }),
};

export const tasksApi = {
  list: (params?: { status?: string; priority?: string }) => {
    const search = new URLSearchParams();
    if (params?.status) search.set("status", params.status);
    if (params?.priority) search.set("priority", params.priority);
    const query = search.toString();
    return apiRequest<Task[]>(`/tasks${query ? `?${query}` : ""}`, { auth: true });
  },

  create: (payload: CreateTaskPayload) =>
    apiRequest<Task>("/tasks", { method: "POST", auth: true, body: payload }),

  update: (id: string, payload: UpdateTaskPayload) =>
    apiRequest<Task>(`/tasks/${id}`, { method: "PUT", auth: true, body: payload }),

  delete: (id: string) =>
    apiRequest<void>(`/tasks/${id}`, { method: "DELETE", auth: true }),
};

export const eventsApi = {
  list: (params?: { from?: string; to?: string }) => {
    const search = new URLSearchParams();
    if (params?.from) search.set("from", params.from);
    if (params?.to) search.set("to", params.to);
    const query = search.toString();
    return apiRequest<Event[]>(`/events${query ? `?${query}` : ""}`, { auth: true });
  },

  create: (payload: CreateEventPayload) =>
    apiRequest<Event>("/events", { method: "POST", auth: true, body: payload }),
};

export const goalsApi = {
  list: () => apiRequest<Goal[]>("/goals", { auth: true }),

  create: (payload: CreateGoalPayload) =>
    apiRequest<Goal>("/goals", { method: "POST", auth: true, body: payload }),

  updateProgress: (id: string, progress: number) =>
    apiRequest<Goal>(`/goals/${id}/progress`, {
      method: "PATCH",
      auth: true,
      body: { progress },
    }),
};

export const moodApi = {
  list: () => apiRequest<MoodEntry[]>("/mood", { auth: true }),

  create: (payload: CreateMoodPayload) =>
    apiRequest<MoodEntry>("/mood", { method: "POST", auth: true, body: payload }),
};

export const focusApi = {
  list: () => apiRequest<FocusSession[]>("/focus", { auth: true }),

  create: (payload: CreateFocusPayload) =>
    apiRequest<FocusSession>("/focus", { method: "POST", auth: true, body: payload }),
};

export const aiApi = {
  suggestions: () => apiRequest<AiSuggestion[]>("/ai/suggestions", { auth: true }),

  weeklyReport: () => apiRequest<WeeklyReport>("/ai/weekly-report", { auth: true }),
};
