import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const About = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <>
      <section className="pt-6 pb-16 px-6 bg-gradient-to-b from-slate-50/50 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Sync Every Moment, Across Every Border.
          </h2>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed">
            The simplest way for distributed teams and global nomads to
            coordinate across time zones with zero friction.
          </p>
        </div>
      </section>
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-10 md:p-12 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Why Timezone Syncer?
            </h3>
            <div className="space-y-4 text-slate-600 leading-relaxed text-base">
              <p>
                Coordinating across the globe shouldn’t feel like a math
                problem. We built Timezone Syncer to bridge the gap between
                distributed teams, eliminating meeting fatigue and late-night
                scheduling errors. No more mental math—just instant clarity.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-12">
            Key Features
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:border-primary-accent/30 transition-colors">
              <div className="mb-4">
                <span className="material-symbols-outlined text-primary-accent text-3xl">
                  public
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Visual Comparison
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Experience a side-by-side view of global clocks, designed for
                instant clarity.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:border-primary-accent/30 transition-colors">
              <div className="mb-4">
                <span className="material-symbols-outlined text-primary-accent text-3xl">
                  alarm_on
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Working Status
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Know at a glance who’s online with intuitive, color-coded
                work-day indicators.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:border-primary-accent/30 transition-colors">
              <div className="mb-4">
                <span className="material-symbols-outlined text-primary-accent text-3xl">
                  sync
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Real-Time Precision
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Stay perfectly synced with live-updating clocks that never skip
                a second.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:border-primary-accent/30 transition-colors">
              <div className="mb-4">
                <span className="material-symbols-outlined text-primary-accent text-3xl">
                  save
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Smart Persistence
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Your preferences are saved automatically. Pick up exactly where
                you left off.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-10 rounded-2xl border border-primary-accent/20 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">
              Perfect For
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary-accent font-bold">
                  check_circle
                </span>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-sm">
                    Remote Teams
                  </p>
                  <p className="text-sm text-slate-600 leading-snug">
                    Bridge the gap between distributed colleagues effortlessly.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary-accent font-bold">
                  check_circle
                </span>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-sm">
                    Freelancers
                  </p>
                  <p className="text-sm text-slate-600 leading-snug">
                    Maintain professional timing with international clients.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary-accent font-bold">
                  check_circle
                </span>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-sm">
                    Project Leads
                  </p>
                  <p className="text-sm text-slate-600 leading-snug">
                    Strategize global sprints with zero scheduling friction.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary-accent font-bold">
                  check_circle
                </span>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-sm">
                    Global Travelers
                  </p>
                  <p className="text-sm text-slate-600 leading-snug">
                    Stay connected with home and business while on the move.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-16">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-accent text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Set Reference
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Lock in your local time as the anchor for all comparisons.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-accent text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Populate Cities
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Add the global locations you need to monitor.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-accent text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Sync &amp; Schedule
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Identify perfect meeting windows in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-lg">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Simplify Global Coordination?
            </h3>
            <p className="text-slate-500 mb-10 text-base">
              Start comparing time zones for free—no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? "/dashboard" : "/"}
                className="w-full sm:w-auto px-10 py-4 bg-primary-accent text-white font-bold rounded-lg hover:bg-orange-600 transition-all shadow-lg shadow-primary-accent/25 text-center"
              >
                Try It Now
              </Link>
              <Link
                to="/premium"
                className="w-full sm:w-auto px-10 py-4 bg-white text-primary-accent font-bold border border-primary-accent rounded-lg hover:bg-orange-50 transition-colors text-center"
              >
                View Premium Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
