export const Contact = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient py-24 border-b border-gray-50">
        <div className="main-container text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-brand-navy mb-8 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-brand-gray max-w-2xl mx-auto leading-relaxed">
            {
              "We're here to help you coordinate across borders and timezones. Whether you have a technical issue or just want to share your experience, we'd love to hear from you."
            }
          </p>
        </div>
      </section>

      {/* Content Split Layout */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left: Information Cards */}
            <div className="lg:col-span-7 space-y-12">
              {/* Subscription Support Block */}
              <div className="flex gap-6 group">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-brand-coral group-hover:bg-brand-coral group-hover:text-white transition-all duration-300">
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-brand-navy mb-3">
                    Subscription Support
                  </h2>
                  <p className="text-brand-gray text-lg leading-relaxed">
                    Need help with your Premium Pro plan, billing, or account
                    management? Our dedicated support team handles all
                    subscription-related inquiries with priority.
                  </p>
                </div>
              </div>
              {/* General Feedback Block */}
              <div className="flex gap-6 group">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-brand-navy mb-3">
                    General Feedback
                  </h2>
                  <p className="text-brand-gray text-lg leading-relaxed">
                    Have a feature request or just want to tell us how Timezone
                    Syncer has helped your workflow? We value all feedback from
                    our global community.
                  </p>
                </div>
              </div>
            </div>
            {/* Right: Sidebar Contact Focus */}
            <div className="lg:col-span-5">
              <div className="bg-brand-navy rounded-[2rem] p-10 text-white relative overflow-hidden sticky top-32">
                {/* Background decoration */}
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-brand-coral/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-orange-200 mb-8 border border-white/10">
                    Direct Channel
                  </div>
                  <h3 className="text-3xl font-bold mb-6">
                    Reach out to our global team
                  </h3>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    Email us directly for any inquiries. We operate across all
                    timezones to ensure you're never left waiting.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary uppercase tracking-wider">
                      Email Address
                    </p>
                    <a
                      className="block text-2xl font-medium text-white hover:text-primary transition-colors duration-300 break-words"
                      href="mailto:support@timezonesyncer.com"
                    >
                      support@timezonesyncer.com
                    </a>
                  </div>
                  <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-sm text-gray-400">
                        Typical response time:{" "}
                        <span className="text-white">Under 24 hours</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
