import type { User } from "firebase/auth";
import { getUserPlan } from "../features/user/services/user.service";

export const mapFirebaseUser = async (
  user: Pick<User, "uid" | "email" | "displayName">
) => {
  // No display name (an account made in the Firebase console): fall back
  // to the part of the email before "@", so the header is never blank.
  const emailName = (user.email ?? "").split("@")[0];
  const fallbackName = emailName
    ? emailName.charAt(0).toUpperCase() + emailName.slice(1)
    : "";
  const [firstName, ...rest] = (user.displayName || fallbackName).split(" ");

  return {
    uid: user.uid,
    email: user.email,
    firstName: firstName || null,
    lastName: rest.join(" ") || null,
  };
};

/**
 * Helper to fetch user plan and limits from Firestore
 * Called after successful auth to populate Redux with plan data
 */
export const fetchUserPlanData = async (uid: string) => {
  return await getUserPlan(uid);
};
