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
  const { data: otherUserData, isLoading: isLoadingOtherUserData } =
    useGetUser(otherUserId);

  if (!otherUserData || !currentUser.id) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <DisplayMessageModalHeader
        otherUser={otherUserData}
        currentUser={currentUser}
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
