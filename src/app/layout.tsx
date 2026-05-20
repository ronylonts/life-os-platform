import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/auth-context";
import { AppBackground } from "@/components/layout/app-background";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life OS — Hub personnel",
  description: "Centralisez tâches, agenda, bien-être et recommandations IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <AppBackground>{children}</AppBackground>
        </AuthProvider>
      </body>
    </html>
  );
}
