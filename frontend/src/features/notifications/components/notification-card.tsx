import { useRouter } from "next/navigation";

import { useGetUser } from "@/features/auth/api/use-get-user";
import { NotificationType, NotificationTypeMap } from "../types";
import { reactionsWithEmojiAndIcon } from "@/utils/reaction-data/reaction-data";
import { UseUpdateReadNotification } from "../api/use-update-read-notification";
import { useGetPostReaction } from "@/features/post-reactions/api/use-get-post-reaction";

import { FriendRequestNotificationContent } from "./friend-request-notification-content";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCreatedNotificationContent } from "./post-created-notification-content";
import { EditNotificationButton } from "./buttons/edit-notification-button";
import { ReactionOrCommentPostNotificationContent } from "./reaction-or-comment-post-notification-content";
import { cn } from "@/lib/utils";
import { FaHeart } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { useGetCommentReaction } from "@/features/comment-reactions/api/use-get-comment-reaction";
import { ReactionOrReplyCommentNotificationContent } from "./reaction-or-reply-comment-notification-content";

interface NotificationCardProps {
  notification: NotificationType;
}

export const NotificationCard = ({ notification }: NotificationCardProps) => {
  const router = useRouter();

  const { data: user, isLoading: isLoadingUser } = useGetUser(
    notification.entityId
  );
  const { data: postReaction, isLoading: isLoadingPostReaction } =
    useGetPostReaction(notification.postId, notification.entityId);
  const { data: commentReaction, isLoading: isLoadingCommentReaction } =
    useGetCommentReaction(
      notification.commentId,
      notification.postId,
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

  const reactionWithEmojiAndIcon = reactionsWithEmojiAndIcon.find(
    (reactionWithEmojiAndIcon) =>
      reactionWithEmojiAndIcon.reaction ===
      (postReaction
        ? postReaction.reaction.reaction
        : commentReaction?.reaction.reaction)
  );

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
        <div className="relative flex justify-center">
          <Avatar className="rounded size-14 transition cursor-pointer">
            <AvatarImage alt={user.firstName} src={user.profilePictureUrl} />
            <AvatarFallback className="rounded-full bg-custom-gradient text-white font-semibold text-2xl">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          {(notificationType === "react_post" ||
            notificationType === "react_comment") &&
            reactionWithEmojiAndIcon && (
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 rounded-full cursor-pointer",
                  !reactionWithEmojiAndIcon.emoji && "p-1",
                  reactionWithEmojiAndIcon.reaction === "Love" &&
                    "bg-red-500 border-[1.5px] border-[#ffffff]",
                  reactionWithEmojiAndIcon.reaction === "Like" &&
                    "bg-[#1823ab] border-[1.5px] border-[#ffffff]"
                )}
              >
                {reactionWithEmojiAndIcon.reaction === "Love" && (
                  <FaHeart className="text-white size-3" />
                )}

                {reactionWithEmojiAndIcon.reaction === "Like" && (
                  <AiFillLike className="text-white size-3" />
                )}

                {reactionWithEmojiAndIcon?.emoji && (
                  <p
                    className={cn(
                      "-mt-[0.09rem] -ml-1 text-[1.28rem] leading-none"
                    )}
                  >
                    {reactionWithEmojiAndIcon.emoji}
                  </p>
                )}
              </div>
            )}
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

        {(notificationType === "react_post" ||
          notificationType === "comment_created") && (
          <ReactionOrCommentPostNotificationContent
            notification={notification}
            userFullname={userFullname}
          />
        )}

        {(notificationType === "reply_comment" ||
          notificationType === "react_comment") && (
          <ReactionOrReplyCommentNotificationContent
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
