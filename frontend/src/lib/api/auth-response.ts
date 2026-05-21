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

  const user = payload.user as User | undefined;

  if (!token) {
    throw new ApiClientError(
      "Réponse de connexion invalide : token manquant",
      500,
    );
  }

  return { token, user: user as User };
}
