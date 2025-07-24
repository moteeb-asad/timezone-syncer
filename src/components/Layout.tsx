import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    const result = await logout();
    if (!result.error) {
      navigate("/");
    } else {
      console.error("Logout failed:", result.error);
    }
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      current: location.pathname === "/dashboard",
    },
    {
      name: "Premium",
      href: "/premium",
      current: location.pathname === "/premium",
    },
    {
      name: "Account",
      href: "/account",
      current: location.pathname === "/account",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center flex-1">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0">
                <span className="text-lg md:text-xl font-bold text-primary whitespace-nowrap">
                  Logo
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex md:items-center md:ml-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors hover:underline ${
                      item.current
                        ? "text-primary"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side - User info and logout */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="hidden md:block text-sm text-gray-600 truncate max-w-[200px]">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary whitespace-nowrap"
              >
                Logout
              </button>

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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 pt-4 pb-3">
              <div className="space-y-1">
                {navigation.map((item) => (
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
                ))}
                <div className="px-3 py-2 text-sm text-gray-500">
                  {user?.firstName} {user?.lastName}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-sm text-gray-600">
            © 2025 Timezone Syncer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
