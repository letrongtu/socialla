import { useEffect, useRef, useState } from "react";

import { UserType } from "@/features/auth/types";
import { useGetMessages } from "../api/use-get-messages";

import { MessageUserInfoCard } from "./message-user-info-card";
import { Message } from "./message/message";
import { Loader2 } from "lucide-react";

interface MessageListProps {
  currentUser: UserType;
  otherUser: UserType;
  conversationId: string | null;
}
export const MessageList = ({
  currentUser,
  otherUser,
  conversationId,
}: MessageListProps) => {
  const {
    data: messages,
    isLoading: isLoadingMessages,
    loadMore: loadMoreMessages,
    canLoadMore: canLoadMoreMessages,
  } = useGetMessages(conversationId);

  const messagesStartRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages.length <= 10) {
      messagesEndRef.current?.scrollIntoView();
    }
  }, [messages]);

  return (
    <div className="flex-1 max-h-full justify-end overflow-y-auto custom-scrollbar">
      <MessageUserInfoCard user={otherUser} />

      <div
        className="h-1"
        ref={(el) => {
          if (el) {
            messagesStartRef.current = el;

            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMoreMessages) {
                  loadMoreMessages();
                }
              },
              { threshold: 1.0 }
            );

            observer.observe(el);
            return () => observer.disconnect();
          }
        }}
      />

      {isLoadingMessages && (
        <div className="w-full h-10 flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}

      <div className="relative flex flex-col flex-grow px-2">
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            isCurrentUserMessage={currentUser.id === message.senderId}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
