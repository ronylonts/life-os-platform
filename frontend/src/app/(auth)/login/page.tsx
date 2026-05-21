"use client";

import { useEffect } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { getToken } from "@/lib/auth/storage";

export default function LoginPage() {
  useEffect(() => {
    if (getToken()) {
      window.location.href = "/dashboard";
    }
  }, []);

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-white">Connexion</h2>
      <LoginForm />
    </>
  );
}
