import { cn } from "@/lib/utils";
import { ReactionType } from "@/utils/types";

import { reactionsWithEmojiAndIcon } from "@/utils/reaction-data/reaction-data";

import { FaHeart } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";

interface MessageReactionDetailsHeaderButtonProps {
  reactions: ReactionType[];
  currentReaction: string | null;
  setReaction: (reaction: string | null) => void;
}

export const MessageReactionDetailsHeaderButton = ({
  reactions,
  currentReaction,
  setReaction,
}: MessageReactionDetailsHeaderButtonProps) => {
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
              className={cn("flex items-center rounded-full cursor-pointer")}
            >
              <p>{reaction.reaction}</p>
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
