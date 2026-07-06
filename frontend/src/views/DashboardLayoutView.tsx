import { ReactNode } from "react";

export function DashboardLayoutView({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent flex flex-col relative z-0">
      <main className="flex-1 relative z-10">
        {children}
      </main>
    </div>
  );
}
