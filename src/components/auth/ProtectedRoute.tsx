import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RootState } from "../../store";
import { useSelector } from "react-redux";
import type { ProtectedRouteProps } from "../../types/auth";

export const ProtectedRoute = ({
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const { status } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  if (status !== "authenticated") {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location.pathname || "/" }}
      />
    );
  }

  return <Outlet />;
};
