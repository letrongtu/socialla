import { useRouter } from "next/navigation";

import { useGetUser } from "@/features/auth/api/use-get-user";
import { UseUpdateReadNotification } from "../api/use-update-read-notification";
import { NotificationType, NotificationTypeMap } from "../types";

import { FriendRequestNotificationContent } from "./friend-request-notification-content";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCreatedNotificationContent } from "./post-created-notification-content";
import { EditNotificationButton } from "./edit-notification-button";

interface NotificationCardProps {
  notification: NotificationType;
}

export const NotificationCard = ({ notification }: NotificationCardProps) => {
  const router = useRouter();

  const { data: user, isLoading: isLoadingUser } = useGetUser(
    notification.entityId
  );

  const { mutate: readNotification, isPending: isPendingReadNotification } =
    UseUpdateReadNotification();

  if (!user) {
    return null;
  }

  const userFullname = user.firstName + " " + user.lastName;
  const avatarFallback = user.firstName?.charAt(0).toUpperCase();

  const notificationType =
    NotificationTypeMap[notification.type as keyof typeof NotificationTypeMap];

  const handleOnClick = () => {
    if (!notification.isRead) {
      handleReadNotification();
    }

    handleRedirect();
  };

  const handleReadNotification = () => {
    readNotification(
      { id: notification.id, isRead: true },
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
    if (notificationType === "friend_request") {
      router.push(`/friends/requests/${user.id}`);
    }
  };

  return (
    <div
      onClick={handleOnClick}
      className="relative py-2 px-2 flex items-center gap-x-2 rounded-md hover:bg-[#c9ccd1]/20 cursor-pointer group/notification"
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

        {(notificationType === "friend_request" ||
          notificationType === "friend_accept") && (
          <FriendRequestNotificationContent
            notification={notification}
            userFullname={userFullname}
            handleReadNotification={handleReadNotification}
          />
        )}

        {notificationType === "post_created" && (
          <PostCreatedNotificationContent
            notification={notification}
            userFullname={userFullname}
          />
        )}
      </div>

      {!notification.isRead && (
        <div className="flex items-center justify-end w-6">
          <div className={"size-3 rounded-full bg-[#1823ab]"} />
        </div>
      )}

      <EditNotificationButton notification={notification} />
    </div>
  );
};
