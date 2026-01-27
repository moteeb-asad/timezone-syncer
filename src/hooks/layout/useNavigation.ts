import { useMemo } from "react";
import type { NavigationItem } from "../../types/layout";
import type { User } from "../../types/user";

export const useNavigation = (pathname: string, user: User | null) => {
  return useMemo(() => {
    const items: NavigationItem[] = [];

    // Home - only for non-authenticated users
    if (!user) {
      items.push({
        name: "Home",
        href: "/",
        current: pathname === "/",
        requiresAuth: false,
      });
    }

    // About - available to all users
    items.push({
      name: "About",
      href: "/about",
      current: pathname === "/about",
      requiresAuth: false,
    });

    // Premium - available to all users
    items.push({
      name: "Premium",
      href: "/premium",
      current: pathname === "/premium",
      requiresAuth: false,
    });

    // Authenticated navigation items
    if (user) {
      items.unshift({
        name: "Dashboard",
        href: "/dashboard",
        current: pathname === "/dashboard",
        requiresAuth: true,
      });
    }

    return items;
  }, [pathname, user]);
};
