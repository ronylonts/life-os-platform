import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types/api";

const USERS_STORAGE_KEY = "life_os_mock_users";

interface MockUserRecord {
  password: string;
  user: User;
}

function loadUsers(): MockUserRecord[] {
  if (typeof window === "undefined") return getDefaultUsers();
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) {
    const defaults = getDefaultUsers();
    saveUsers(defaults);
    return defaults;
  }
  return JSON.parse(raw) as MockUserRecord[];
}

function saveUsers(users: MockUserRecord[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function getDefaultUsers(): MockUserRecord[] {
  return [
    {
      password: "motdepasse123",
      user: {
        id: "00000000-0000-4000-8000-000000000001",
        email: "user@lifeos.com",
        name: "Rony",
        createdAt: new Date().toISOString(),
      },
    },
  ];
}

function createToken(userId: string): string {
  return `mock-jwt-${userId}`;
}

function parseToken(token: string): string | null {
  if (!token.startsWith("mock-jwt-")) return null;
  return token.replace("mock-jwt-", "");
}

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockAuthApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    await delay();
    const users = loadUsers();

    if (users.some((u) => u.user.email === payload.email)) {
      throw { message: "Cet email est déjà utilisé", status: 409 };
    }

    const user: User = {
      id: crypto.randomUUID(),
      email: payload.email,
      name: payload.name,
      createdAt: new Date().toISOString(),
    };

    users.push({ password: payload.password, user });
    saveUsers(users);

    return { token: createToken(user.id), user };
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    await delay();
    const users = loadUsers();
    const record = users.find((u) => u.user.email === payload.email);

    if (!record || record.password !== payload.password) {
      throw { message: "Identifiants invalides", status: 401 };
    }

    return { token: createToken(record.user.id), user: record.user };
  },

  async me(token: string): Promise<User> {
    await delay();
    const userId = parseToken(token);
    if (!userId) {
      throw { message: "Token manquant ou invalide", status: 401 };
    }

    const users = loadUsers();
    const record = users.find((u) => u.user.id === userId);

    if (!record) {
      throw { message: "Token manquant ou invalide", status: 401 };
    }

    return record.user;
  },
};

export function isMockToken(token: string | null): boolean {
  return Boolean(token?.startsWith("mock-jwt-"));
}

export const isMockAuthEnabled =
  process.env.NEXT_PUBLIC_MOCK_AUTH === "true";
