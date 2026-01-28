import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingLinking, setPendingLinking] = useState<{
    email: string;
    credential: any;
  } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | undefined)?.from || "/dashboard";

  const { register, signInWithGoogle, linkGoogleAccount } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await register(email, password, firstName, lastName);

      if (result.error) {
        setError(result.error.message);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithGoogle();

      // Check if account linking is needed
      if (
        result.error === "ACCOUNT_EXISTS" &&
        result.email &&
        result.credential
      ) {
        setPendingLinking({
          email: result.email,
          credential: result.credential,
        });
        setError(
          `An account already exists with ${result.email}. Please enter your password to link your Google account.`
        );
      } else if (result.error) {
        setError(
          typeof result.error === "string" ? result.error : result.error.message
        );
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAccounts = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pendingLinking) return;

    setLoading(true);
    setError("");

    try {
      await linkGoogleAccount(
        pendingLinking.email,
        password,
        pendingLinking.credential
      );

      setPendingLinking(null);
      setPassword("");
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Failed to link accounts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-4xl font-bold">
              schedule
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Timezone Syncer
            </h1>
          </div>
          <p className="text-slate-500 font-medium text-center">
            Syncing your world, one clock at a time.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 md:p-10">
          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Create your account
          </h2>
          <p className="text-sm text-slate-500 mb-8">
            Join thousands of developers syncing across borders.
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {pendingLinking ? (
            // Account Linking Form
            <form onSubmit={handleLinkAccounts} className="space-y-5">
              <p className="text-sm text-slate-600 mb-4">
                Please enter your password to link your Google account with your
                existing account.
              </p>

              <div className="space-y-2">
                <label
                  htmlFor="linking-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">
                    lock
                  </span>
                  <input
                    id="linking-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg shadow-sm shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Linking..." : "Link Accounts"}
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPendingLinking(null);
                  setPassword("");
                  setError("");
                }}
                className="w-full border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </form>
          ) : (
            // Sign Up Form
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  First Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">
                    person
                  </span>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Alex"
                  />
                </div>
              </div>

              {/* Last Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Last Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">
                    person
                  </span>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Rivera"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">
                    mail
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="alex@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Create Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">
                    lock
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg shadow-sm shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Sign Up"}
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid gap-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.909 3.292-2.09 4.213-1.217.956-2.909 1.787-5.75 1.787-4.434 0-8.036-3.602-8.036-8.037 0-4.434 3.602-8.036 8.036-8.036 2.422 0 4.19.95 5.58 2.27l2.29-2.29C18.28 2.02 15.64 1 12.48 1 6.36 1 1.5 5.86 1.5 12s4.86 11 10.98 11c3.31 0 5.8-1.09 7.79-3.15 2-2.07 2.63-4.96 2.63-7.29 0-.46-.04-.9-.11-1.29h-8.32z"
                  fill="currentColor"
                ></path>
              </svg>
              Google
            </button>
          </div>
        </div>

        {/* Toggle to Login */}
        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          Already have an account?
          <Link
            to="/login"
            className="text-primary font-bold hover:underline ml-1"
          >
            Sign In
          </Link>
        </p>

        {/* Footer Text */}
        <div className="mt-8 text-center">
          <div className="mt-8 pt-8 border-t border-slate-200/60">
            <p className="text-xs text-slate-400 font-medium">
              © 2026 Timezone Syncer. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
