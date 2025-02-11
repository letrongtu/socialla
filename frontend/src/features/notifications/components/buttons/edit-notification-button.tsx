import { useState } from "react";
import { NotificationType } from "../../types";

import { MarkAsReadButton } from "./mark-as-read-button";
import { DeleteNotificationButton } from "./delete-notification-button";
import { MarkAsUnReadButton } from "./mark-as-unread-button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FaEllipsis } from "react-icons/fa6";

interface EditNotificationButtonProps {
  notification: NotificationType;
}

export const EditNotificationButton = ({
  notification,
}: EditNotificationButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen} delayDuration={50}>
        <TooltipTrigger asChild>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="absolute hidden top-1/2 right-6 -translate-y-1/2 p-2 rounded-full bg-[#ffffff] hover:bg-[#c9ccd1] border-[1px] border-[#c9ccd1]/70 shadow-md cursor-pointer group-hover/notification:flex"
          >
            <FaEllipsis className="text-black/70" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="p-1 lg:min-w-72 mx-4 shadow-lg"
        >
          {notification.isRead ? (
            <MarkAsUnReadButton notification={notification} setOpen={setOpen} />
          ) : (
            <MarkAsReadButton notification={notification} setOpen={setOpen} />
          )}
          <DeleteNotificationButton
            notification={notification}
            setOpen={setOpen}
          />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
