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
      <>
        <nav className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-accent text-3xl font-bold">
                schedule
              </span>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Timezone Syncer
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                {/* Desktop Navigation */}
                <Navigation items={navigation} user={user} />
              </div>
              <div className="flex items-center gap-3 pl-6 md:border-l border-slate-200">
                {user ? (
                  <>
                    <span className="hidden md:block text-sm font-semibold text-slate-700">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <img
                      alt="Profile"
                      className="h-9 w-9 hidden md:block rounded-full border-2 border-slate-100 object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKTR3-3K-UFgEMq9QdDhWNkfBdR2DMhHVv9bVASKfTKrD-MrbPGr6XAga6WEsRVJn1EAT2ITTyIhbgfNZ7HDut5DcsXoyXREH97wOQf4MvYWETNfC1m24q9qJQ8CSy-5SATxRQLOGU9W7UjChJ0k-cyI6rvoVT1UVaJmikgb_3fUQKzNAh2CL2QKzHNrDR6bNPjQSe3DxAmn8f2ogGzRm7_oUP1InkBW-7Bp_nYuSZAGLU0TUZfDII2uEfiBEL88vrSDOydMB90YrM"
                    />
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
          </div>
        </nav>
        {/* Mobile menu */}
        <MobileMenu
          isOpen={isMenuOpen}
          items={navigation}
          user={user}
          onClose={onToggleMenu}
        />
      </>
    );
  }
);

Header.displayName = "Header";

export default Header;
