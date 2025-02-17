import { useGetFriends } from "@/features/friendships/api/use-get-friends";
import { ContactContainer } from "./contact-container";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { Search } from "lucide-react";

export const ContactSection = () => {
  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useCurrentUser();
  const { data: friendIds, isLoading: isLoadingFriendIds } = useGetFriends(
    currentUser?.id ? currentUser.id : null
  );

  if (!currentUser) {
    return null;
  }

  return (
    <div className="hidden lg:flex lg:min-w-96 flex-col gap-y-2 px-4">
      <div className="flex items-center justify-between px-2">
        <p className="text-lg font-semibold text-muted-foreground">Contacts</p>
        <div className="p-2 rounded-full hover:bg-[#c9ccd1]/30 cursor-pointer">
          <Search className="size-5 text-muted-foreground" />
        </div>
      </div>

      <ContactContainer friendIds={friendIds} currentUser={currentUser} />
    </div>
  );
};
