import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../slices/userSlice";
import { authService } from "../../services/auth.service";
import { mapFirebaseUser } from "../../utils/mapFirebaseUser";
import { mapFirebaseError } from "../../utils/mapFirebaseError";
import { auth } from "../../lib/firebase";

export const useAuth = () => {
  const dispatch = useDispatch();

  const login = async (email: string, password: string) => {
    try {
      const result = await authService.loginWithEmail(email, password);
      const token = await result.user.getIdToken();

      dispatch(
        setUser({
          user: mapFirebaseUser(result.user),
          token,
        })
      );

      return { user: result.user };
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      console.error("Error code:", error?.code);
      console.error("Error message:", error?.message);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return { error: mapFirebaseError(error) };
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const result = await authService.registerWithEmail(email, password);
      await authService.updateUserName(result.user, firstName, lastName);

      const token = await result.user.getIdToken();

      dispatch(
        setUser({
          user: mapFirebaseUser(result.user),
          token,
        })
      );

      return { user: result.user };
    } catch (error) {
      console.error("Firebase Registration Error:", error);
      return { error: mapFirebaseError(error) };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await authService.loginWithGoogle();
      const token = await result.user.getIdToken();

      dispatch(
        setUser({
          user: mapFirebaseUser(result.user),
          token,
        })
      );

      return { user: result.user };
    } catch (error: any) {
      console.error("Firebase Google Sign-In Error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error customData:", error.customData);

      if (error.code === "auth/account-exists-with-different-credential") {
        return {
          error: "ACCOUNT_EXISTS",
          email: error.customData?.email,
          credential: error.customData?.credential,
        };
      }
      return { error: mapFirebaseError(error) };
    }
  };

  const linkGoogleAccount = async (
    email: string,
    password: string,
    credential: any
  ) => {
    try {
      const result = await authService.loginWithEmail(email, password);
      await authService.linkGoogleCredential(result.user, credential);

      const token = await result.user.getIdToken();
      dispatch(
        setUser({
          user: mapFirebaseUser(result.user),
          token,
        })
      );
    } catch (error) {
      console.error("Firebase Link Google Account Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    dispatch(clearUser());
    if (auth) {
      await auth.signOut();
    }
  };

  return {
    login,
    register,
    signInWithGoogle,
    linkGoogleAccount,
    logout,
  };
};
