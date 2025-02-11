import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetNotifications } from "../api/use-get-notifcations";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { NotificationCard } from "./notification-card";
import { useGetUnReadNotifications } from "../api/use-get-unread-notifications";
import { EditAllNotificationsButton } from "./buttons/edit-all-notifications-button";

const notificationFilterButtons = [{ label: "All" }, { label: "Unread" }];

export const NotificationDisplayModal = () => {
  const router = useRouter();

  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useCurrentUser();

  const {
    data: notifications,
    isLoading: isLoadingNotifications,
    canLoadMore: canLoadMoreNotifications,
    loadMore: loadMoreNotifications,
  } = useGetNotifications(currentUser?.id ? currentUser.id : null);

  const {
    data: unReadNotifications,
    isLoading: isLoadingUnReadNotifications,
    canLoadMore: canLoadMoreUnReadNotifications,
    loadMore: loadMoreUnReadNotifications,
  } = useGetUnReadNotifications(currentUser?.id ? currentUser.id : null);

  const [notificationFilter, setNotificationFilter] = useState(
    notificationFilterButtons[0].label
  );

  const handleLoadMore = () => {
    if (notificationFilter === "All" && canLoadMoreNotifications) {
      loadMoreNotifications();
    }

    if (notificationFilter === "Unread" && canLoadMoreUnReadNotifications) {
      loadMoreUnReadNotifications();
    }
  };

  return (
    <div className="flex flex-col gap-y-2 max-w-96  lg:w-96">
      <div className="flex flex-col gap-y-3 py-4 px-4">
        <div className="w-full flex items-center justify-between">
          <p className="text-2xl font-bold">Notifications</p>

          <EditAllNotificationsButton notifications={unReadNotifications} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            {notificationFilterButtons.map((button, index) => (
              <div
                onClick={() => setNotificationFilter(button.label)}
                key={index}
                className={cn(
                  "py-1.5 px-4 rounded-3xl hover:bg-[#c9ccd1]/30 cursor-pointer",
                  notificationFilter === button.label &&
                    "bg-[#1823ab]/15 text-[#1823ab]"
                )}
              >
                <p className="text-base font-semibold">{button.label}</p>
              </div>
            ))}
          </div>

          <div
            onClick={() => {
              router.push("/notifications");
            }}
            className="py-1.5 px-4 rounded-lg hover:bg-[#c9ccd1]/30 hover:underline cursor-pointer"
          >
            <p className="text-[#1823ab]">See all</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-3 px-2 max-h-[43rem] overflow-auto custom-scrollbar">
        {notificationFilter === "All" &&
          notifications.map((notification, index) => (
            <NotificationCard key={index} notification={notification} />
          ))}

        {notificationFilter === "Unread" &&
          unReadNotifications.map((notification, index) => (
            <NotificationCard key={index} notification={notification} />
          ))}
      </div>

      {((notificationFilter === "All" && canLoadMoreNotifications) ||
        (notificationFilter === "Unread" &&
          canLoadMoreUnReadNotifications)) && (
        <div
          onClick={handleLoadMore}
          className="w-full flex items-center justify-center py-2 rounded-sm hover:bg-[#c9ccd1]/30 cursor-pointer group/load-more"
        >
          <p className="text-sm font-semibold text-[#1823ab] group-hover/load-more:underline">
            Load more notifications
          </p>
        </div>
      )}
    </div>
  );
};
