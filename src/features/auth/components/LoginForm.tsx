import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin, type LoginResult } from "../hooks/useLogin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema, type LoginSchema } from "../schemas/authSchemas";

interface LoginFormProps {
  onSuccess: () => void;
  initialEmail?: string;
  initialMessage?: string;
}

export const LoginForm = ({
  onSuccess,
  initialEmail = "",
  initialMessage = "",
}: LoginFormProps) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState(initialMessage);

  const { loginWithEmail, signInWithGoogle } = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: initialEmail,
      password: "",
    },
  });

  useEffect(() => {
    if (initialMessage) {
      setInfoMessage(initialMessage);
    }
    if (initialEmail) {
      setValue("email", initialEmail);
    }
  }, [initialEmail, initialMessage, setValue]);

  const onSubmit = async (values: LoginSchema) => {
    setLoading(true);
    setError("");
    setInfoMessage("");

    try {
      const result = await loginWithEmail(values.email, values.password);

      if (result.error) {
        setError(result.error.message);
      } else {
        onSuccess();
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
      const result: LoginResult = await signInWithGoogle();

      if (result.error && result.error.code === "USE_PASSWORD") {
        setValue("email", result.email);
        setInfoMessage(
          `This email is registered with a password. Please sign in with your password below.`
        );
      } else if (result.error) {
        setError(result.error.message);
      } else {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 md:p-10">
      {/* Title */}
      <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome back</h2>
      <p className="text-sm text-slate-500 mb-8">
        Please enter your details to sign in.
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Email Field */}
        <Input
          id="email"
          type="text"
          inputMode="email"
          autoComplete="email"
          label="Email Address"
          placeholder="user@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-400"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 text-sm"
        >
          {loading ? "Loading..." : "Log In"}
          <span className="material-symbols-outlined text-lg">
            arrow_forward
          </span>
        </Button>
      </form>

      {/* Divider */}
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
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="py-2.5 px-4 text-sm"
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
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-primary font-semibold hover:underline"
        >
          Create an Account
        </Link>
      </p>
    </div>
  );
};
