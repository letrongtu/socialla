import { cn } from "@/lib/utils";
import { createElement, useEffect, useState } from "react";
import { CommentType } from "../types";
import { ReactionType } from "@/utils/types";
import { reactionsWithEmojiAndIcon } from "@/utils/reaction-data/reaction-data";

import { UseCreateCommentReaction } from "@/features/comment-reactions/api/create-comment-reaction";
import { UseDeleteCommentReaction } from "@/features/comment-reactions/api/delete-comment-reaction";
import { UseUpdateCommentReaction } from "@/features/comment-reactions/api/update-comment-reaction";

import { ReactionPickerTooltip } from "@/components/reaction-details-modal/reaction-picker-tooltip";

interface CommentReactionButtonProps {
  commentReactions: ReactionType[];
  comment: CommentType;
  currentUserId: string;
}

export const CommentReactionButton = ({
  commentReactions,
  comment,
  currentUserId,
}: CommentReactionButtonProps) => {
  const { mutate: createCommentReactionMutate } = UseCreateCommentReaction();
  const { mutate: deleteCommentReactionMutate } = UseDeleteCommentReaction();
  const { mutate: updateCommentReactionMutate } = UseUpdateCommentReaction();

  const [currentReaction, setCurrentReaction] = useState<string | null>(null);

  const userReaction =
    commentReactions.find((reaction) =>
      reaction.users.some((user) => user.id === currentUserId)
    )?.reaction || null;

  useEffect(() => {
    setCurrentReaction(userReaction);
  }, [userReaction]);

  const currentReactionObject =
    reactionsWithEmojiAndIcon.find(
      (reactionObject) => reactionObject.reaction === currentReaction
    ) || reactionsWithEmojiAndIcon[0];

  const handleReaction = (reaction: string) => {
    if (!currentReaction) {
      setCurrentReaction(reaction);
      handleCreatePostReaction(reaction);
      return;
    }

    if (currentReaction === reaction) {
      setCurrentReaction(null);
      handleDeletePostReaction();
      return;
    }

    handleUpdatePostReaction(reaction);
    setCurrentReaction(reaction);
  };

  const handleCreatePostReaction = (reaction: string) => {
    createCommentReactionMutate(
      {
        reaction,
        userId: currentUserId,
        postId: comment.postId,
        commentId: comment.id,
      },
      {
        onSuccess: (data) => {
          //   console.log(data);
          //TODO: Could do something here
        },
        onError: (error) => {
          //   console.log(error);
          //TODO: Could do something here
        },
      }
    );
  };

  const handleDeletePostReaction = () => {
    deleteCommentReactionMutate(
      { userId: currentUserId, postId: comment.postId, commentId: comment.id },
      {
        onSuccess: (data) => {
          //   console.log(data);
          //TODO: Could do something here
        },
        onError: (error) => {
          //   console.log(error);
          //TODO: Could do something here
        },
      }
    );
  };

  const handleUpdatePostReaction = (reaction: string) => {
    updateCommentReactionMutate(
      {
        reaction,
        userId: currentUserId,
        postId: comment.postId,
        commentId: comment.id,
      },
      {
        onSuccess: (data) => {
          // console.log(data);
        },
        onError: (error) => {
          // console.log(error);
        },
      }
    );
  };

  return (
    <ReactionPickerTooltip handleReaction={handleReaction} side="top">
      <div
        onClick={() => {
          handleReaction(currentReactionObject.reaction);
        }}
        className={cn(
          "w-5 flex justify-center items-center hover:underline cursor-pointer",
          currentReaction && "decoration-[#f78c6a]",
          currentReaction === "Like" && "decoration-[#1823ab]",
          currentReaction === "Love" && "decoration-red-500"
        )}
      >
        <p
          className={cn(
            "text-xs font-semibold text-muted-foreground",
            currentReaction && "text-[#f78c6a]",
            currentReaction === "Like" && "text-[#1823ab]",
            (currentReaction === "Love" || currentReaction === "Angry") &&
              "text-red-500"
          )}
        >
          {currentReactionObject.reaction}
        </p>
      </div>
    </ReactionPickerTooltip>
  );
};
