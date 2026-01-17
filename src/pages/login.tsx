import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";
import { GLOBAL_STYLES } from "../styles/constants";
import { useSelector, useDispatch } from "react-redux";
import { setIsRegistering } from "../slices/userSlice";
import type { RootState } from "../store";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | undefined)?.from || "/dashboard";
  const isRegistering = useSelector(
    (state: RootState) => state.user.isRegistering
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = isRegistering
        ? await register(email, password, firstName, lastName)
        : await login(email, password);

      if (result.error) {
        setError(result.error.message);
      } else {
        // Redirect to intended page after successful auth
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
    <div className={GLOBAL_STYLES.container.page}>
      <div
        className={`${GLOBAL_STYLES.container.center} ${
          isRegistering ? "register-wrapper" : ""
        }`}
      >
        <div className={GLOBAL_STYLES.container.card}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`${GLOBAL_STYLES.text.heading} mb-2`}>
              {isRegistering ? "Sign Up" : "Login"}
            </h1>
            <p className="text-gray-600">
              {isRegistering
                ? "Create your account"
                : "Sign in to your account"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className={GLOBAL_STYLES.text.error}>{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Registration Fields */}
            {isRegistering && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name Field */}
                <div>
                  <label
                    htmlFor="firstName"
                    className={GLOBAL_STYLES.text.label}
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={GLOBAL_STYLES.input.base}
                    placeholder="Enter your first name"
                  />
                </div>

                {/* Last Name Field */}
                <div>
                  <label
                    htmlFor="lastName"
                    className={GLOBAL_STYLES.text.label}
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={GLOBAL_STYLES.input.base}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className={GLOBAL_STYLES.text.label}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={GLOBAL_STYLES.input.base}
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className={GLOBAL_STYLES.text.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={GLOBAL_STYLES.input.base}
                placeholder="Enter your password"
                minLength={6}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`${GLOBAL_STYLES.button.primary} ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading
                ? "Loading..."
                : isRegistering
                ? "Create Account"
                : "Sign In"}
            </button>

            {/* Toggle Register/Login */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => dispatch(setIsRegistering(!isRegistering))}
                className={GLOBAL_STYLES.button.ghost}
              >
                {isRegistering
                  ? "Already have an account? Sign in"
                  : "Need an account? Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
