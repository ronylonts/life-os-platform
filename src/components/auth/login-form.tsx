"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { getAuthErrorMessage, useAuth } from "@/contexts/auth-context";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="stagger-children space-y-4">
      {error && <Alert variant="error">{error}</Alert>}

      <Input
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="user@lifeos.com"
      />

      <Input
        label="Mot de passe"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />

      <Button type="submit" className="w-full" loading={loading}>
        Se connecter
      </Button>

      <p className="text-center text-sm text-slate-400">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-emerald-400 hover:text-emerald-300">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
