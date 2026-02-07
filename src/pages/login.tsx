import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [pendingLinking, setPendingLinking] = useState<{
    email: string;
    credential: any;
  } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | undefined)?.from || "/dashboard";

  const { loginWithEmail, signInWithGoogle, linkGoogleProvider } = useAuth();

  // Check if we were redirected from signup with a pending credential
  useEffect(() => {
    const state = location.state as any;
    if (state?.message) {
      setInfoMessage(state.message);
    }
    if (state?.email && state?.pendingCredential) {
      setEmail(state.email);
      setPendingLinking({
        email: state.email,
        credential: state.pendingCredential,
      });
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfoMessage("");

    try {
      // If we have a pending Google credential, link it
      if (pendingLinking) {
        await linkGoogleProvider(
          pendingLinking.email,
          password,
          pendingLinking.credential
        );
        setPendingLinking(null);
        navigate(from, { replace: true });
      } else {
        // Normal email/password login
        const result = await loginWithEmail(email, password);

        if (result.error) {
          setError(result.error.message);
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        "Failed to sign in. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    setInfoMessage("");

    try {
      const result = await signInWithGoogle();

      // Log to verify which providers are linked
      console.log("=== GOOGLE SIGN-IN RESULT ===");
      console.log("result.error:", result.error);
      console.log("result.user:", result.user);

      // If account exists with different credential (e.g., email/password exists)
      if (
        result.error === "ACCOUNT_EXISTS" &&
        result.email &&
        result.credential
      ) {
        setPendingLinking({
          email: result.email,
          credential: result.credential,
        });
        setEmail(result.email);
        setInfoMessage(
          `An account with ${result.email} already exists. Please enter your password to link your Google account.`
        );
      } else if (result.error) {
        setError(
          typeof result.error === "string" ? result.error : result.error.message
        );
      } else {
        // Successfully signed in - log the user's providers
        console.log(
          "Sign-in successful. User providers:",
          result.user?.providerData
        );
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
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
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {pendingLinking ? "Link Your Accounts" : "Welcome back"}
          </h2>
          <p className="text-sm text-slate-500 mb-8">
            {pendingLinking
              ? "Enter your password to link your Google account with your existing account."
              : "Please enter your details to sign in."}
          </p>

          {/* Info Message */}
          {infoMessage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">{infoMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!pendingLinking}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                  lock
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-sm text-slate-600 font-medium select-none cursor-pointer"
              >
                Keep me logged in
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Loading..."
                : pendingLinking
                  ? "Link Accounts & Sign In"
                  : "Log In"}
              <span className="material-symbols-outlined text-lg">
                arrow_forward
              </span>
            </button>

            {/* Cancel Link Button */}
            {pendingLinking && (
              <button
                type="button"
                onClick={() => {
                  setPendingLinking(null);
                  setInfoMessage("");
                  setError("");
                  setEmail("");
                  setPassword("");
                }}
                className="w-full border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            )}
          </form>

          {/* Divider */}
          {!pendingLinking && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Button */}
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
            </>
          )}
        </div>

        {/* Toggle to Signup */}
        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          Don't have an account?
          <Link
            to="/signup"
            className="text-primary font-bold hover:underline ml-1"
          >
            Create an Account
          </Link>
        </p>

        {/* Back to Home */}
        <p className="mt-4 text-center text-sm text-slate-500 font-medium">
          <Link
            to="/"
            className="text-slate-600 hover:text-primary font-semibold  inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            <span className="hover:underline">Back to Home</span>
          </Link>
        </p>
      </div>
    </div>
  );
};
