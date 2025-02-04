import { useCurrentUser } from "@/features/auth/api/use-current-user";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CurrentUserButton = () => {
  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useCurrentUser();
  if (!currentUser) {
    return null;
  }

  const { firstName, lastName, profilePictureUrl } = currentUser;

  const avatarFallback = firstName?.charAt(0).toUpperCase();

  return (
    <button>
      <Avatar className="rounded size-10 hover:opacity-75 transition">
        <AvatarImage alt={firstName} src={profilePictureUrl} />
        <AvatarFallback className="rounded-full bg-custom-gradient text-white font-semibold text-lg">
          {avatarFallback}
        </AvatarFallback>
      </Avatar>
    </button>
  );
};
