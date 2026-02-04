import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { setAuthenticated, setGuest, updatePlan } from "../../slices/userSlice";
import {
  mapFirebaseUser,
  fetchUserPlanData,
} from "../../utils/mapFirebaseUser";
import { subscribeToUserPlan } from "../../services/user.service";
import type { RootState, AppDispatch } from "../../store";

/**
 * Bootstrap authentication state on app load
 * Detects if user is logged in and syncs with Redux
 * Fetches plan/limits from Firestore
 */
export const useAuthBootstrap = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase auth not initialized");
      dispatch(setGuest());
      return;
    }

    let unsubscribeFromPlan: (() => void) | null = null;

    const unsubscribeFromAuth = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const token = await firebaseUser.getIdToken();
            const mappedUser = await mapFirebaseUser(firebaseUser);
            const { plan, maxTimezones } = await fetchUserPlanData(
              firebaseUser.uid
            );

            dispatch(
              setAuthenticated({
                user: mappedUser,
                token,
                plan,
                maxTimezones,
              })
            );

            // Subscribe to real-time plan updates
            unsubscribeFromPlan = subscribeToUserPlan(
              firebaseUser.uid,
              (updatedPlan, updatedMaxTimezones) => {
                dispatch(
                  updatePlan({
                    plan: updatedPlan,
                    maxTimezones: updatedMaxTimezones,
                  })
                );
              }
            );
          } catch (error) {
            console.error("Error syncing auth state:", error);
            dispatch(setGuest());
          }
        } else {
          // Clean up plan subscription when user logs out
          if (unsubscribeFromPlan) {
            unsubscribeFromPlan();
            unsubscribeFromPlan = null;
          }
          dispatch(setGuest());
        }
      }
    );

    return () => {
      unsubscribeFromAuth();
      if (unsubscribeFromPlan) {
        unsubscribeFromPlan();
      }
    };
  }, [dispatch, status]);
};
