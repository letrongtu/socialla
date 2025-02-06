export type ReactionType = {
  reaction: string;
  count: number;
  users: ReactionUserType[];
};

export type ReactionUserType = {
  id: string;
  fullName: string;
  reactionCreatedAt: string;
};
