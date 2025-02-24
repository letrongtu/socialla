import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getCreatedDisplayString } from "@/features/posts/helper/helper";
import { getLastActiveTimeString } from "@/utils/helper";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useMessageModal } from "@/features/messages/store/use-message-modal";
import { UserType } from "@/features/auth/types";
import { ReturnConversationType } from "../types";

import { EditChatButton } from "./edit-chat-button";
import { UseUpdateReadConversation } from "../api/use-update-read-conversation";

interface ConversationCardProps {
  conversation: ReturnConversationType;
  currentUser: UserType;
  setCurrentUtilButton: (currentButton: string) => void;
}

export const ConversationCard = ({
  conversation,
  currentUser,
  setCurrentUtilButton,
}: ConversationCardProps) => {
  const [, setOpen] = useMessageModal();

  const user = conversation.otherUser;
  const avatarFallback = user.firstName?.charAt(0).toUpperCase();

  const lastMessageContent = conversation.lastMessage.content?.join(" ");

  const truncateContent =
    lastMessageContent && lastMessageContent.length > 23
      ? lastMessageContent.slice(0, 23) + "..."
      : lastMessageContent;

  const { createdDisplayString } = getCreatedDisplayString(
    conversation.lastMessage.createdAt
  );

  const userLastActiveAt = getLastActiveTimeString(
    conversation.otherUser.lastActiveAt ?? new Date()
  );

  return (
    <div
      onClick={() => {
        setOpen({
          open: true,
          userId: user.id ? user.id : null,
          conversationId: conversation.conversation.id,
        });

        setCurrentUtilButton("");
      }}
      className="relative py-2 px-2 flex items-center gap-x-2 rounded-md hover:bg-[#c9ccd1]/20 cursor-pointer group/notification"
    >
      <div className="w-full flex items-center gap-x-4 ">
        <div className="relative flex justify-center">
          <Avatar className="rounded size-14 transition cursor-pointer">
            <AvatarImage alt={user.firstName} src={user.profilePictureUrl} />
            <AvatarFallback className="rounded-full bg-custom-gradient text-white font-semibold text-2xl">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          {user.isActive && (
            <div className="absolute -bottom-[0.1rem] -right-[0.1rem] w-4 h-4 flex items-center justify-center rounded-full bg-green-100 shadow-md shadow-black/20">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
            </div>
          )}

          {user.lastActiveAt && (
            <div className="absolute -bottom-[0.1rem] -right-[0.4rem] p-[0.12rem] flex items-center justify-center rounded-full bg-green-100 shadow-md shadow-black/20">
              <p className="text-[0.65rem] font-bold text-green-600">
                {userLastActiveAt}
              </p>
            </div>
          )}
        </div>

        <div className="max-w-64 flex flex-col justify-center break-words">
          <p className="font-semibold text-base">
            {user.firstName} {user.lastName}
          </p>

          <p
            className={cn(
              "text-sm text-muted-foreground",
              !conversation.isLastMessageRead && "text-black font-medium"
            )}
          >
            {truncateContent} &middot;{" "}
            <span className="text-xs font-normal">{createdDisplayString}</span>
          </p>
        </div>
      </div>

      {!conversation.isLastMessageRead && (
        <div className="flex items-center justify-end w-6">
          <div className={"size-3 rounded-full bg-[#1823ab]"} />
        </div>
      )}

      <EditChatButton
        currentUser={currentUser}
        conversation={conversation.conversation}
      />
    </div>
  );
};
