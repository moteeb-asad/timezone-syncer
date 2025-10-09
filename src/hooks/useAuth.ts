import { useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
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
      console.log("Logging in with email and password");
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      dispatch(
        setUser({
          user: {
            uid: result.user.uid,
            email: result.user.email,
            firstName: result.user.displayName?.split(" ")[0] || null,
            lastName: result.user.displayName?.split(" ")[1] || null,
          },
          token,
        })
      );
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    if (!isFirebaseReady || !auth) {
      return {
        user: null,
        error: new Error(
          "Firebase is not configured. Please add your Firebase configuration."
        ),
      };
    }

    try {
      console.log("Registering with email and password");
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's profile with their full name
      if (result.user) {
        await updateProfile(result.user, {
          displayName: `${firstName} ${lastName}`,
        });

        // Get the token and dispatch user data
        const token = await result.user.getIdToken();
        dispatch(
          setUser({
            user: {
              uid: result.user.uid,
              email: result.user.email,
              firstName,
              lastName,
            },
            token,
          })
        );
      }

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
      dispatch(clearUser());
      await signOut(auth);
      return { error: null };
    } catch (error) {
      console.error("Logout error:", error);
      return { error: error as Error };
    }
  };

  return { login, register, logout };
};
