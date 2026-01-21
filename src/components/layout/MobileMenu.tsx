import { memo } from "react";
import { Link } from "react-router-dom";
import type { MobileMenuProps } from "../../types/layout";

const MobileMenu = memo(({ isOpen, items, user, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-gray-200 py-2">
      <div className="space-y-1 pb-3 pt-2">
        {items.map((item) => {
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
              onClick={onClose}
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
  );
});

MobileMenu.displayName = "MobileMenu";

export default MobileMenu;
