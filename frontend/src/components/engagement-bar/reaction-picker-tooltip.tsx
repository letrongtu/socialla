"use client";

import { cn } from "@/lib/utils";
import { createElement } from "react";
import { reactionsWithEmojiAndIcon } from "./reaction-data/reaction-data";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReactionPickerTooltipProps {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  handleReaction: (reaction: string) => void;
}

export const ReactionPickerTooltip = ({
  children,
  side,
  align,
  handleReaction,
}: ReactionPickerTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>

        <TooltipContent
          side={side}
          align={align}
          className="bg-[#ffffff] rounded-[1.75rem]"
        >
          <div className="h-12 flex items-center justify-center gap-x-2.5">
            {reactionsWithEmojiAndIcon.map(
              ({ reaction, emoji, fillIcon }, index) => (
                <div
                  onClick={() => {
                    handleReaction(reaction);
                  }}
                  key={index}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:w-12 hover:h-12 transition-all duration-200 group",

                    reaction === "Love" && "bg-red-500",
                    reaction === "Like" && "bg-[#1823ab]"
                  )}
                >
                  {emoji && (
                    <p className="-mt-1 text-[2.51rem] hover:text-[3.2rem]">
                      {emoji}
                    </p>
                  )}

                  {fillIcon &&
                    createElement(fillIcon, {
                      className: "text-white size-6 group-hover:size-8",
                    })}
                </div>
              )
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
