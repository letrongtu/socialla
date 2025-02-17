export type SignInFlow = "signIn" | "signUp";

export type UserType = {
  id: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  dateOfBirth: Date | undefined;
  email: string | undefined;
  phoneNumber: string | undefined;
  profilePictureUrl: string | undefined;
  isActive: boolean | undefined;
  lastActiveAt: Date | undefined;
  createdAt: Date | undefined;
};
