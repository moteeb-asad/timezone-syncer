import { memo } from "react";
import { Link } from "react-router-dom";
import type { NavigationProps } from "../../types/layout";

const Navigation = memo(({ items, user }: NavigationProps) => {
  return (
    <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
      {items.map((item) => {
        // Skip "Home" when user is logged in
        if (user && item.name === "Home") return null;

        return (
          <Link
            key={item.name}
            to={item.href}
            className={`pb-1 ${
              item.current
                ? "text-primary-accent border-primary-accent border-b-2"
                : "hover:text-primary-accent transition-colors"
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
