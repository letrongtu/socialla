import { cn } from "@/lib/utils";

import { NotificationType } from "../types";
import { getCreatedDisplayString } from "@/features/posts/helper/helper";
import { useGetComment } from "@/features/post-comments/api/use-get-comment";

interface ReactionOrReplyCommentNotificationContentProps {
  notification: NotificationType;
  userFullname: string;
}

export const ReactionOrReplyCommentNotificationContent = ({
  notification,
  userFullname,
}: ReactionOrReplyCommentNotificationContentProps) => {
  const { data: comment, isLoading: isLoadingComment } = useGetComment(
    notification.commentId
  );

  if (!comment) {
    return null;
  }

  const content = comment.content?.join(" ");

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
