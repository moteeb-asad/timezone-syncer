import type { User } from "./user";

export interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
  requiresAuth: boolean;
  mobileOnly?: boolean;
}

export interface HeaderProps {
  user: User | null;
  navigation: NavigationItem[];
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onLogout: () => void;
}

export interface NavigationProps {
  items: NavigationItem[];
  user: User | null;
}

export interface MobileMenuProps {
  isOpen: boolean;
  items: NavigationItem[];
  user: User | null;
  onClose: () => void;
}
