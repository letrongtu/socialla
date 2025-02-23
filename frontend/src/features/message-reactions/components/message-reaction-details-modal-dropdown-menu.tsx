import { cn } from "@/lib/utils";
import { reactionsWithEmojiAndIcon } from "@/utils/reaction-data/reaction-data";

import { ReactionType } from "@/utils/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FaChevronDown } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";

interface MessageReactionDetailsModalDropdownMenuProps {
  reactions: ReactionType[];
  currentReaction: string | null;
  setReaction: (reaction: string | null) => void;
}

export const MessageReactionDetailsModalDropdownMenu = ({
  reactions,
  currentReaction,
  setReaction,
}: MessageReactionDetailsModalDropdownMenuProps) => {
  const isActive = reactions.some(
    (reaction) => reaction.reaction === currentReaction
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className={cn(
            "w-20 h-11 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg hover:bg-slate-100 cursor-pointer",
            isActive
              ? "rounded-none border-b-2 border-b-[#1823ab]"
              : "border-2 border-hidden hover:bg-slate-100"
          )}
        >
          <p
            className={cn(
              "flex items-center justify-center gap-x-1 text-base text-muted-foreground",
              isActive && "text-[#1823ab]"
            )}
          >
            More
            <FaChevronDown className="size-3" />
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {reactions.map((reaction, index) => {
          return (
            <DropdownMenuItem key={index}>
              <div
                onClick={() => setReaction(reaction.reaction)}
                key={index}
                className={cn(
                  "w-full h-11 flex flex-row items-center justify-between py-2 px-4 rounded-lg cursor-pointer border-2 border-hidden hover:bg-slate-100 transition-all duration-200"
                )}
              >
                <div className="flex flex-row items-center space-x-2">
                  <div
                    className={cn(
                      "flex items-center rounded-full cursor-pointer"
                    )}
                  >
                    <p>{reaction.reaction}</p>
                  </div>

                  <p
                    className={cn(
                      "text-base font-semibold",
                      currentReaction === reaction.reaction && "text-[#1823ab]"
                    )}
                  >
                    {reaction.count}
                  </p>
                </div>

                {currentReaction === reaction.reaction && (
                  <FaCheck className="text-sm text-[#1823ab]" />
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
