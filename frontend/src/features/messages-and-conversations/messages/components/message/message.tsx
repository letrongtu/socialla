import { cn } from "@/lib/utils";
import { useState } from "react";

import { MessageType } from "../../types";
import { getMessageCreatedAtString } from "../../helper";
import { useGetMessage } from "../../api/use-get-message";
import { useGetUser } from "@/features/auth/api/use-get-user";

import { Hint } from "@/components/ui/hint";
import { MessageActionToolbar } from "./message-action-toolbar";

import { FaReply } from "react-icons/fa";
import { UserType } from "@/features/auth/types";

interface MessageProps {
  message: MessageType;
  currentUser: UserType;
  isCompact: boolean;
  isFirstIndex: boolean;
  isCurrentUserMessage: boolean;
}

export const Message = ({
  message,
  currentUser,
  isCompact,
  isFirstIndex,
  isCurrentUserMessage,
}: MessageProps) => {
  const { data: parentMessage, isLoading: isLoadingParentMessage } =
    useGetMessage(
      message.parentMessageId,
      currentUser.id ? currentUser.id : null
    );
  const { data: parentMessageSender, isLoading: isLoadingParentMessageSender } =
    useGetUser(parentMessage?.senderId ? parentMessage.senderId : null);
  const { data: messageSender, isLoading: isLoadingMessageSender } = useGetUser(
    message.senderId
  );

  const [isMessageHovered, setIsMessageHovered] = useState(false);

  const messageCreatedAtString = getMessageCreatedAtString(message.createdAt);

  const parentMessageContent = parentMessage?.content?.join(" ");

  const truncateContent =
    parentMessageContent && parentMessageContent.length > 70
      ? parentMessageContent.slice(0, 80) + "..."
      : parentMessageContent;

  return (
    <div
      onMouseEnter={() => setIsMessageHovered(true)}
      onMouseLeave={() => setIsMessageHovered(false)}
    >
      {!isCompact && (
        <div
          className={cn(
            "flex items-center justify-center",
            isFirstIndex ? "pb-4" : "py-4"
          )}
        >
          <p className="text-[0.71rem] font-semibold text-muted-foreground">
            {messageCreatedAtString}
          </p>
        </div>
      )}

      {message.parentMessageId && (
        <div
          className={cn(
            "-mb-3.5 flex flex-col items-start  space-y-0.5",
            isCurrentUserMessage && "items-end",
            isCompact && "pt-3"
          )}
        >
          <div className="px-2 flex items-center space-x-1 text-xs text-muted-foreground">
            <FaReply className="size-3" />

            <p className="">
              <span className="font-bold">
                {currentUser.id === message.senderId && "You"}

                {currentUser.id !== message.senderId &&
                  currentUser.id === parentMessage?.senderId &&
                  messageSender &&
                  `${messageSender.firstName} ${messageSender.lastName}`}

                {currentUser.id !== message.senderId &&
                  currentUser.id !== parentMessage?.senderId &&
                  parentMessageSender &&
                  `${parentMessageSender.firstName} ${parentMessageSender.lastName}`}
              </span>{" "}
              replied to{" "}
              <span className="font-bold">
                {currentUser.id === parentMessage?.senderId &&
                  currentUser.id === message.senderId &&
                  "yourself"}

                {currentUser.id === parentMessage?.senderId &&
                  currentUser.id !== message.senderId &&
                  "you"}

                {currentUser.id !== parentMessage?.senderId &&
                  parentMessageSender &&
                  `${parentMessageSender.firstName} ${parentMessageSender.lastName}`}

                {!parentMessage && "a removed message"}
              </span>
            </p>
          </div>

          <div
            className={
              "max-w-80 w-fit break-words rounded-xl px-3 pt-1.5 pb-5 bg-[#c9ccd1]/30"
            }
          >
            <p className="text-xs text-muted-foreground">
              {parentMessage ? truncateContent : "Message removed"}
            </p>
          </div>
        </div>
      )}
      <Hint
        label={messageCreatedAtString}
        side="top"
        align={isCurrentUserMessage ? "end" : "start"}
      >
        <div
          className={cn(
            "flex items-center justify-start group/message",
            isCurrentUserMessage && "justify-end"
          )}
        >
          {isCurrentUserMessage && isMessageHovered && (
            <MessageActionToolbar
              message={message}
              currentUser={currentUser}
              setIsMessageHovered={setIsMessageHovered}
            />
          )}

          {!message.isEmojiOnly && (
            <div
              className={cn(
                "max-w-[68%] w-fit px-3 py-2 text-sm break-words",
                isCurrentUserMessage
                  ? "bg-[#1823ab]/90 text-white rounded-l-3xl rounded-r-md"
                  : "bg-[#c9ccd1] rounded-r-3xl rounded-l-md"
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

          {!isCurrentUserMessage && isMessageHovered && (
            <MessageActionToolbar
              message={message}
              currentUser={currentUser}
              setIsMessageHovered={setIsMessageHovered}
            />
          )}
        </div>
      </Hint>
    </div>
  );
};
