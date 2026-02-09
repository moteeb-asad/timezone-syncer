import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/login";
import Signup from "../pages/signup";
import { Premium } from "../pages/Premium";
import { About } from "../pages/About";
import { ProtectedRoute, PublicRoute, Layout, Account } from "../components";
import { TimezoneManager } from "../features/timezone/components";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export function AppRoutes() {
  const { status } = useSelector((state: RootState) => state.user);

  return (
    <Routes>
      {/* Auth routes (without Layout) */}
      <Route element={<PublicRoute redirectTo="/dashboard" />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* All other routes with Layout */}
      <Route element={<Layout />}>
        {/* Public routes (accessible to everyone) */}
        <Route path="/" element={<TimezoneManager />} />
        <Route path="/about" element={<About />} />
        <Route path="/premium" element={<Premium />} />

        {/* Protected routes (require authentication) */}
        <Route element={<ProtectedRoute redirectTo="/login" />}>
          <Route path="/dashboard" element={<TimezoneManager />} />
          <Route path="/account" element={<Account />} />
        </Route>

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <Navigate
              to={status === "authenticated" ? "/dashboard" : "/"}
              replace
            />
          }
        />
      </Route>
    </Routes>
  );
}
