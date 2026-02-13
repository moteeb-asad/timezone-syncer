import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { ConfirmResetPasswordForm } from "../features/auth/components/ConfirmResetPasswordForm";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get("oobCode");

  const handleSuccess = () => {
    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  // If no oobCode, show error
  if (!oobCode) {
    return (
      <AuthLayout>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 md:p-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-600 text-4xl">
                error
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-sm text-slate-500 mb-8">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <a
              href="/forgot-password"
              className="inline-block text-primary font-bold hover:underline"
            >
              Request New Link
            </a>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <ConfirmResetPasswordForm oobCode={oobCode} onSuccess={handleSuccess} />
    </AuthLayout>
  );
}
