import { useRouter } from "next/navigation";

import { useGetUser } from "@/features/auth/api/use-get-user";
import { UseUpdateReadNotification } from "../api/use-update-read-notification";
import { NotificationEntityTypeMap, NotificationType } from "../types";

import { FriendRequestNotificationContent } from "./friend-request-notification-content";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaTrash } from "react-icons/fa";
import { UseDeleteNotification } from "../api/use-delete-notification";

interface NotificationCardProps {
  notification: NotificationType;
}

export const NotificationCard = ({ notification }: NotificationCardProps) => {
  const router = useRouter();

  const { data: user, isLoading: isLoadingUser } = useGetUser(
    notification.entityId
  );

  const { mutate: deleteNotification, isPending: isPendingDeleteNotification } =
    UseDeleteNotification();
  const { mutate: updateRead, isPending: isPendingUpdateRead } =
    UseUpdateReadNotification();

  if (!user) {
    return null;
  }

  const userFullname = user.firstName + " " + user.lastName;
  const avatarFallback = user.firstName?.charAt(0).toUpperCase();

  const notificationEntityType =
    NotificationEntityTypeMap[
      notification.entityType as keyof typeof NotificationEntityTypeMap
    ];

  const handleOnClick = () => {
    if (!notification.isRead) {
      handleReadNotification();
    }

    handleRedirect();
  };

  const handleDeleteNotification = (e: React.MouseEvent) => {
    e.stopPropagation();

    deleteNotification(
      { notificationId: notification.id },
      {
        onSuccess: (data) => {
          //   console.log(data);
        },
        onError: (error) => {
          //   console.log(error);
        },
      }
    );
  };

  const handleReadNotification = () => {
    updateRead(
      { id: notification.id },
      {
        onSuccess: (data) => {
          //   console.log(data);
        },
        onError: (error) => {
          //   console.log(error);
        },
      }
    );
  };

  const handleRedirect = () => {
    if (notificationEntityType === "user") {
      router.push(`/friends/requests/${user.id}`);
    }
  };

  return (
    <div
      onClick={handleOnClick}
      className="relative py-2 px-2 flex items-center gap-x-2 rounded-md hover:bg-[#c9ccd1]/30 cursor-pointer group/notification"
    >
      <div className="w-full flex items-start gap-x-2">
        <div className="flex justify-center">
          <Avatar className="rounded size-14 transition cursor-pointer">
            <AvatarImage alt={user.firstName} src={user.profilePictureUrl} />
            <AvatarFallback className="rounded-full bg-custom-gradient text-white font-semibold text-2xl">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>

        {notificationEntityType === "user" && (
          <FriendRequestNotificationContent
            notification={notification}
            userFullname={userFullname}
            handleReadNotification={handleReadNotification}
          />
        )}
      </div>

      {!notification.isRead && (
        <div className="flex items-center justify-end w-6">
          <div className={"size-3 rounded-full bg-[#1823ab]"} />
        </div>
      )}

      {
        <div
          onClick={handleDeleteNotification}
          className="absolute hidden top-1 right-1 p-1.5 rounded-full bg-[#c9ccd1]/30 hover:bg-red-500/20 cursor-pointer group-hover/notification:flex group/delete"
        >
          <FaTrash className="size-3 group-hover/delete:text-red-500 text-muted-foreground" />
        </div>
      }
    </div>
  );
};
