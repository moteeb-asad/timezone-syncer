import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { SignupForm } from "../features/auth/components/SignupForm";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | undefined)?.from || "/dashboard";

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  const handleAccountExists = (
    email: string,
    credential: any,
    message: string,
    fromPath: string
  ) => {
    navigate("/login", {
      replace: true,
      state: {
        message,
        email,
        pendingCredential: credential,
        from: fromPath,
      },
    });
  };

  return (
    <AuthLayout>
      <SignupForm
        onSuccess={handleSuccess}
        onAccountExists={handleAccountExists}
        from={from}
      />

      {/* Toggle to Login */}
      <p className="mt-8 text-center text-sm text-slate-500 font-medium">
        Already have an account?
        <Link
          to="/login"
          className="text-primary font-bold hover:underline ml-1"
        >
          Sign In
        </Link>
      </p>

      {/* Footer Text */}
      <div className="mt-8 text-center">
        <div className="mt-8 pt-8 border-t border-slate-200/60">
          <p className="text-xs text-slate-400 font-medium">
            © 2026 Timezone Syncer. All rights reserved.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;
