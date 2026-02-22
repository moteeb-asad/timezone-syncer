import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes intelligently
 * - Handles conflicts (e.g., px-4 + px-3 = px-3 wins)
 * - Removes duplicates
 * - Supports conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
