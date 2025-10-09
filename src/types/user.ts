// User Interface
export interface UserState {
  user: {
    uid: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    isPremium?: boolean;
  } | null;
  token: string | null;
  isRegistering: boolean;
}
