import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { HeaderChatEditButton } from "./header-chat-edit-button";
import { useGetConversations } from "../api/use-get-conversations";
import { ConversationCard } from "./conversation-card";

export const HeaderChatModal = () => {
  const router = useRouter();

  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useCurrentUser();

  const {
    data: conversations,
    isLoading: isLoadingConversations,
    canLoadMore: canLoadMoreConversations,
    loadMore: loadMoreconversations,
  } = useGetConversations(currentUser?.id ? currentUser.id : null);

  const handleLoadMore = () => {
    if (canLoadMoreConversations) {
      loadMoreconversations();
    }
  };

  return (
    <div className="max-h-[50rem] flex flex-col gap-y-2 max-w-96  lg:w-96">
      <div className="flex flex-col gap-y-3 py-4 px-4">
        <div className="w-full flex items-center justify-between">
          <p className="text-2xl font-bold">Chats</p>

          <HeaderChatEditButton messages={[]} />
        </div>
      </div>

      <div className="flex flex-col gap-y-3 px-2 max-h-[43rem] overflow-auto custom-scrollbar">
        {conversations.map((conversation, index) => (
          <ConversationCard key={index} conversation={conversation} />
        ))}
      </div>

      {canLoadMoreConversations && (
        <div
          onClick={handleLoadMore}
          className="w-full flex items-center justify-center py-2 rounded-sm hover:bg-[#c9ccd1]/30 cursor-pointer group/load-more"
        >
          <p className="text-sm font-semibold text-[#1823ab] group-hover/load-more:underline">
            Load more conversations
          </p>
        </div>
      )}
    </div>
  );
};
