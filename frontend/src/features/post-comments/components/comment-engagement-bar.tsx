import { getCreatedDisplayString } from "@/features/posts/helper/helper";
import { CommentType } from "../types";

import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { UseDeleteComment } from "../api/use-delete-comment";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Hint } from "@/components/ui/hint";
import { ReactionPickerTooltip } from "@/features/post-reactions/components/reaction-picker-tooltip";

import { BiSolidCommentEdit } from "react-icons/bi";
import { Separator } from "@/components/ui/separator";
import { Pen, Trash } from "lucide-react";

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

  const { mutate: deleteComment, isPending: isDeletePending } =
    UseDeleteComment();

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

  const handleDeleteComment = () => {
    deleteComment(
      { id: comment.id },
      {
        onSuccess(data) {
          // console.log(data);
        },
        onError: (error) => {
          // console.log(error);
        },
      }
    );
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
        <TooltipProvider>
          <Tooltip delayDuration={50}>
            <TooltipTrigger>
              <div className="flex items-end justify-end mt-[0.2rem] -ml-1 p-1 rounded-full hover:bg-[#c9ccd1]/30 cursor-pointer group">
                <BiSolidCommentEdit className="size-[0.7rem] group-hover:text-[#1823ab] text-muted-foreground flex items-end" />
              </div>
            </TooltipTrigger>

            <TooltipContent
              side="bottom"
              className="p-1 w-full flex flex-col items-center justify-center min-w-48"
            >
              <div
                onClick={() => {
                  setIsEditComment(true);
                  if (setIsLastChildEditingFromParent && isLastChild) {
                    setIsLastChildEditingFromParent(true);
                  }
                }}
                className="w-full h-10 flex items-center gap-x-2 px-2 hover:bg-[#1823ab]/10 cursor-pointer group/edit"
              >
                <Pen className="size-3.5 group-hover/edit:text-[#1823ab]" />
                <p className="text-sm font-semibold group-hover/edit:text-[#1823ab]">
                  Edit comment
                </p>
              </div>

              <Separator />

              <div
                onClick={handleDeleteComment}
                className="w-full h-10 flex items-center gap-x-2 px-2 hover:bg-red-500/10 cursor-pointer group/delete"
              >
                <Trash className="size-3.5 group-hover/delete:text-red-500" />
                <p className="text-sm font-semibold group-hover/delete:text-red-500">
                  Delete comment
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
