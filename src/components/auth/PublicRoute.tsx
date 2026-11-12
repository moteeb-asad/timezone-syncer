import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { PublicRouteProps } from "../../features/auth/types";

export const PublicRoute = ({
  redirectTo = "/dashboard",
}: PublicRouteProps) => {
  const { status } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  // Send the user back to the page that sent them to sign in
  const from = (location.state as { from?: string } | null)?.from;

  if (status === "authenticated") {
    return <Navigate to={from ?? redirectTo} replace />;
  }

  return <Outlet />;
};
