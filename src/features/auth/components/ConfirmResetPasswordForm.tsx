import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../services/auth.service";
import { mapFirebaseError } from "@/utils/mapFirebaseError";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  confirmResetPasswordSchema,
  type ConfirmResetPasswordSchema,
} from "../schemas/authSchemas";

interface ConfirmResetPasswordFormProps {
  oobCode: string;
  onSuccess?: () => void;
}

export const ConfirmResetPasswordForm = ({
  oobCode,
  onSuccess,
}: ConfirmResetPasswordFormProps) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmResetPasswordSchema>({
    resolver: zodResolver(confirmResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handlePasswordReset = async (values: ConfirmResetPasswordSchema) => {
    setError("");
    setSuccess(false);

    try {
      await authService.confirmPasswordReset(oobCode, values.password);
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(mapFirebaseError(err).message);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 md:p-10">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-emerald-600 text-4xl">
              check_circle
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Password Reset Successful
          </h2>
          <p className="text-sm text-slate-500 mb-8">
            Your password has been successfully reset. You can now sign in with
            your new password.
          </p>
          <Link to="/login">
            <Button className="w-full py-3.5 text-sm">
              Go to Sign In
              <span className="material-symbols-outlined text-lg">
                arrow_forward
              </span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 md:p-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Set new password
      </h2>
      <p className="text-sm text-slate-500 mb-8">
        Enter your new password below to complete the reset process.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(handlePasswordReset)}
        className="space-y-6"
        noValidate
      >
        <Input
          id="password"
          type="password"
          label="New Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 text-sm"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
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
