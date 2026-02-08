import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-4xl font-bold">
              schedule
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Timezone Syncer
            </h1>
          </div>
          <p className="text-slate-500 font-medium text-center">
            Syncing your world, one clock at a time.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};
