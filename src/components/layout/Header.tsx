import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { HeaderProps } from "../../types/layout";
import { setIsRegistering } from "../../features/user/slice";
import React from "react";
import MobileMenu from "./MobileMenu";

const Header = ({
  user,
  navigation,
  isMenuOpen,
  onToggleMenu,
  onLogout,
}: HeaderProps) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLoginClick = () => {
    dispatch(setIsRegistering(false));
  };
  const handleSignUpClick = () => {
    dispatch(setIsRegistering(true));
  };

  // Dropdown state for user menu
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const handleDropdownToggle = () => setDropdownOpen((open) => !open);
  const handleDropdownClose = () => setDropdownOpen(false);
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownOpen &&
        !(e.target as HTMLElement).closest(".user-dropdown-trigger") &&
        !(e.target as HTMLElement).closest(".user-dropdown-menu")
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Menu item class helper
  const baseClass =
    "px-5 py-1.5 rounded-full text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors";
  const activeClass = "bg-white shadow-sm !text-primary font-semibold";
  const getMenuClass = (path: string, extra = "") =>
    `${baseClass} ${location.pathname === path ? activeClass : ""} ${extra}`.trim();

  return (
    <>
      <div className="px-4 py-4 sticky top-0 z-50 pointer-events-none">
        <nav className="bg-white/90 backdrop-blur-md border border-white/40 shadow-floating rounded-3xl px-6 py-3 max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary-accent text-2xl md:text-3xl font-bold">
              schedule
            </span>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 hidden sm:block">
              Timezone Syncer
            </h1>
          </div>
          <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-slate-100/50 p-1 rounded-full flex items-center border border-slate-200/60">
              {user ? (
                <>
                  <Link className={getMenuClass("/")} to="/">
                    Dashboard
                  </Link>
                  <Link
                    className={getMenuClass(
                      "/premium",
                      "flex items-center gap-1.5"
                    )}
                    to="/premium"
                  >
                    Premium
                    <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                      PRO
                    </span>
                  </Link>
                  <Link className={getMenuClass("/about")} to="/about">
                    About
                  </Link>
                  <Link className={getMenuClass("/contact")} to="/contact">
                    Contact
                  </Link>
                </>
              ) : (
                <>
                  <Link className={getMenuClass("/")} to="/">
                    Home
                  </Link>
                  <Link
                    className={getMenuClass(
                      "/premium",
                      "flex items-center gap-1.5"
                    )}
                    to="/premium"
                  >
                    Premium
                    <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                      PRO
                    </span>
                  </Link>
                  <Link className={getMenuClass("/about")} to="/about">
                    About
                  </Link>
                  <Link className={getMenuClass("/contact")} to="/contact">
                    Contact
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={onToggleMenu}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex items-end gap-3 pl-4 border-l border-slate-200/60">
              {user ? (
                <div className="relative">
                  <button
                    className="user-dropdown-trigger flex items-center gap-2  rounded-lg transition-colors"
                    onClick={handleDropdownToggle}
                    type="button"
                  >
                    <span className="text-sm font-bold text-slate-800">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="material-symbols-outlined text-slate-400 text-lg">
                      expand_more
                    </span>
                  </button>
                  {dropdownOpen && (
                    <div className="user-dropdown-menu absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-floating py-2 z-50">
                      <Link
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-accent-vibrant transition-colors"
                        to="/account"
                        onClick={handleDropdownClose}
                      >
                        <span className="material-symbols-outlined text-lg">
                          settings
                        </span>
                        <span className="font-medium">Settings</span>
                      </Link>
                      <div className="my-1 border-t border-slate-100"></div>
                      <button
                        className="flex items-center gap-3 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 transition-colors w-full text-left"
                        onClick={() => {
                          handleDropdownClose();
                          onLogout();
                        }}
                      >
                        <span className="material-symbols-outlined text-lg">
                          logout
                        </span>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : null}

              {!user ? (
                <div className="relative group cursor-pointer">
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      className="hidden md:block text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                      onClick={handleLoginClick}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="hidden md:block bg-primary-accent text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
                      onClick={handleSignUpClick}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </nav>
      </div>
      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        items={navigation}
        user={user}
        onClose={onToggleMenu}
      />
    </>
  );
};

export default Header;
