import { useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { LoginForm } from "../features/auth/components/LoginForm";
import { SignInPreview } from "../features/auth/components/SignInPreview";

type LoginLocationState = {
  from?: string;
};

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LoginLocationState | null;

  const from = state?.from ?? "/dashboard";

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <AuthLayout aside={<SignInPreview />}>
      <LoginForm onSuccess={handleSuccess} />
    </AuthLayout>
  );
};
