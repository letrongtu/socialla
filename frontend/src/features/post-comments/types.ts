export type CommentType = {
  id: string;
  content: string[];
  createdAt: Date;
  parentCommentId?: string;
  userId: string;
  postId: string;
};
