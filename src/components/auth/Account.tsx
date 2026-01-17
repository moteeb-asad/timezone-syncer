import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export const Account = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <div className="container-page">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Account Details
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          {/* Name Section */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Name</h2>
            <p className="text-gray-600">
              {user?.firstName} {user?.lastName}
            </p>
          </div>

          {/* Email Section */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-text-primary mb-2">
              Email
            </h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          {/* Subscription Plan Section */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-text-primary mb-2">
              Current Plan
            </h2>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-light text-primary">
                {user?.isPremium ? "Premium" : "Free"}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {user?.isPremium
                ? "You have access to unlimited timezone comparisons."
                : "Free plan allows up to 3 timezone comparisons. Upgrade to Premium for unlimited access."}
            </p>
          </div>

          {/* Upgrade Button - Only show for free users */}
          {!user?.isPremium && (
            <div>
              <button
                onClick={() => (window.location.href = "/premium")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
