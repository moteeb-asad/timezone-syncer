import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../services/auth.service";
import { mapFirebaseError } from "@/utils/mapFirebaseError";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "../schemas/authSchemas";

interface ResetPasswordFormProps {
  onSuccess?: (email: string) => void;
}

export const ResetPasswordForm = ({ onSuccess }: ResetPasswordFormProps) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleResetRequest = async (values: ResetPasswordSchema) => {
    setError("");
    setSuccess("");

    try {
      await authService.requestPasswordReset(values.email);
      const message = `Password reset instructions have been sent to ${values.email}.`;
      setSuccess(message);
      onSuccess?.(values.email);
    } catch (err) {
      setError(mapFirebaseError(err).message);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 md:p-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Reset your password
      </h2>
      <p className="text-sm text-slate-500 mb-8">
        Enter your email and we will send you a reset link.
      </p>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-emerald-700">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(handleResetRequest)}
        className="space-y-6"
        noValidate
      >
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
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 text-sm"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
          <span className="material-symbols-outlined text-lg">
            arrow_forward
          </span>
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 font-medium">
        Remember your password?
        <Link
          to="/login"
          className="text-primary font-bold hover:underline ml-1"
        >
          Back to Sign In
        </Link>
      </p>
    </div>
  );
};
