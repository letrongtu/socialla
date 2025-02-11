import { cn } from "@/lib/utils";

import { NotificationType } from "../types";
import { getCreatedDisplayString } from "@/features/posts/helper/helper";
import { useGetPost } from "@/features/posts/api/use-get-post";

interface ReactionOrCommentPostNotificationContentProps {
  notification: NotificationType;
  userFullname: string;
}

export const ReactionOrCommentPostNotificationContent = ({
  notification,
  userFullname,
}: ReactionOrCommentPostNotificationContentProps) => {
  const { data: post, isLoading: isLoadingPost } = useGetPost(
    notification.postId
  );

  if (!post) {
    return null;
  }

  const content = post.content?.join(" ");

  const truncateContent =
    content && content.length > 70 ? content.slice(0, 70) + "..." : content;

  const { createdDisplayString } = getCreatedDisplayString(
    notification.createdAt
  );

  return (
    <div className={cn("w-full flex flex-col gap-y-3")}>
      <div className="flex flex-col">
        <p
          className={cn(
            "text-sm",
            notification.isRead && "text-muted-foreground"
          )}
        >
          <span className="text-base font-semibold">{userFullname}</span>{" "}
          <span className="font-semibold">{notification.content}</span>: &quot;
          {truncateContent}&quot;
        </p>

        <div className="px-[0.1rem] flex items-center gap-x-1">
          <p
            className={cn(
              "text-xs text-[#1823ab] font-semibold",
              notification.isRead && "text-muted-foreground"
            )}
          >
            {createdDisplayString}
          </p>
        </div>
      </div>
    </div>
  );
};
