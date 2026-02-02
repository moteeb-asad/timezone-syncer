import { memo } from "react";
import { Link } from "react-router-dom";
import type { NavigationProps } from "../../types/layout";

interface ExtendedNavigationProps extends NavigationProps {
  variant?: "desktop" | "mobile";
  onItemClick?: () => void;
}

const Navigation = memo(
  ({
    items,
    user,
    variant = "desktop",
    onItemClick,
  }: ExtendedNavigationProps) => {
    const isDesktop = variant === "desktop";

    const containerClass = isDesktop
      ? "hidden md:flex gap-8 text-sm font-medium text-slate-600"
      : "flex flex-col space-y-2";

    const itemClass = (isCurrent: boolean) => {
      if (isDesktop) {
        return `pb-1 ${
          isCurrent
            ? "text-primary-accent border-primary-accent border-b-2"
            : "hover:text-primary-accent transition-colors"
        }`;
      } else {
        return `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
          isCurrent
            ? "bg-primary/10 text-primary"
            : "text-slate-600 hover:bg-slate-50"
        }`;
      }
    };

    return (
      <div className={containerClass}>
        {items.map((item) => {
          // Skip "Home" when user is logged in
          if (user && item.name === "Home") return null;

          // Desktop: Skip mobile-only items
          if (isDesktop && item.mobileOnly) return null;

          // Mobile: Show all items

          return (
            <Link
              key={item.name}
              to={item.href}
              className={itemClass(item.current)}
              onClick={onItemClick}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    );
  }
);

Navigation.displayName = "Navigation";

export default Navigation;
