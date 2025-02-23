import { MessageType } from "../../types";

import { ReplyButton } from "./action-buttons/reply-button";

import { DeleteButton } from "./action-buttons/delete-button";
import { UserType } from "@/features/auth/types";
import { MessageReactionButton } from "../../../message-reactions/components/message-reaction-button";

interface MessageActionToolbarProps {
  message: MessageType;
  currentUser: UserType;
  setIsMessageHovered: (isHovered: boolean) => void;
}
export const MessageActionToolbar = ({
  message,
  currentUser,
  setIsMessageHovered,
}: MessageActionToolbarProps) => {
  return (
    <div className="flex justify-center px-2">
      <DeleteButton message={message} currentUser={currentUser} />

      <ReplyButton message={message} />

      <MessageReactionButton
        message={message}
        currentUser={currentUser}
        setIsMessageHovered={setIsMessageHovered}
      />
    </div>
  );
};
