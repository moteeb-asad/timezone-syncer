import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useAuth } from "../../hooks/auth/useAuth";
import { useState, useMemo } from "react";
import { clearUser, setIsRegistering } from "../../slices/userSlice";
import type { NavigationItem } from "../../types/layout";

export const Layout = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const result = await logout();
    if (!result.error) {
      dispatch(clearUser());
      navigate("/");
    } else {
      console.error("Logout failed:", result.error);
    }
  };

  const navigation = useMemo(() => {
    const items: NavigationItem[] = [
      {
        name: "Home",
        href: "/",
        current: location.pathname === "/",
        requiresAuth: false,
      },
    ];

    // Add authenticated-only navigation items
    if (user) {
      items.push(
        {
          name: "Dashboard",
          href: "/dashboard",
          current: location.pathname === "/dashboard",
          requiresAuth: true,
        },
        {
          name: "Premium",
          href: "/premium",
          current: location.pathname === "/premium",
          requiresAuth: true,
        },
        {
          name: "Account",
          href: "/account",
          current: location.pathname === "/account",
          requiresAuth: true,
        }
      );
    }

    return items;
  }, [location.pathname, user]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0">
                <span className="text-lg md:text-xl font-bold text-primary whitespace-nowrap">
                  Timezone Syncer
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex md:items-center md:ml-8 space-x-4">
                {navigation.map((item) => {
                  // Skip "Home" when user is logged in
                  if (user && item.name === "Home") return null;

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        item.current
                          ? "bg-primary-light text-primary"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side - User info and auth buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="hidden md:block text-sm text-gray-600 truncate max-w-[200px]">
                    {user.firstName} {user.lastName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary whitespace-nowrap"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                    onClick={() => dispatch(setIsRegistering(false))}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-md text-sm font-medium"
                    onClick={() => dispatch(setIsRegistering(true))}
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-2">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item) => {
                  // Skip "Home" when user is logged in
                  if (user && item.name === "Home") return null;

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        item.current
                          ? "bg-primary-light text-primary"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                {user && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content with top padding for fixed header */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Timezone Syncer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
