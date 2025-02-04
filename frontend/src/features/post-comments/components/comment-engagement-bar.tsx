import { getCreatedDisplayString } from "@/features/posts/helper/helper";
import { CommentType } from "../types";

import { Hint } from "@/components/ui/hint";
import { ReactionPickerTooltip } from "@/features/post-reactions/components/reaction-picker-tooltip";
import { useCurrentUser } from "@/features/auth/api/use-current-user";

interface CommentEngagementBarProps {
  comment: CommentType;
  setIsReply: (reply: boolean) => void;
  setIsEditComment: (isEditComment: boolean) => void;
  setIsLastChildEditingFromParent?: (isLastChildEditing: boolean) => void;
  isLastChild: boolean;
}
export const CommentEngagementBar = ({
  comment,
  setIsReply,
  setIsEditComment,
  setIsLastChildEditingFromParent,
  isLastChild,
}: CommentEngagementBarProps) => {
  const { data, isLoading } = useCurrentUser();

  if (!data) {
    return null;
  }

  const isCurrentUserComment = data.id === comment.userId;

  const { createdDisplayString, createdDayDateTime } = getCreatedDisplayString(
    comment.createdAt
  );

  const handleReaction = (reaction: string) => {
    console.log("here");
  };

  if (isLoading) {
    return (
      <div className="my-2 px-2 py-1 w-36 rounded-xl flex items-center gap-x-3 bg-[#c9ccd1]/30"></div>
    );
  }

  return (
    <div className="px-2 py-1 rounded-xl flex items-center gap-x-3">
      <Hint label={createdDayDateTime}>
        <p className="text-xs font-semibold text-muted-foreground hover:underline cursor-pointer">
          {createdDisplayString}
        </p>
      </Hint>

      <ReactionPickerTooltip handleReaction={handleReaction}>
        <p className="text-xs font-semibold text-muted-foreground hover:underline cursor-pointer">
          Like
        </p>
      </ReactionPickerTooltip>

      <Hint label="Reply">
        <p
          onClick={() => setIsReply(true)}
          className="text-xs font-semibold text-muted-foreground hover:underline cursor-pointer"
        >
          Reply
        </p>
      </Hint>

      {isCurrentUserComment && (
        <Hint label="Edit Comment">
          <p
            onClick={() => {
              setIsEditComment(true);
              if (setIsLastChildEditingFromParent && isLastChild) {
                setIsLastChildEditingFromParent(true);
              }
            }}
            className="text-xs font-semibold text-muted-foreground hover:underline cursor-pointer"
          >
            Edit
          </p>
        </Hint>
      )}
    </div>
  );
};
