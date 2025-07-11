export const Premium = () => {
  const features = [
    "✅ Unlimited timezone tracking",
    "✅ Custom working hours settings",
    "✅ Meeting time suggestions",
    "✅ Export timezone schedules",
    "✅ Advanced time zone analytics",
  ];

  return (
    <div className="container-page">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock unlimited timezones and advanced features to supercharge your
            global collaboration
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                $0
                <span className="text-lg font-normal text-gray-500">
                  /month
                </span>
              </div>
              <p className="text-gray-600">Perfect for getting started</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-green-500">✅</span>
                <span>Up to 3 timezones</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500">✅</span>
                <span>Basic working hours highlight</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500">✅</span>
                <span>Real-time synchronization</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">❌</span>
                <span className="text-gray-500">Custom working hours</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">❌</span>
                <span className="text-gray-500">Advanced features</span>
              </div>
            </div>

            <button className="btn-secondary">Current Plan</button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-300 p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <div className="text-4xl font-bold text-blue-600 mb-1">
                $5
                <span className="text-lg font-normal text-gray-500">
                  /month
                </span>
              </div>
              <p className="text-gray-600">For power users and teams</p>
            </div>

            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-green-500">✅</span>
                  <span>{feature.replace("✅ ", "")}</span>
                </div>
              ))}
            </div>

            <button className="btn-primary bg-blue-600 hover:bg-blue-700">
              Upgrade Now
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h4>
              <p className="text-gray-600">
                Yes! You can cancel your Premium subscription at any time.
                You'll continue to have access to Premium features until the end
                of your billing period.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                What happens to my data if I downgrade?
              </h4>
              <p className="text-gray-600">
                Your timezone data is always safe. If you downgrade, you'll be
                limited to 3 timezones, but you can choose which ones to keep.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h4>
              <p className="text-gray-600">
                You're already using our free plan! Upgrade anytime to unlock
                all Premium features immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <button onClick={() => window.history.back()} className="text-link">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
