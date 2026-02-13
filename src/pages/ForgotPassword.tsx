import { AuthLayout } from "../components/auth/AuthLayout";
import { ResetPasswordForm } from "../features/auth/components/ResetPasswordForm";

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
}
