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
  3: "post_created",
  4: "react_post",
  5: "comment_created",
  6: "react_comment",
  7: "reply_comment",
};

export type NotificationType = {
  id: string;
  receiveUserId: string;
  entityType: number;
  entityId: string;
  type: number;
  postId: string | null;
  commentId: string | null;
  content: string;
  isRead: boolean;
  createdAt: Date;
};
