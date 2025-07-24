import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/login";
import { Premium } from "../pages/Premium";
import { TimezoneManager } from "../components/TimezoneManager";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Layout } from "../components/Layout";
import { Account } from "../components/Account";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export function AppRoutes() {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Root Route - redirect to dashboard if authenticated */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <TimezoneManager isPremium={false} />
          )
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <TimezoneManager isPremium={false} />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/premium"
        element={
          <ProtectedRoute>
            <Layout>
              <Premium />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Layout>
              <Account />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to login if not authenticated, dashboard if authenticated */}
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}
 