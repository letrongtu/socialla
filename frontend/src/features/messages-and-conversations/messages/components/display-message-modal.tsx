import dynamic from "next/dynamic";

const MessageEditor = dynamic(
  () =>
    import(
      "@/features/messages-and-conversations/messages/components/message-editor"
    ),
  { ssr: false }
);

import { UserType } from "@/features/auth/types";
import { DisplayMessageModalHeader } from "./display-message-modal-header";
import { useGetUser } from "@/features/auth/api/use-get-user";
import { MessageList } from "./message-list";
import { useMessageModal } from "../store/use-message-modal";

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
  const { data: otherUser, isLoading: isLoadingOtherUserData } =
    useGetUser(otherUserId);

  if (!otherUser || !currentUser.id) {
    return null;
  }

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
        <MessageEditor
          userIds={[otherUserId]}
          senderId={currentUser.id}
          conversationId={conversationId}
        />
      </div>
    </div>
  );
};
