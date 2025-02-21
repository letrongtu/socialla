import { MessageType } from "../../types";

import { Hint } from "@/components/ui/hint";
import { EmojiPopover } from "@/components/emoji-popover";
import { ReplyButton } from "./action-buttons/reply-button";

import { FaReply, FaTrash } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import { DeleteButton } from "./action-buttons/delete-button";
import { UserType } from "@/features/auth/types";

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

      <Hint label="React">
        <EmojiPopover
          onEmojiSelect={() => {}}
          onOpen={() => setIsMessageHovered(true)}
          onClose={() => setIsMessageHovered(false)}
        >
          <div className="p-1.5 rounded-full text-gray-600/90 hover:bg-[#c9ccd1]/50 cursor-pointer">
            <BsEmojiSmile className="size-3.5" />
          </div>
        </EmojiPopover>
      </Hint>
    </div>
  );
};
