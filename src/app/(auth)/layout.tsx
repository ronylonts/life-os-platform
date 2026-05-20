import { AppLogo } from "@/components/layout/app-logo";
import { PageTransition } from "@/components/layout/page-transition";
import { MedicalIllustration } from "@/components/auth/medical-illustration";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-5xl flex-col items-center gap-8 lg:flex-row lg:justify-between lg:gap-12">
        <div className="animate-slide-in-left flex w-full flex-col items-center lg:w-1/2">
          <MedicalIllustration />
        </div>

        <div className="animate-slide-in-right w-full max-w-md lg:w-1/2">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="animate-scale-in">
              <AppLogo size={72} />
            </div>
            <h1 className="mt-4 animate-fade-in text-2xl font-bold text-white">
              Votre hub personnel
            </h1>
            <p className="mt-2 max-w-sm animate-fade-in text-slate-400">
              Centralisez tâches, agenda et bien-être en un seul endroit.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-900/20 backdrop-blur-md transition-all duration-500 hover:border-emerald-500/30 hover:shadow-emerald-900/30">
            <PageTransition>{children}</PageTransition>
          </div>
        </div>
      </div>
    </div>
  );
}
