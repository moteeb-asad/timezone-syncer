import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Login } from "../pages/login";
import { Premium } from "../pages/Premium";
import { TimezoneManager } from "../components/TimezoneManager";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Layout } from "../components/Layout";

export function AppRoutes() {
  const { user } = useAuth();

  console.log("user", user);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Public Routes */}
      <Route path="/" element={<TimezoneManager isPremium={false} />} />

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

      {/* Catch all - redirect to login if not authenticated, dashboard if authenticated */}
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}
