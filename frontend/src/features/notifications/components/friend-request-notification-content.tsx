import { cn } from "@/lib/utils";
import { getCreatedTimeString } from "../helper/helper";
import { NotificationType } from "../types";
import { useCheckFriendShip } from "@/features/friendships/api/use-check-friendship";
import { ConfirmButton } from "@/features/friendships/components/confirm-button";
import { DeleteButton } from "@/features/friendships/components/delete-button";

interface FriendRequestNotificationContentProps {
  notification: NotificationType;
  userFullname: string;
  handleReadNotification: () => void;
}

export const FriendRequestNotificationContent = ({
  notification,
  userFullname,
  handleReadNotification,
}: FriendRequestNotificationContentProps) => {
  const { data, isLoading } = useCheckFriendShip(
    notification.entityId,
    notification.receiveUserId
  );

  const { createdDisplayString, createdDayDateTime } = getCreatedTimeString(
    notification.createdAt
  );

  return (
    <div
      className={cn(
        "w-full flex flex-col gap-y-3",
        !data?.hasFriendship && "gap-y-2"
      )}
    >
      <div className="flex flex-col">
        <p
          className={cn(
            "text-sm",
            notification.isRead && "text-muted-foreground"
          )}
        >
          <span className="text-base font-semibold">{userFullname}</span>{" "}
          {notification.content}
        </p>

        <p
          className={cn(
            "text-xs px-[0.1rem] text-[#1823ab] font-semibold",
            notification.isRead && "text-muted-foreground"
          )}
        >
          {createdDisplayString}
        </p>
      </div>

      {data?.hasFriendship && !data.isAccepted && (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="w-full flex items-center justify-between gap-x-2"
        >
          <ConfirmButton
            firstUserId={notification.entityId}
            secondUserId={notification.receiveUserId}
            handleReadNotification={handleReadNotification}
          />

          <DeleteButton
            firstUserId={notification.entityId}
            secondUserId={notification.receiveUserId}
            handleReadNotification={handleReadNotification}
          />
        </div>
      )}

      {!data?.hasFriendship && (
        <p className="px-0.5 text-sm text-muted-foreground">Request removed</p>
      )}
    </div>
  );
};
