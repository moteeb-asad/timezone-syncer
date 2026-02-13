import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignup } from "../hooks/useSignup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signupSchema, type SignupSchema } from "../schemas/authSchemas";

interface SignupFormProps {
  onSuccess: () => void;
  onAccountExists: (
    email: string,
    credential: any,
    message: string,
    from: string
  ) => void;
  from?: string;
}

export const SignupForm = ({
  onSuccess,
  onAccountExists,
  from = "/dashboard",
}: SignupFormProps) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { registerWithEmail, signInWithGoogle } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const isBusy = isSubmitting || loading;

  const onSubmit = async (values: SignupSchema) => {
    setError("");

    try {
      const result = await registerWithEmail(
        values.email,
        values.password,
        values.firstName,
        values.lastName
      );
      if (result.error) {
        setError(result.error.message);
      } else {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithGoogle();

      if (result.error === "ACCOUNT_EXISTS" && result.email) {
        onAccountExists(
          result.email,
          result.credential,
          `An account already exists with ${result.email}. Please sign in to link your Google account.`,
          from
        );
      } else if (result.error) {
        setError(
          typeof result.error === "string" ? result.error : result.error.message
        );
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          id="firstName"
          type="text"
          autoComplete="given-name"
          label="First Name"
          placeholder="Alex"
          error={errors.firstName?.message}
          {...register("firstName")}
        />

        <Input
          id="lastName"
          type="text"
          autoComplete="family-name"
          label="Last Name"
          placeholder="Rivera"
          error={errors.lastName?.message}
          {...register("lastName")}
        />

        <Input
          id="email"
          type="text"
          inputMode="email"
          autoComplete="email"
          label="Email Address"
          placeholder="alex@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          label="Create Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" disabled={isBusy} className="w-full py-3 text-sm">
          {isSubmitting ? "Creating account..." : "Sign Up"}
          <span className="material-symbols-outlined text-[18px]">
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
          <span className="bg-white px-3 text-slate-400 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="grid gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isBusy}
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
    </div>
  );
};
