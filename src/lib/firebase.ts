import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? undefined,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? undefined,
};

// Remove undefined values from config
const cleanConfig = Object.fromEntries(
  Object.entries(firebaseConfig).filter(([_, value]) => value !== undefined)
);

// Check if Firebase is configured
const isFirebaseConfigured = Object.keys(cleanConfig).length === 6;

// Initialize Firebase only if configured
let app;
let auth: Auth | undefined;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(cleanConfig);
    auth = getAuth(app);
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
} else {
  console.warn(
    "Firebase not configured. Please check your environment variables."
  );
}

export { auth };
export const isFirebaseReady = !!auth;
export default app;
