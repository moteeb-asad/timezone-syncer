export const mapFirebaseUser = (user: any) => {
  const [firstName, ...rest] = (user.displayName || "").split(" ");
  return {
    uid: user.uid,
    email: user.email,
    firstName: firstName || null,
    lastName: rest.join(" ") || null,
  };
};
