import { memo } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import Navigation from "./Navigation";
import type { MobileMenuProps } from "../../types/layout";

const MobileMenu = memo(({ isOpen, items, user, onClose }: MobileMenuProps) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl font-bold">
              schedule
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Timezone Syncer
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-0 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            <Navigation
              items={items}
              user={user}
              variant="mobile"
              onItemClick={onClose}
            />
          </ul>
        </nav>

        {/* User Info Footer */}
        {user && (
          <div className="p-4 bg-slate-50/50 border-t border-slate-100">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="relative">
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Free Plan
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-slate-200 text-rose-600 text-sm font-semibold rounded-lg hover:bg-rose-50 hover:border-rose-100 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
});

MobileMenu.displayName = "MobileMenu";

export default MobileMenu;
