import { UseDeleteNotification } from "../api/use-delete-notification";
import { NotificationType } from "../types";

import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";

interface DeleteNotificationButtonProps {
  notification: NotificationType;
  setOpen: (open: boolean) => void;
}

export const DeleteNotificationButton = ({
  notification,
  setOpen,
}: DeleteNotificationButtonProps) => {
  const { mutate: deleteNotification, isPending: isPendingDeleteNotification } =
    UseDeleteNotification();

  const handleDeleteNotification = (e: React.MouseEvent) => {
    e.stopPropagation();

    deleteNotification(
      { notificationId: notification.id },
      {
        onSuccess: (data) => {
          //   console.log(data);
          setOpen(false);
        },
        onError: (error) => {
          //   console.log(error);
        },
      }
    );
  };
  return (
    <Button
      onClick={handleDeleteNotification}
      className="w-full flex items-center justify-start text-sm text-black bg-[#ffffff] hover:bg-red-500/20 hover:text-red-500"
    >
      <MdDelete />
      <p>Delete notification</p>
    </Button>
  );
};
