import { FloatingBubbles } from "@/components/layout/floating-bubbles";

export function AppBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-background relative min-h-screen">
      <FloatingBubbles />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
