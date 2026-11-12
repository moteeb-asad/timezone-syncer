export const ComingSoon = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-bg-main">
      <div className="flex items-center gap-2.5 mb-10">
        <span className="material-symbols-outlined text-primary-accent text-3xl font-bold">
          schedule
        </span>
        <span className="text-lg font-bold tracking-tight text-slate-900">
          Timezone Syncer
        </span>
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-primary-accent bg-primary-light px-3 py-1 rounded-full mb-6">
        Coming soon
      </span>

      <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-2xl">
        Weekly meetings that land at the right time for everyone
      </h1>

      <p className="mt-5 text-base md:text-lg text-slate-500 max-w-xl font-medium">
        We're rebuilding Timezone Syncer from the ground up. Check back soon.
      </p>

      <p className="mt-16 text-xs text-slate-400 font-medium">
        © 2026 Timezone Syncer
      </p>
    </main>
  );
};
