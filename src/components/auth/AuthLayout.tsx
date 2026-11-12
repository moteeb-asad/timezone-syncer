import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type AuthLayoutProps = {
  children: ReactNode;
  /** Right-hand panel, shown from the `lg` breakpoint up */
  aside?: ReactNode;
};

export const AuthLayout = ({ children, aside }: AuthLayoutProps) => (
  <div className="grid min-h-screen bg-paper font-sans text-ink antialiased lg:grid-cols-2">
    <div className="flex flex-col bg-card">
      <div className="flex items-center justify-between gap-4 px-5 py-2 sm:px-10">
        <Link to="/" className="flex h-14 items-center gap-2.5 text-ink">
          <span
            className="inline-flex size-9 items-center justify-center rounded-xl bg-coral-light text-coral-dark"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              className="size-5"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Timezone Syncer
          </span>
        </Link>
        <Link
          to="/"
          className="inline-flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-ink-2 hover:text-ink"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="size-4"
            aria-hidden="true"
          >
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          Back to home
        </Link>
      </div>

      <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>

    {aside}
  </div>
);
