import { cn } from "@/lib/utils";

import { reactionsWithEmojiAndIcon } from "./reaction-data/reaction-data";
import { PostReactionType } from "@/features/post-reactions/types";

import { Hint } from "@/components/ui/hint";

import { FaHeart } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";

interface PostEngagementDetailsProps {
  postReactionData: PostReactionType[];
  userReaction?: string | null;
  enableReaction?: boolean;
  enableComment?: boolean;
  enableShare?: boolean;
}

export const PostEngagementDetails = ({
  postReactionData,
  enableReaction = true,
  enableComment = true,
  enableShare = true,
}: PostEngagementDetailsProps) => {
  const totalPostReactions = postReactionData.reduce(
    (total, reaction) => (total += reaction.count),
    0
  );

  const mostTwoReactions = postReactionData
    .sort((a, b) => b.count - a.count)
    .slice(0, 2);

  console.log(mostTwoReactions);

  return (
    <div
      className={cn(
        "flex justify-end px-4",
        enableReaction && "justify-between"
      )}
    >
      {enableReaction && mostTwoReactions && (
        <div className="flex items-center gap-x-1">
          <div className="inline-flex items-center justify-center rounded-full cursor-pointer">
            {mostTwoReactions.map((reaction, index) => {
              const reactionWithEmojiAndIcon = reactionsWithEmojiAndIcon.find(
                (reactionWithEmojiAndIcon) =>
                  reactionWithEmojiAndIcon.reaction === reaction.reaction
              );
              return (
                <Hint label={reaction.reaction} key={index}>
                  <div
                    className={cn(
                      "rounded-full cursor-pointer",
                      !reactionWithEmojiAndIcon?.emoji && "p-1",
                      reaction.reaction === "Love" && "bg-red-500",
                      reaction.reaction === "Like" && "bg-[#1823ab]"
                    )}
                  >
                    {reaction.reaction === "Love" && (
                      <FaHeart className="text-white size-3" />
                    )}

                    {reaction.reaction === "Like" && (
                      <AiFillLike className="text-white size-3" />
                    )}

                    {reactionWithEmojiAndIcon?.emoji && (
                      <p className="-mt-[0.1rem] -ml-1 text-[1.28rem] leading-none">
                        {reactionWithEmojiAndIcon.emoji}
                      </p>
                    )}
                  </div>
                </Hint>
              );
            })}
          </div>

          {totalPostReactions > 0 && (
            <Hint label="13k people reacted">
              <p className="text-base text-muted-foreground hover:underline cursor-pointer">
                {totalPostReactions}
              </p>
            </Hint>
          )}
        </div>
      )}

      <div className="flex items-center gap-x-3">
        {enableComment && (
          <Hint label="8 comments">
            <p className="text-base text-muted-foreground hover:underline cursor-pointer">
              8 comments
            </p>
          </Hint>
        )}

        {enableShare && (
          <Hint label="10 shares">
            <p className="text-base text-muted-foreground hover:underline cursor-pointer">
              10 shares
            </p>
          </Hint>
        )}
      </div>
    </div>
  );
};
