import { cn } from "@/lib/utils";

import { reactionsWithEmojiAndIcon } from "./reaction-data/reaction-data";
import { EngagementHint } from "./engagement-hint";

import {
  PostReactionType,
  PostReactionUserType,
} from "@/features/post-reactions/types";

import { FaHeart } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { useState } from "react";
import { EngagementDetailsModal } from "./engagement-details-modal";

interface ReactionDetailsProps {
  postReactions: PostReactionType[];
}

export const ReactionDetails = ({ postReactions }: ReactionDetailsProps) => {
  const [reaction, setReaction] = useState<string | null>(null);

  const allPostReactionsObject = postReactions.find(
    (reaction) => reaction.reaction === "All"
  );
  const totalPostReactions = allPostReactionsObject?.count || 0;

  const firstTenUsersReactedFullNames = allPostReactionsObject?.users
    .map((user) => user.fullName)
    .slice(0, 10);

  const mostTwoReactions = postReactions
    .filter((reaction) => reaction.reaction !== "All")
    .sort((a, b) => b.count - a.count)
    .slice(0, 2)
    .map((postReaction) => {
      const userFullNames = postReaction.users
        .sort(
          (a, b) =>
            new Date(a.reactionCreatedAt).getTime() -
            new Date(b.reactionCreatedAt).getTime()
        )
        .slice(0, 10)
        .map((user) => user.fullName);

      if (postReaction.count > 10) {
        userFullNames.push(
          `and ${postReaction.count - userFullNames.length} more...`
        );
      }
      return {
        reaction: postReaction.reaction,
        fullNames: userFullNames,
      };
    });

  return (
    <>
      <EngagementDetailsModal
        postReactions={postReactions}
        currentReaction={reaction}
        setReaction={setReaction}
      />

      <div className="flex items-center gap-x-1">
        <div className="inline-flex items-center justify-center rounded-full cursor-pointer">
          {mostTwoReactions.map(({ reaction, fullNames }, index) => {
            const reactionWithEmojiAndIcon = reactionsWithEmojiAndIcon.find(
              (reactionWithEmojiAndIcon) =>
                reactionWithEmojiAndIcon.reaction === reaction
            );

            return (
              <EngagementHint label={reaction} contents={fullNames} key={index}>
                <div
                  onClick={() => setReaction(reaction)}
                  className={cn(
                    "rounded-full cursor-pointer",
                    !reactionWithEmojiAndIcon?.emoji && "p-1",
                    reaction === "Love" && "bg-red-500",
                    reaction === "Like" && "bg-[#1823ab]"
                  )}
                >
                  {reaction === "Love" && (
                    <FaHeart className="text-white size-3" />
                  )}

                  {reaction === "Like" && (
                    <AiFillLike className="text-white size-3" />
                  )}

                  {reactionWithEmojiAndIcon?.emoji && (
                    <p
                      className={cn(
                        "-mt-[0.1rem] -ml-1 text-[1.28rem] leading-none",
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

        {totalPostReactions > 0 && (
          <EngagementHint contents={firstTenUsersReactedFullNames}>
            <p
              onClick={() => setReaction("All")}
              className="text-base text-muted-foreground hover:underline cursor-pointer"
            >
              {totalPostReactions}
            </p>
          </EngagementHint>
        )}
      </div>
    </>
  );
};
