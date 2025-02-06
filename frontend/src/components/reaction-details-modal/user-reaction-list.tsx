import { UserReactionCard } from "./user-reaction-card";
import { ReactionType } from "@/utils/types";

interface UserReactionListProps {
  reactions: ReactionType[];
  currentReaction: string | null;
}

export const UserReactionList = ({
  reactions,
  currentReaction,
}: UserReactionListProps) => {
  const reaction = reactions.find(
    (reaction) => reaction.reaction === currentReaction
  );

  if (!reaction) {
    return null;
  }

  return (
    <div className="w-full h-96 flex flex-col gap-y-4 overflow-auto">
      {reaction.users.map((user, index) => {
        const userReaction = reactions.find((reaction) =>
          reaction.users.some((u) => u.id === user.id)
        );

        const currentReaction =
          reaction.reaction !== "All"
            ? reaction.reaction
            : userReaction
            ? userReaction.reaction
            : "All";

        return (
          <UserReactionCard
            key={index}
            reaction={currentReaction}
            userId={user.id}
          />
        );
      })}
    </div>
  );
};
