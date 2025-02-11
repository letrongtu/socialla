import { NotificationType } from "../types";
import { UseUpdateReadNotification } from "../api/use-update-read-notification";

import { Button } from "@/components/ui/button";
import { FaCheck } from "react-icons/fa6";
import { UseUpdateReadNotifications } from "../api/use-update-read-notifications";

interface MarkAsReadButtonProps {
  notifications: NotificationType[];
  setOpen: (open: boolean) => void;
}

export const MarkAllAsReadButton = ({
  notifications,
  setOpen,
}: MarkAsReadButtonProps) => {
  const { mutate: readNotifications, isPending: isPendingReadNotifications } =
    UseUpdateReadNotifications();

  const notificationIds = notifications.map((notification) => notification.id);

  const handleReadNotification = (e: React.MouseEvent) => {
    e.stopPropagation();

    readNotifications(
      { ids: notificationIds },
      {
        onSuccess: (data) => {
          // console.log(data);
        },
        onError: (error) => {
          // console.log(error);
        },
      }
    );

    setOpen(false);
  };

  return (
    <Button
      onClick={handleReadNotification}
      className="w-full flex items-center justify-start text-sm text-black bg-[#ffffff] hover:bg-[#1823ab]/10 hover:text-[#1823ab] transition-all duration-200"
    >
      <FaCheck />
      <p>Mark all as read</p>
    </Button>
  );
};
