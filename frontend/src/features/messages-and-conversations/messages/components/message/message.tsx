import { MessageType } from "../../types";
import { cn } from "@/lib/utils";
import { PopoverBar } from "./popover-bar";
import { getMessageCreatedAtString } from "../../helper";

interface MessageProps {
  message: MessageType;
  isCompact: boolean;
  isFirstIndex: boolean;
  isCurrentUserMessage: boolean;
}

export const Message = ({
  message,
  isCompact,
  isFirstIndex,
  isCurrentUserMessage,
}: MessageProps) => {
  const messageCreatedAtString = getMessageCreatedAtString(message.createdAt);

  return (
    <>
      {!isCompact && (
        <div
          className={cn(
            " flex items-center justify-center",
            isFirstIndex ? "pb-4" : "py-4"
          )}
        >
          <p className="text-[0.71rem] font-semibold text-muted-foreground">
            {messageCreatedAtString}
          </p>
        </div>
      )}
      <div
        className={cn(
          "flex items-center justify-start group/message",
          isCurrentUserMessage && "justify-end"
        )}
      >
        {isCurrentUserMessage && <PopoverBar message={message} />}

        {!message.isEmojiOnly && (
          <div
            className={cn(
              "w-fit px-3 py-2 text-sm",
              isCurrentUserMessage
                ? "bg-[#1823ab]/90 text-white rounded-l-3xl rounded-r-md"
                : "bg-[#c9ccd1]/50 rounded-r-3xl rounded-l-md"
            )}
          >
            {message.content?.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        )}

        {message.isEmojiOnly && (
          <div className={cn("w-fit text-2xl")}>
            {message.content?.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        )}

        {!isCurrentUserMessage && <PopoverBar message={message} />}
      </div>
    </>
  );
};
