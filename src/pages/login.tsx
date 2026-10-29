import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { LoginForm } from "../features/auth/components/LoginForm";

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
    <AuthLayout>
      <LoginForm onSuccess={handleSuccess} />

      {/* Back to Home */}
      <p className="mt-8 text-center text-sm text-slate-500 font-medium">
        <Link
          to="/"
          className="text-slate-600 hover:text-primary font-semibold inline-flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          <span className="hover:underline">Back to Home</span>
        </Link>
      </p>
    </AuthLayout>
  );
};
