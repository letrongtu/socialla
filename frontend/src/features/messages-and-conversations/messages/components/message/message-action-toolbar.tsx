import { MessageType } from "../../types";

import { Hint } from "@/components/ui/hint";
import { EmojiPopover } from "@/components/emoji-popover";
import { ReplyButton } from "./action-buttons/reply-button";

import { FaReply, FaTrash } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";

interface MessageActionToolbarProps {
  message: MessageType;
  setIsMessageHovered: (isHovered: boolean) => void;
}
export const MessageActionToolbar = ({
  message,
  setIsMessageHovered,
}: MessageActionToolbarProps) => {
  return (
    <div className="flex justify-center px-2">
      <Hint label="Unsend">
        <div className="p-1.5 rounded-full text-gray-600/90 hover:bg-[#c9ccd1]/50 cursor-pointer">
          <FaTrash className="size-3" />
        </div>
      </Hint>

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
