import { memo } from "react";
import { Link } from "react-router-dom";
import type { NavigationProps } from "../../types/layout";

const Navigation = memo(({ items, user }: NavigationProps) => {
  return (
    <div className="hidden md:flex md:items-center md:ml-8 space-x-4">
      {items.map((item) => {
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
  );
});

Navigation.displayName = "Navigation";

export default Navigation;
