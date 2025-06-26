import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, isFirebaseReady } from "../lib/firebase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseReady || !auth) {
      // If Firebase isn't ready, just set loading to false
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
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
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isFirebaseReady,
  };
};
