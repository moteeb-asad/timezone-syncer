import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const About = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <div className="container-page">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Sync Time Across the Globe
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Timezone Syncer helps remote teams, freelancers, and global
            businesses coordinate across time zones effortlessly.
          </p>
        </div>

        {/* Core Purpose */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Why Timezone Syncer?
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            In today's globalized world, working with people across different
            time zones is the norm. But coordinating meeting times,
            understanding when colleagues are available, and avoiding late-night
            calls can be challenging.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Timezone Syncer eliminates the guesswork by providing instant,
            visual time comparisons. Set your base time, add the time zones you
            work with, and see at a glance when everyone is available—no more
            mental math or timezone conversion tools needed.
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Visual Time Comparison
              </h3>
              <p className="text-gray-600">
                Compare multiple time zones side-by-side with a clean,
                easy-to-read interface. See everyone's local time at a glance.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-3xl mb-3">⏰</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Working Hours Status
              </h3>
              <p className="text-gray-600">
                Instantly identify if it's working hours, early morning, or late
                evening in each timezone with color-coded status indicators.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Real-Time Updates
              </h3>
              <p className="text-gray-600">
                Your local time updates every second, keeping you in sync with
                the current moment across all time zones.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-3xl mb-3">💾</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Persistent Settings
              </h3>
              <p className="text-gray-600">
                Your timezone preferences are saved automatically, so you don't
                have to set them up every time you visit.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-gradient-to-br from-primary-light to-white rounded-xl border border-primary p-8 mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Perfect For
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-primary font-bold mr-3">✓</span>
              <div>
                <strong className="text-text-primary">Remote Teams:</strong>
                <span className="text-gray-600 ml-2">
                  Coordinate meetings and collaboration across distributed teams
                </span>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-primary font-bold mr-3">✓</span>
              <div>
                <strong className="text-text-primary">Freelancers:</strong>
                <span className="text-gray-600 ml-2">
                  Schedule calls with international clients at convenient times
                </span>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-primary font-bold mr-3">✓</span>
              <div>
                <strong className="text-text-primary">Project Managers:</strong>
                <span className="text-gray-600 ml-2">
                  Plan sprints and standups across multiple time zones
                </span>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-primary font-bold mr-3">✓</span>
              <div>
                <strong className="text-text-primary">Travel Planning:</strong>
                <span className="text-gray-600 ml-2">
                  Keep track of time zones when traveling for business or
                  pleasure
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-text-primary mb-2">
                Set Your Base Time
              </h3>
              <p className="text-gray-600 text-sm">
                Choose a time and your local timezone as the reference point
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-text-primary mb-2">
                Add Time Zones
              </h3>
              <p className="text-gray-600 text-sm">
                Select the time zones of your colleagues, clients, or
                destinations
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-text-primary mb-2">
                Compare & Coordinate
              </h3>
              <p className="text-gray-600 text-sm">
                See all times instantly and find the perfect meeting window
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Ready to Simplify Global Coordination?
          </h2>
          <p className="text-gray-600 mb-6">
            Start comparing time zones for free—no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link
                  to="/"
                  className="inline-block bg-primary text-white hover:bg-primary-dark px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Try It Now
                </Link>
                <Link
                  to="/premium"
                  className="inline-block bg-white text-primary hover:bg-gray-50 px-6 py-3 rounded-md font-medium border border-primary transition-colors"
                >
                  View Premium Plans
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="inline-block bg-primary text-white hover:bg-primary-dark px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/premium"
                  className="inline-block bg-white text-primary hover:bg-gray-50 px-6 py-3 rounded-md font-medium border border-primary transition-colors"
                >
                  Upgrade to Premium
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
