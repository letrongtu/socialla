import { useState } from "react";
import { cn } from "@/lib/utils";

import { useCurrentUser } from "@/features/auth/api/use-current-user";

import { reactionsWithEmojiAndIcon } from "@/utils/reaction-data/reaction-data";
import { EngagementHint } from "@/features/posts/components/engagement-bar/engagement-hint";
import { ReactionDetailsModal } from "@/components/reaction-details-modal/reaction-details-modal";

import { ReactionType } from "@/utils/types";

import { FaHeart } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";

interface CommentReactionDetailsProps {
  commentReactions: ReactionType[];
}

export const CommentReactionDetails = ({
  commentReactions,
}: CommentReactionDetailsProps) => {
  const { data: currentUserData, isLoading } = useCurrentUser();

  const [reaction, setReaction] = useState<string | null>(null);

  if (!currentUserData) {
    return null;
  }

  const allPostReactionsObject = commentReactions.find(
    (reaction) => reaction.reaction === "All"
  );
  const totalPostReactions = allPostReactionsObject?.count || 0;

  // Push the current user to the first of the list if the user reacted to the comment
  commentReactions.map((commentReaction) => {
    const currentUserReaction = commentReaction.users.find(
      (user) => user.id === currentUserData.id
    );

    if (currentUserReaction) {
      commentReaction.users = commentReaction.users.filter(
        (user) => user.id !== currentUserData.id
      );

      commentReaction.users.unshift(currentUserReaction);
    }
  });

  const firstTenUsersReactedFullNames = allPostReactionsObject?.users
    .map((user) => user.fullName)
    .slice(0, 10);

  //TODO: Push the user to the first of the string if they reacted
  const mostTwoReactions = commentReactions
    .filter((reaction) => reaction.reaction !== "All")
    .sort((a, b) => b.count - a.count)
    .slice(0, 2)
    .map((commentReaction) => {
      const userFullNames = commentReaction.users
        .sort(
          (a, b) =>
            new Date(a.reactionCreatedAt).getTime() -
            new Date(b.reactionCreatedAt).getTime()
        )
        .slice(0, 10)
        .map((user) =>
          user.id === currentUserData.id ? "You" : user.fullName
        );

      if (commentReaction.count > 10) {
        userFullNames.push(
          `and ${commentReaction.count - userFullNames.length} more...`
        );
      }
      return {
        reaction: commentReaction.reaction,
        fullNames: userFullNames,
      };
    });

  return (
    <>
      <ReactionDetailsModal
        reactions={commentReactions}
        currentReaction={reaction}
        setReaction={setReaction}
      />

      <div
        onClick={() => setReaction("All")}
        className="flex items-center gap-x-1 px-0.5 rounded-lg bg-[#ffffff] shadow-lg hover:bg-[#c9ccd1]/30 cursor-pointer"
      >
        {totalPostReactions > 0 && (
          <EngagementHint contents={firstTenUsersReactedFullNames}>
            <p className="text-xs text-muted-foreground hover:underline cursor-pointer">
              {totalPostReactions}
            </p>
          </EngagementHint>
        )}

        <div className="inline-flex items-center justify-center rounded-full cursor-pointer">
          {mostTwoReactions.map(({ reaction, fullNames }, index) => {
            const reactionWithEmojiAndIcon = reactionsWithEmojiAndIcon.find(
              (reactionWithEmojiAndIcon) =>
                reactionWithEmojiAndIcon.reaction === reaction
            );

            return (
              <EngagementHint label={reaction} contents={fullNames} key={index}>
                <div
                  className={cn(
                    "rounded-full cursor-pointer",
                    !reactionWithEmojiAndIcon?.emoji && "p-1",
                    reaction === "Love" && "bg-red-500",
                    reaction === "Like" && "bg-[#1823ab]"
                  )}
                >
                  {reaction === "Love" && (
                    <FaHeart className="text-white size-2" />
                  )}

                  {reaction === "Like" && (
                    <AiFillLike className="text-white size-2" />
                  )}

                  {reactionWithEmojiAndIcon?.emoji && (
                    <p
                      className={cn(
                        "-mt-[0.09rem] -ml-1 text-[1rem] leading-none",
                        index === 0 && "-mr-1"
                      )}
                    >
                      {reactionWithEmojiAndIcon.emoji}
                    </p>
                  )}
                </div>
              </EngagementHint>
            );
          })}
        </div>
      </div>
    </>
  );
};
