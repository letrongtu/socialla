import { UserType } from "@/features/auth/types";
import { MessageType } from "../../types";
import { cn } from "@/lib/utils";
import { PopoverBar } from "./popover-bar";

interface MessageProps {
  message: MessageType;
  isCurrentUserMessage: boolean;
}

export const Message = ({ message, isCurrentUserMessage }: MessageProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-start group/message",
        isCurrentUserMessage && "justify-end"
      )}
    >
      {isCurrentUserMessage && <PopoverBar message={message} />}

      <div
        className={cn(
          "w-fit px-3 py-2 rounded-3xl text-sm",
          isCurrentUserMessage
            ? "bg-[#1823ab]/90 text-white"
            : "bg-[#c9ccd1]/50"
        )}
      >
        {message.content?.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>

      {!isCurrentUserMessage && <PopoverBar message={message} />}
    </div>
  );
};
