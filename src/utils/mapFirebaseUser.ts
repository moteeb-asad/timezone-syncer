import { getUserPlan } from "../services/user.service";

export const mapFirebaseUser = async (user: any) => {
  const [firstName, ...rest] = (user.displayName || "").split(" ");

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
