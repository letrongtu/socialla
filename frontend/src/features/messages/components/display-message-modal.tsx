import dynamic from "next/dynamic";

const MessageEditor = dynamic(
  () => import("@/features/messages/components/message-editor"),
  { ssr: false }
);

import { UserType } from "@/features/auth/types";
import { DisplayMessageModalHeader } from "./display-message-modal-header";
import { useGetUser } from "@/features/auth/api/use-get-user";
import { MessageList } from "./message-list";
import { useReplyMessage } from "../store/use-reply-message";
import { MdClose } from "react-icons/md";

interface DisplayMessageModalProps {
  currentUser: UserType;
  otherUserId: string;
  conversationId: string | null;
}

export const DisplayMessageModal = ({
  currentUser,
  otherUserId,
  conversationId,
}: DisplayMessageModalProps) => {
  const [{ open: replyingMessage, message: parentMessage }, setOpen] =
    useReplyMessage();

  const { data: otherUser, isLoading: isLoadingOtherUserData } =
    useGetUser(otherUserId);

  if (!otherUser || !currentUser.id) {
    return null;
  }

  const parentMessageContent = parentMessage?.content?.join(" ");

  const truncateContent =
    parentMessageContent && parentMessageContent.length > 70
      ? parentMessageContent.slice(0, 80) + "..."
      : parentMessageContent;

  return (
    <div className="w-full h-full flex flex-col justify-between ">
      <DisplayMessageModalHeader
        otherUser={otherUser}
        currentUser={currentUser}
      />

      <MessageList
        currentUser={currentUser}
        otherUser={otherUser}
        conversationId={conversationId}
      />

      <div className="border-t-[1px] border-[#c9ccd1]/30">
        {replyingMessage && (
          <div className="max-w-80 break-words px-4 py-2">
            <div className="flex flex-row items-center justify-between">
              {parentMessage?.senderId === currentUser.id && (
                <p className="text-sm">Replying to yourself</p>
              )}

              {parentMessage?.senderId !== currentUser.id && (
                <p className="text-sm">
                  Replying to{" "}
                  <span className="font-semibold">
                    {otherUser.firstName} {otherUser.lastName}
                  </span>
                </p>
              )}

              <div
                onClick={() => setOpen({ open: false, message: null })}
                className="p-1 rounded-full text-gray-600/90 hover:bg-[#c9ccd1]/50 cursor-pointer"
              >
                <MdClose className="size-3.5" />
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{truncateContent}</p>
          </div>
        )}
        <MessageEditor
          userIds={[otherUserId]}
          senderId={currentUser.id}
          conversationId={conversationId}
          parentMessageId={
            replyingMessage && parentMessage ? parentMessage.id : undefined
          }
        />
      </div>
    </div>
  );
};
