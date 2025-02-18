import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { UserType } from "@/features/auth/types";

import { SearchUserType } from "@/features/search/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserButtonProps {
  user: UserType | SearchUserType;
  activeOnClick?: boolean;
}

export const UserButton = ({ user, activeOnClick = true }: UserButtonProps) => {
  const router = useRouter();

  const avatarFallback = user.firstName?.charAt(0).toUpperCase();

  return (
    <Avatar
      onClick={() => {
        if (activeOnClick) {
          router.push(`/profile/${user.id}`);
        }
      }}
      className={cn(
        "rounded size-11 transition cursor-pointer",
        activeOnClick && "hover:opacity-75"
      )}
    >
      {user.profilePictureUrl && (
        <AvatarImage alt={user.firstName} src={user.profilePictureUrl} />
      )}

      <AvatarFallback className="rounded-full bg-custom-gradient text-white font-semibold text-xl">
        {avatarFallback}
      </AvatarFallback>
    </Avatar>
  );
};
