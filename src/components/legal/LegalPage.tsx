import type { ReactNode } from "react";

interface LegalPageProps {
  title: string;
  updated: string;
  children: ReactNode;
}

/** Shared shell for the Terms and Privacy pages */
export const LegalPage = ({ title, updated, children }: LegalPageProps) => (
  <article className="mx-auto max-w-2xl px-5 py-12 font-sans text-ink sm:py-16">
    <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
    <p className="mt-2 font-mono text-xs text-muted">Last updated {updated}</p>
    <div className="mt-8 space-y-8 text-ink-2 [&_a]:font-medium [&_a]:text-coral-ink [&_a]:underline [&_a]:underline-offset-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
      {children}
    </div>
  </article>
);
