import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useAuth } from "../../hooks/auth/useAuth";
import { useState, useCallback } from "react";
import { clearUser } from "../../slices/userSlice";
import { useNavigation } from "../../hooks/layout/useNavigation";
import Header from "./Header";
import Footer from "./Footer";

export const Layout = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const navigation = useNavigation(location.pathname, user);

  const handleLogout = useCallback(async () => {
    const result = await logout();
    if (!result.error) {
      dispatch(clearUser());
      navigate("/");
    } else {
      console.error("Logout failed:", result.error);
    }
  }, [logout, dispatch, navigate]);

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        user={user}
        navigation={navigation}
        isMenuOpen={isMenuOpen}
        onToggleMenu={handleToggleMenu}
        onLogout={handleLogout}
      />

      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
