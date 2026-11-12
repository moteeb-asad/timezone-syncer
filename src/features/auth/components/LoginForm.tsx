import { useState } from "react";
import { useLogin, isDemoAvailable, type LoginResult } from "../hooks/useLogin";
import { GoogleButton } from "./GoogleButton";

interface LoginFormProps {
  onSuccess: () => void;
}

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mt-0.5 size-4 shrink-0 text-ok"
    aria-hidden="true"
  >
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
);

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"google" | "demo" | null>(null);

  const { signInWithGoogle, signInAsDemo } = useLogin();

  const handleSignIn = async (
    method: "google" | "demo",
    signIn: () => Promise<LoginResult>
  ) => {
    setLoading(method);
    setError("");

    const result = await signIn();

    if ("error" in result) {
      setError(result.error.message);
      setLoading(null);
    } else {
      onSuccess();
    }
  };

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Sign in to Timezone Syncer
      </h1>
      <p className="mt-3 text-ink-2">
        Use your Google account. New here? Your account is created the first
        time you sign in.
      </p>

      <GoogleButton
        className="mt-8"
        loading={loading === "google"}
        disabled={loading !== null}
        onClick={() => handleSignIn("google", signInWithGoogle)}
      />

      {/* Kept in the page so screen readers announce new errors */}
      <div role="alert">
        {error && (
          <p className="mt-3 rounded-lg border border-danger/20 bg-danger-soft px-3 py-2.5 text-sm text-danger">
            {error}
          </p>
        )}
      </div>

      {isDemoAvailable && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => handleSignIn("demo", signInAsDemo)}
            disabled={loading !== null}
            className="inline-flex h-11 items-center rounded-lg px-3 text-sm font-medium text-coral-ink underline underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading === "demo" ? "Opening demo…" : "Try the demo instead"}
          </button>
          <p className="text-xs text-muted">
            Shared account: anything you add is visible to other visitors.
          </p>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-line bg-paper p-4">
        <p className="text-label font-semibold uppercase text-muted">
          What we use
        </p>
        <ul className="mt-3 space-y-2.5 text-sm text-ink-2">
          <li className="flex gap-2.5">
            <CheckIcon />
            Your name, email and photo, to save your cities
          </li>
          <li className="flex gap-2.5">
            <CheckIcon />
            Your calendar only if you open timezone tax, read-only, and you
            can disconnect it any time
          </li>
        </ul>
      </div>
    </>
  );
};
