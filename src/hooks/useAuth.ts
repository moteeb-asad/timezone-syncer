import { useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, isFirebaseReady } from "../lib/firebase";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../slices/userSlice";

export const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFirebaseReady || !auth) {
      return;
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (!isFirebaseReady || !auth) {
      return {
        user: null,
        error: new Error(
          "Firebase is not configured. Please add your Firebase configuration."
        ),
      };
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      dispatch(
        setUser({
          user: {
            uid: result.user.uid,
            email: result.user.email,
          },
          token,
        })
      );
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  };

  const register = async (email: string, password: string) => {
    if (!isFirebaseReady || !auth) {
      return {
        user: null,
        error: new Error(
          "Firebase is not configured. Please add your Firebase configuration."
        ),
      };
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  };

  const logout = async () => {
    if (!isFirebaseReady || !auth) {
      return { error: new Error("Firebase is not configured.") };
    }

    try {
      // Clear Redux state first
      dispatch(clearUser());

      // Sign out from Firebase
      await signOut(auth);

      return { error: null };
    } catch (error) {
      console.error("Logout error:", error);
      return { error: error as Error };
    }
  };

  return {
    loading: false,
    login: login,
    register: register,
    logout: logout,
    isFirebaseReady: true,
  };
};
