import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { PublicRouteProps } from "../../types/auth";

export const PublicRoute = ({
  redirectTo = "/dashboard",
}: PublicRouteProps) => {
  const { status } = useSelector((state: RootState) => state.user);

  if (status === "authenticated") {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
