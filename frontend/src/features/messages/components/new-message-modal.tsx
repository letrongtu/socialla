import { useState } from "react";
import { useGetFriends } from "@/features/friendships/api/use-get-friends";
import { UserType } from "@/features/auth/types";

import { Separator } from "@/components/ui/separator";
import { SearchUserList } from "./search-user-list";
import { ContactContainer } from "@/components/contact-section/contact-container";
import { useMessageModal } from "../store/use-message-modal";
import { Loader2 } from "lucide-react";
import { useSearch } from "@/features/search/api/use-search";

interface NewMessageModal {
  currentUser: UserType;
}

export const NewMessageModal = ({ currentUser }: NewMessageModal) => {
  const [{ open }, setOpen] = useMessageModal();

  const [query, setQuery] = useState("");

  const { data: friendIds, isLoading: isLoadingFriendIds } = useGetFriends(
    currentUser?.id ? currentUser.id : null,
    10
  );
  const { data: resultData, isLoading: isLoadingResultData } = useSearch(
    query,
    currentUser.id ? currentUser.id : null
  );

  return (
    <div className="flex flex-col overflow-auto custom-scrollbar">
      <div className="px-3.5 w-full flex gap-x-2">
        <p className="text-base text-muted-foreground">To: </p>

        <input
          autoFocus={open}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-sm font-medium focus:outline-none"
        />
      </div>

      <Separator className="w-full mt-2" />

      {(isLoadingFriendIds || isLoadingResultData) && (
        <div className="w-full h-14 flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}

      {resultData && resultData.results && (
        <SearchUserList searchedUsers={resultData.results} />
      )}

      {!resultData && friendIds && (
        <div className="flex flex-col py-2">
          <p className="px-2 text-sm font-semibold text-muted-foreground">
            Friends
          </p>
          <ContactContainer currentUser={currentUser} friendIds={friendIds} />
        </div>
      )}
    </div>
  );
};
