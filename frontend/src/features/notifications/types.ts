export const NotificationEntityTypeMap = {
  0: "null",
  1: "post",
  2: "comment",
  3: "user",
};

export const NotificationTypeMap = {
  0: "null",
  1: "friend_request",
  2: "friend_accept",
  3: "react_post",
  4: "comment_post",
  5: "react_comment",
  6: "reply_comment",
};

export type NotificationType = {
  id: string;
  receiveUserId: string;
  entityType: number;
  entityId: string;
  type: number;
  content: string;
  isRead: boolean;
  createdAt: Date;
};
