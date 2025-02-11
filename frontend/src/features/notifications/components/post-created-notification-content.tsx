import { cn } from "@/lib/utils";
import {
  getCreatedDisplayString,
  getCountString,
} from "@/features/posts/helper/helper";
import { NotificationType } from "../types";
import { useGetPost } from "@/features/posts/api/use-get-post";
import { useGetPostReactions } from "@/features/post-reactions/api/use-get-post-reactions";
import { UseGetParentCommentsByPostId } from "@/features/post-comments/api/use-get-parent-comments-by-post-id";

interface FriendRequestNotificationContentProps {
  notification: NotificationType;
  userFullname: string;
}

export const PostCreatedNotificationContent = ({
  notification,
  userFullname,
}: FriendRequestNotificationContentProps) => {
  const { data: post, isLoading: isLoadingPost } = useGetPost(
    notification.postId
  );
  const { data: postReactions, isLoading: isLoadingPostReactions } =
    useGetPostReactions(notification.postId);
  const { totalPostComments, isLoading: isLoadingPostComments } =
    UseGetParentCommentsByPostId(notification.postId);

  if (!post) {
    return null;
  }

  const postReactionsCount =
    postReactions.find((reaction) => reaction.reaction === "All")?.count || 0;

  const reactionsCountString = getCountString(postReactionsCount, "Reaction");
  const commentCountString = getCountString(totalPostComments, "Comment");

  const content = post.content?.join(" ");

  const truncateContent =
    content && content.length > 80 ? content.slice(0, 80) + "..." : content;

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
          <span className="font-semibold">{notification.content}</span>
          &quot;{truncateContent}&quot;
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

          {postReactionsCount > 0 && (
            <p className="text-xs text-muted-foreground font-semibold">
              &#183; {reactionsCountString}
            </p>
          )}

          {totalPostComments > 0 && (
            <p className="text-xs text-muted-foreground font-semibold">
              &#183; {commentCountString}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
