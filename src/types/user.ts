// User Interface
export interface UserState {
  user: {
    uid: string;
    email: string | null;
    isPremium?: boolean;
  } | null;
  token: string | null;
}
