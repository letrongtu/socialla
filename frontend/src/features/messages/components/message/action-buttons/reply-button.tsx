import { useReplyMessage } from "../../../store/use-reply-message";

import { Hint } from "@/components/ui/hint";
import { FaReply } from "react-icons/fa";
import { MessageType } from "../../../types";

interface ReplyButtonProps {
  message: MessageType;
}

export const ReplyButton = ({ message }: ReplyButtonProps) => {
  const [, setOpen] = useReplyMessage();
  return (
    <Hint label="Reply">
      <div
        onClick={() => setOpen({ open: true, message: message })}
        className="p-1.5 rounded-full text-gray-600/90 hover:bg-[#c9ccd1]/50 cursor-pointer"
      >
        <FaReply className="size-3.5" />
      </div>
    </Hint>
  );
};
