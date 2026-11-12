import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the custom tokens in tailwind.config.js.
// Without this, `text-label` is read as a text colour and dropped
// next to `text-muted`, and `shadow-card` next to a shadow colour.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["label"] }],
      shadow: [{ shadow: ["card", "pop"] }],
    },
  },
});

/**
 * Merges Tailwind CSS classes intelligently
 * - Handles conflicts (e.g., px-4 + px-3 = px-3 wins)
 * - Removes duplicates
 * - Supports conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
