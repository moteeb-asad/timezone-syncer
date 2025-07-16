import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { GLOBAL_STYLES } from "../styles/constants";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log(email);

    try {
      const result = isRegistering
        ? await register(email, password)
        : await login(email, password);

      if (result.error) {
        setError(result.error.message);
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
      <div className={GLOBAL_STYLES.container.center}>
        <div className={GLOBAL_STYLES.container.card}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={GLOBAL_STYLES.text.heading}></h1>
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
          <form onSubmit={handleSubmit} className={GLOBAL_STYLES.layout.stack}>
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
                ? "Please wait..."
                : isRegistering
                ? "Create Account"
                : "Sign In"}
            </button>
          </form>

          {/* Toggle Register/Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isRegistering
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError("");
                }}
                className={GLOBAL_STYLES.button.ghost}
              >
                {isRegistering ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          {!isRegistering && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-2">
                Demo Credentials:
              </p>
              <p className="text-sm text-blue-700">
                Email: demo@timezonesyncer.com
                <br />
                Password: demo123456
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
