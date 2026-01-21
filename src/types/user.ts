// User Interface
export interface User {
  uid: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  isPremium?: boolean;
}

export interface UserState {
  user: User | null;
  token: string | null;
  isRegistering: boolean;
}
