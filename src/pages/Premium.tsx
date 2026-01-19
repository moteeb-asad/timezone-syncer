export const Premium = () => {
  const features = [
    "✅ Unlimited timezone tracking",
    "✅ Custom working hours settings",
    "✅ Meeting time suggestions",
    "✅ Export timezone schedules",
  ];

  return (
    <div className="container-page">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
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
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 relative">
            <div className="absolute -top-4 left-4">
              <span className="bg-gray-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Free
              </span>
            </div>
            <div className="mt-4">
              <div className="text-4xl font-bold text-text-primary mb-1">
                $0
                <span className="text-lg font-normal text-gray-500">
                  /month
                </span>
              </div>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <ul className="space-y-4 mb-8">
                <li>✅ Compare up to 3 timezones</li>
                <li>✅ Basic working hours display</li>
                <li>✅ Standard support</li>
              </ul>
              <button className="btn-secondary">Current Plan</button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-primary-light to-white rounded-xl border-2 border-primary p-8 relative">
            <div className="absolute -top-4 left-4">
              <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                Premium
              </span>
            </div>
            <div className="mt-4">
              <div className="text-4xl font-bold text-primary mb-1">
                $6
                <span className="text-lg font-normal text-gray-500">
                  /month
                </span>
              </div>
              <p className="text-gray-600 mb-6">For power users & teams</p>
              <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button className="btn-primary">Upgrade Now</button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mt-16">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-text-primary mb-2">
                Can I cancel my subscription anytime?
              </h4>
              <p className="text-gray-600">
                Yes! You can cancel your Premium subscription at any time.
                You'll continue to have access to Premium features until the end
                of your billing period.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-2">
                What happens to my data if I downgrade?
              </h4>
              <p className="text-gray-600">
                Your timezone data is always safe. If you downgrade, you'll be
                limited to 3 timezones, but you can choose which ones to keep.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-2">
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
