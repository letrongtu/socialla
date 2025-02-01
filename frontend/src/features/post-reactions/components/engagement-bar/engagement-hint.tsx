"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EngagementHintProps {
  label?: string;
  contents?: string[];
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export const EngagementHint = ({
  label,
  contents,
  children,
  side = "bottom",
  align,
}: EngagementHintProps) => (
  <TooltipProvider>
    <Tooltip delayDuration={50}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>

      <TooltipContent
        side={side}
        align={align}
        className="bg-black/85 text-white border-white/5"
      >
        <p className="font-bold text-xs">{label}</p>

        {contents &&
          contents.map((content, index) => (
            <p key={index} className="font-light text-xs">
              {content}
            </p>
          ))}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
