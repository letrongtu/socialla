export type MessageType = {
  id: string;
  conversationId: string | null;
  senderId: string | null;
  parentMessageId: string | null;
  content: string[] | null;
  fileUrls: string[] | null;
  isEmojiOnly: boolean;
  createdAt: Date;
};
