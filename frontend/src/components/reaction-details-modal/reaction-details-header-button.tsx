import { cn } from "@/lib/utils";
import { ReactionType } from "@/utils/types";

import { reactionsWithEmojiAndIcon } from "@/utils/reaction-data/reaction-data";

import { FaHeart } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";

interface ReactionDetailsHeaderButtonProps {
  reactions: ReactionType[];
  currentReaction: string | null;
  setReaction: (reaction: string | null) => void;
}

export const ReactionDetailsHeaderButton = ({
  reactions,
  currentReaction,
  setReaction,
}: ReactionDetailsHeaderButtonProps) => {
  return (
    <>
      <div
        onClick={() => setReaction("All")}
        className={cn(
          "w-20 h-11 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg cursor-pointer",
          currentReaction === "All"
            ? "rounded-none border-b-2 border-b-[#1823ab]"
            : "border-2 border-hidden hover:bg-slate-100"
        )}
      >
        <p
          className={cn(
            "text-base text-muted-foreground",
            currentReaction === "All" && "text-[#1823ab]"
          )}
        >
          All
        </p>
      </div>

      {reactions.map((reaction, index) => {
        const reactionWithEmojiAndIcon = reactionsWithEmojiAndIcon.find(
          (reactionWithEmojiAndIcon) =>
            reactionWithEmojiAndIcon.reaction === reaction.reaction
        );

        return (
          <div
            key={index}
            onClick={() => setReaction(reaction.reaction)}
            className={cn(
              "w-20 h-11 flex flex-row items-center justify-center space-x-2 py-2 px-4 rounded-lg cursor-pointer transition-all duration-200",
              currentReaction === reaction.reaction
                ? "rounded-none border-b-2 border-b-[#1823ab]"
                : "border-2 border-hidden hover:bg-slate-100"
            )}
          >
            <div
              className={cn(
                "flex items-center rounded-full cursor-pointer",
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
                <p className="-mt-[0.1rem] -ml-1 -mr-1 text-[1.28rem]">
                  {reactionWithEmojiAndIcon.emoji}
                </p>
              )}
            </div>

            <p
              className={cn(
                "text-base text-muted-foreground",
                currentReaction === reaction.reaction && "text-[#1823ab]"
              )}
            >
              {reaction.count}
            </p>
          </div>
        );
      })}
    </>
  );
};
