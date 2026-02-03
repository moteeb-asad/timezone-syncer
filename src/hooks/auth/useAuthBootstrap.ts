import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { setAuthenticated, setGuest } from '../../slices/userSlice';
import { mapFirebaseUser, fetchUserPlanData } from '../../utils/mapFirebaseUser';
import type { RootState, AppDispatch } from '../../store';

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
      console.warn('Firebase auth not initialized');
      dispatch(setGuest());
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
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
        } catch (error) {
          console.error('Error syncing auth state:', error);
          dispatch(setGuest());
        }
      } else {
        dispatch(setGuest());
      }
    });

    return () => unsubscribe();
  }, [dispatch, status]);
};
