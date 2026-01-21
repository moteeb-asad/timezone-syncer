import { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { HeaderProps } from "../../types/layout";
import { setIsRegistering } from "../../slices/userSlice";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";

const Header = memo(
  ({ user, navigation, isMenuOpen, onToggleMenu, onLogout }: HeaderProps) => {
    const dispatch = useDispatch();

    const handleLoginClick = useCallback(() => {
      dispatch(setIsRegistering(false));
    }, [dispatch]);

    const handleSignUpClick = useCallback(() => {
      dispatch(setIsRegistering(true));
    }, [dispatch]);

    return (
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
              <Navigation items={navigation} user={user} />
            </div>

            {/* Right side - User info and auth buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="hidden md:block text-sm text-gray-600 truncate max-w-[200px]">
                    {user.firstName} {user.lastName}
                  </span>
                  <button
                    onClick={onLogout}
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
                    onClick={handleLoginClick}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-md text-sm font-medium"
                    onClick={handleSignUpClick}
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {/* Mobile menu button */}
              <button
                onClick={onToggleMenu}
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
          <MobileMenu
            isOpen={isMenuOpen}
            items={navigation}
            user={user}
            onClose={onToggleMenu}
          />
        </div>
      </nav>
    );
  }
);

Header.displayName = "Header";

export default Header;
