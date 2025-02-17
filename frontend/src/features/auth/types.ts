export type SignInFlow = "signIn" | "signUp";

export type UserType = {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: Date | null;
  email: string | null;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
  isActive: boolean | null;
  lastActiveAt: Date | null;
  createdAt: Date | null;
};
