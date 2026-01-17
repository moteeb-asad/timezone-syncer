import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/login";
import { Premium } from "../pages/Premium";
import {
  TimezoneManager,
  ProtectedRoute,
  PublicRoute,
  Layout,
  Account,
} from "../components";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export function AppRoutes() {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public-only routes */}
        <Route element={<PublicRoute redirectTo="/dashboard" />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<TimezoneManager isPremium={false} />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute redirectTo="/login" />}>
          <Route
            path="/dashboard"
            element={<TimezoneManager isPremium={false} />}
          />
          <Route path="/premium" element={<Premium />} />
          <Route path="/account" element={<Account />} />
        </Route>

        {/* Catch-all */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
      </Route>
    </Routes>
  );
}
