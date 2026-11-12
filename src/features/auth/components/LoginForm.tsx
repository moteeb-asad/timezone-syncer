import { useState } from "react";
import { useLogin, isDemoAvailable, type LoginResult } from "../hooks/useLogin";
import { Button } from "@/components/ui/Button";

interface LoginFormProps {
  onSuccess: () => void;
}

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
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 md:p-10">
      {/* Title */}
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        Sign in to Timezone Syncer
      </h2>
      <p className="text-sm text-slate-500 mb-8">
        New here? Continuing with Google creates your account.
      </p>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid gap-4">
        <Button
          type="button"
          onClick={() => handleSignIn("google", signInWithGoogle)}
          disabled={loading !== null}
          className="w-full py-3.5 text-sm"
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
          {loading === "google" ? "Signing in..." : "Continue with Google"}
        </Button>

        {isDemoAvailable && (
          <>
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">
                  Or
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleSignIn("demo", signInAsDemo)}
              disabled={loading !== null}
              className="w-full py-3 text-sm"
            >
              <span className="material-symbols-outlined text-lg">
                play_circle
              </span>
              {loading === "demo" ? "Opening demo..." : "Try the demo"}
            </Button>
            <p className="text-xs text-center text-slate-400">
              Shared demo account. Anything you add is visible to other
              visitors.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
