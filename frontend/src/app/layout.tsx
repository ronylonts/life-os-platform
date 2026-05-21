import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { ToastProvider } from "@/contexts/toast-context";
import { AppBackground } from "@/components/layout/app-background";
import { ToastContainer } from "@/components/ui/toast-container";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life OS — Hub personnel",
  description: "Centralisez tâches, agenda, bien-être et recommandations IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <AppBackground>{children}</AppBackground>
            </AuthProvider>
            <ToastContainer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
