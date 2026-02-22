import type { ReactNode } from "react";

interface PremiumFeatureProps {
  isPremium: boolean;
  loading?: boolean;
  fallback?: ReactNode;
  minTimezones?: number;
  currentTimezones?: number;
  children: ReactNode;
}

export const PremiumFeature = ({
  isPremium,
  loading = false,
  fallback = null,
  minTimezones,
  currentTimezones,
  children,
}: PremiumFeatureProps) => {
  // Show nothing while loading (prevents flash)
  if (loading) {
    return null;
  }

  // Check premium status
  if (!isPremium) {
    return <>{fallback}</>;
  }

  // Check minimum timezone requirement if specified
  if (minTimezones && currentTimezones && currentTimezones < minTimezones) {
    return null;
  }

  return <>{children}</>;
};
