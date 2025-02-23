import { UserType } from "../auth/types";
import { MessageType } from "../messages/types";

export type ReturnConversationType = {
  conversation: ConversationType;
  otherUser: UserType;
  lastMessage: MessageType;
};

export type ConversationType = {
  id: string;
  isGroup: boolean;
  groupName: string;
  groupAvatarUrl: string;
  createdAt: Date;
  emojiSlug: string;
};
