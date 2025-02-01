import { UserReactionCard } from "./user-reaction-card";
import { PostReactionType } from "../../types";

interface UserReactionListProps {
  postReactions: PostReactionType[];
  currentReaction: string | null;
}

export const UserReactionList = ({
  postReactions,
  currentReaction,
}: UserReactionListProps) => {
  const postReaction = postReactions.find(
    (postReaction) => postReaction.reaction === currentReaction
  );

  if (!postReaction) {
    return null;
  }

  return (
    <div className="w-full h-96 flex flex-col gap-y-4 overflow-auto">
      {postReaction.users.map((user, index) => {
        const userReaction = postReactions.find((postReaction) =>
          postReaction.users.some((u) => u.id === user.id)
        );

        const reaction =
          postReaction.reaction !== "All"
            ? postReaction.reaction
            : userReaction
            ? userReaction.reaction
            : "All";

        return (
          <UserReactionCard key={index} reaction={reaction} userId={user.id} />
        );
      })}
    </div>
  );
};
