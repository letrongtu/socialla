import { useState } from "react";
import { useGetFriends } from "@/features/friendships/api/use-get-friends";
import { UserType } from "@/features/auth/types";

import { Separator } from "@/components/ui/separator";
import { SearchUserList } from "./search-user-list";
import { ContactContainer } from "@/components/contact-section/contact-container";
import { useMessageModal } from "../store/use-message-modal";

interface NewMessageModal {
  currentUser: UserType;
}

export const NewMessageModal = ({ currentUser }: NewMessageModal) => {
  const [{ open }, setOpen] = useMessageModal();

  const { data: friendIds, isLoading: isLoadingFriendIds } = useGetFriends(
    currentUser?.id ? currentUser.id : null,
    10
  );

  const [message, setMessage] = useState("");
  const [userIds, setUserIds] = useState<string[] | null>(null);

  //TODO: Get pp and search api
  return (
    <div className="flex flex-col overflow-auto custom-scrollbar">
      <div className="px-3.5 w-full flex gap-x-2">
        <p className="text-base text-muted-foreground">To: </p>

        <input
          autoFocus={open}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full text-sm font-medium focus:outline-none"
        />
      </div>

      <Separator className="w-full mt-2" />

      {userIds && <SearchUserList />}

      {!userIds && friendIds && (
        <ContactContainer currentUser={currentUser} friendIds={friendIds} />
      )}
    </div>
  );
};
