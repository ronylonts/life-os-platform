/** Décode le payload JWT (sans vérification) pour récupérer userId */
export function getUserIdFromToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as { userId?: string; sub?: string };

    return payload.userId ?? payload.sub ?? null;
  } catch {
    return null;
  }
}
