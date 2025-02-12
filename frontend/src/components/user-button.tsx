import { SearchUserType } from "@/features/search/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserButtonProps {
  user:
    | {
        id: string | undefined;
        firstName: string | undefined;
        lastName: string | undefined;
        dateOfBirth: Date | undefined;
        email: string | undefined;
        phoneNumber: string | undefined;
        profilePictureUrl: string | undefined;
        createdAt: Date | undefined;
      }
    | SearchUserType;
}

export const UserButton = ({ user }: UserButtonProps) => {
  const avatarFallback = user.firstName?.charAt(0).toUpperCase();

  return (
    <Avatar className="rounded size-11 hover:opacity-75 transition cursor-pointer">
      <AvatarImage alt={user.firstName} src={user.profilePictureUrl} />
      <AvatarFallback className="rounded-full bg-custom-gradient text-white font-semibold text-xl">
        {avatarFallback}
      </AvatarFallback>
    </Avatar>
  );
};
