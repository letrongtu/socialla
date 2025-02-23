import { useState } from "react";
import { MessageType } from "@/features/messages/types";

import { MarkAllAsReadButton } from "@/features/notifications/components/buttons/mark-all-as-read-button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FaEllipsis } from "react-icons/fa6";
import { MarkAllMessageAsReadButton } from "./mark-all-message-as-read";

interface HeaderChatEditButtonProps {
  messages: MessageType[];
}

export const HeaderChatEditButton = ({
  messages,
}: HeaderChatEditButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen} delayDuration={50}>
        <TooltipTrigger asChild>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-2 rounded-full bg-[#c9ccd1]/30 hover:bg-[#c9ccd1]/70 cursor-pointer"
          >
            <FaEllipsis className="text-black/70" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="end"
          className="p-1 lg:min-w-72 mx-4 shadow-lg"
        >
          <MarkAllMessageAsReadButton messages={messages} setOpen={setOpen} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
