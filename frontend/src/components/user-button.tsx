import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { UserType } from "@/features/auth/types";

import { SearchUserType } from "@/features/search/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserButtonProps {
  user: UserType | SearchUserType;
  activeOnClick?: boolean;
  size?: number;
}

export const UserButton = ({
  user,
  activeOnClick = true,
  size = 11,
}: UserButtonProps) => {
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
        "rounded transition cursor-pointer",
        activeOnClick && "hover:opacity-75",
        `size-${size}`
      )}
    >
      {user.profilePictureUrl && (
        <AvatarImage alt={user.firstName} src={user.profilePictureUrl} />
      )}

      <AvatarFallback
        className={cn(
          "rounded-full bg-custom-gradient text-white font-semibold",
          size > 9 ? "text-xl" : "text-lg",
          size > 13 && "text-2xl"
        )}
      >
        {avatarFallback}
      </AvatarFallback>
    </Avatar>
  );
};
