import { UserButton } from "@/components/user-button";

import { UserType } from "@/features/auth/types";
import { SearchUserType } from "@/features/search/types";

import { useMessageModal } from "../../store/use-message-modal";
import { useGetDmConversationId } from "@/features/conversations/api/use-get-dm-conversation-id";

interface SearchUserCardProps {
  user: SearchUserType;
  currentUser: UserType;
}
export const SearchUserCard = ({ user, currentUser }: SearchUserCardProps) => {
  const [, setOpen] = useMessageModal();

  const { data: conversationId, isLoading: isLoadingConversationId } =
    useGetDmConversationId(user.id, currentUser.id ? currentUser.id : null);

  return (
    <div
      onClick={() => {
        setOpen({
          open: true,
          userId: user.id,
          conversationId: conversationId,
        });
      }}
      className="flex items-center gap-x-3 py-2 px-2 rounded-lg hover:bg-[#c9ccd1]/30 cursor-pointer"
    >
      <UserButton user={user} activeOnClick={false} />
      <p className="text-base font-semibold">{user.fullName}</p>
    </div>
  );
};
