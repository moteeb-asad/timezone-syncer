import { useMemo } from "react";
import type { NavigationItem } from "../../types/layout";
import type { User } from "../../features/user/types";

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

      // Account Settings - available to authenticated users
      items.push({
        name: "Account Settings",
        href: "/account",
        current: pathname === "/account",
        requiresAuth: true,
        mobileOnly: true,
      });
    }

    // Login - only for non-authenticated users, mobile only
    if (!user) {
      items.push({
        name: "Login",
        href: "/login",
        current: pathname === "/login",
        requiresAuth: false,
        mobileOnly: true,
      });
    }

    // Signup - only for non-authenticated users, mobile only
    if (!user) {
      items.push({
        name: "Signup",
        href: "/signup",
        current: pathname === "/signup",
        requiresAuth: false,
        mobileOnly: true,
      });
    }

    return items;
  }, [pathname, user]);
};
