import { ApiClientError } from "@/lib/api/client";
import type { AuthResponse, User } from "@/types/api";

function extractPayload(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const obj = raw as Record<string, unknown>;

  if (obj.success === true && obj.data && typeof obj.data === "object") {
    return obj.data as Record<string, unknown>;
  }

  if (obj.data && typeof obj.data === "object" && !("token" in obj)) {
    return obj.data as Record<string, unknown>;
  }

  return obj;
}

export function normalizeAuthResponse(raw: unknown): AuthResponse {
  const payload = extractPayload(raw);
  const token =
    (payload.token as string) ||
    (payload.accessToken as string) ||
    (payload.access_token as string);

  const rawUser = payload.user;
  let user: User | undefined;

  if (rawUser && typeof rawUser === "object") {
    const u = rawUser as Record<string, unknown>;
    if (u.id) {
      user = {
        id: String(u.id),
        email: String(u.email ?? ""),
        name: String(u.name ?? "Utilisateur"),
        createdAt: String(u.createdAt ?? new Date().toISOString()),
      };
    }
  }

  if (!token || typeof token !== "string") {
    throw new ApiClientError(
      "Réponse de connexion invalide : token manquant",
      500,
    );
  }

  return { token, user };
}
