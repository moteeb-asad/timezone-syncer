// User Interface
export interface User {
  uid: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  name?: string | null;
}

export interface UserState {
  status: "guest" | "authenticated" | "loading";
  user: User | null;
  token: string | null;
  plan: "free" | "premium";
  limits: {
    maxTimezones: number;
  };
  isRegistering: boolean;
}
