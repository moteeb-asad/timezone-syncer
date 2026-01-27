export const Premium = () => {
  const features = [
    "Unlimited timezone tracking",
    "Custom working hours settings",
    "Meeting time suggestions",
    "Export timezone schedules",
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Elevate your global coordination
        </h2>
        <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
          Get the tools you need to manage distributed teams without the
          timezone headache.
        </p>
      </div>
      <div className="max-w-md mx-auto mb-20">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm relative overflow-hidden">
          <div className="pro-badge-gradient absolute top-0 right-0 px-4 py-1 text-[10px] font-bold text-white uppercase tracking-widest rounded-bl-lg">
            Recommended
          </div>
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900">Pro Plan</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-900">$9</span>
              <span className="text-slate-500 font-medium">/month</span>
            </div>
            <p className="text-sm text-slate-400 mt-2 font-medium">
              Billed annually or $12 month-to-month
            </p>
          </div>
          <div className="space-y-4 mb-8">
            {features.map((feature) => (
              <div className="flex items-start gap-3" key={feature}>
                <span className="material-symbols-outlined text-emerald-500 font-bold">
                  check_circle
                </span>
                <span className="text-slate-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
          <button className="w-full bg-primary-accent text-white font-bold py-4 rounded-lg hover:bg-opacity-90 transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2 group">
            Upgrade to Pro
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
          <p className="text-[10px] text-center text-slate-400 mt-4 uppercase font-bold tracking-tighter">
            Cancel anytime
          </p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Plan Comparison
          </h4>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Features
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32">
                  Free
                </th>
                <th className="px-6 py-4 text-xs font-bold text-primary-accent uppercase tracking-wider text-center w-32">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-700">
                  Timezone Tracking
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 text-center">
                  3 Max
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900 text-center">
                  Unlimited
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-700">
                  Custom Working Hours
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="material-symbols-outlined text-slate-300">
                    remove
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="material-symbols-outlined text-emerald-500 font-bold">
                    check
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-700">
                  Meeting Time Suggestions
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="material-symbols-outlined text-slate-300">
                    remove
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="material-symbols-outlined text-emerald-500 font-bold">
                    check
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-700">
                  Export Schedules
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="material-symbols-outlined text-slate-300">
                    remove
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="material-symbols-outlined text-emerald-500 font-bold">
                    check
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
