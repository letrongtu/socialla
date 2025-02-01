export type PostReactionType = {
  reaction: string;
  count: number;
  users: PostReactionUserType[];
};

export type PostReactionUserType = {
  id: string;
  fullName: string;
  reactionCreatedAt: string;
};
