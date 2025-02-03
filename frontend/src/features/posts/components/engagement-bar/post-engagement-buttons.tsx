import { cn } from "@/lib/utils";
import { createElement, useEffect, useState } from "react";

import { usePostCommentModal } from "@/features/post-comments/store/use-post-comment-modal";
import { PostType } from "../../types";

import { UseCreatePostReaction } from "@/features/post-reactions/api/create-post-reaction";
import { UseDeletePostReaction } from "@/features/post-reactions/api/delete-post-reaction";
import { UseUpdatePostReaction } from "@/features/post-reactions/api/update-post-reaction";
import { reactionsWithEmojiAndIcon } from "../../../post-reactions/components/reaction-data/reaction-data";
import { ReactionPickerTooltip } from "@/features/post-reactions/components/reaction-picker-tooltip";

import { PiShareFat } from "react-icons/pi";
import { MessageCircle } from "lucide-react";

interface PostEngagementButtonsProps {
  postData: PostType;
  userId: string;
  userReaction?: string | null;
  enableReaction?: boolean;
  enableComment?: boolean;
  enableShare?: boolean;
}

export const PostEngagementButtons = ({
  postData,
  userId,
  userReaction = null,
  enableReaction = true,
  enableComment = true,
  enableShare = true,
}: PostEngagementButtonsProps) => {
  const [, setOpenPostCommentModal] = usePostCommentModal();

  const { mutate: createPostReactionMutate, isPending } =
    UseCreatePostReaction();
  const { mutate: deletePostReactionMutate } = UseDeletePostReaction();
  const { mutate: updatePostReactionMutate } = UseUpdatePostReaction();

  const [currentReaction, setCurrentReaction] = useState<string | null>(null);

  const postId = postData.id;

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
    createPostReactionMutate(
      { reaction, userId, postId },
      {
        onSuccess: (data) => {
          //TODO: Could do something here
        },
        onError: (error) => {
          //TODO: Could do something here
        },
      }
    );
  };

  const handleDeletePostReaction = () => {
    deletePostReactionMutate(
      { userId, postId },
      {
        onSuccess: (data) => {
          //TODO: Could do something here
        },
        onError: (error) => {
          //TODO: Could do something here
        },
      }
    );
  };

  const handleUpdatePostReaction = (reaction: string) => {
    updatePostReactionMutate(
      { reaction, userId, postId },
      {
        onSuccess: (data) => {
          console.log(data);
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-evenly px-2">
      {enableReaction && (
        <ReactionPickerTooltip
          handleReaction={handleReaction}
          side="top"
          align="start"
        >
          <div
            onClick={() => {
              handleReaction(currentReactionObject.reaction);
            }}
            className={cn(
              "w-full flex justify-center items-center space-x-2 py-1 hover:bg-[#c9ccd1]/30 rounded-md cursor-pointer"
            )}
          >
            <div className="flex items-center justify-center rounded-full">
              {currentReaction === currentReactionObject.reaction &&
                currentReactionObject.emoji && (
                  <div className="w-6 h-6 flex items-center justify-center rounded-full">
                    <p className="-mt-1 text-[1.4rem]">
                      {currentReactionObject.emoji}
                    </p>
                  </div>
                )}

              {currentReaction === currentReactionObject.reaction &&
                currentReactionObject.fillIcon &&
                createElement(currentReactionObject.fillIcon, {
                  className: cn(
                    "text-muted-foreground size-6 text-[#1823ab]",
                    currentReaction === "Love" &&
                      "text-white p-[0.28rem] bg-red-500 rounded-full"
                  ),
                })}

              {currentReaction !== currentReactionObject.reaction &&
                currentReactionObject.defaultIcon &&
                createElement(currentReactionObject.defaultIcon, {
                  className: "text-muted-foreground size-6",
                })}
            </div>

            <p
              className={cn(
                "text-base font-semibold text-muted-foreground",
                currentReaction && "text-[#f78c6a]",
                currentReaction === "Like" && "text-[#1823ab]",
                currentReaction === "Love" && "text-red-500"
              )}
            >
              {currentReactionObject.reaction}
            </p>
          </div>
        </ReactionPickerTooltip>
      )}

      {enableComment && (
        <div
          onClick={() => {
            setOpenPostCommentModal({ open: true, postData: postData });
            console.log();
          }}
          className="w-full flex justify-center items-center space-x-2 hover:bg-[#c9ccd1]/30 rounded-md cursor-pointer"
        >
          <div className="py-1 rounded-full cursor-pointer">
            <MessageCircle className="text-muted-foreground size-6" />
          </div>

          <p className="text-base font-semibold text-muted-foreground">
            Comment
          </p>
        </div>
      )}

      {enableShare && (
        <div className="w-full flex justify-center items-center space-x-2 hover:bg-[#c9ccd1]/30 rounded-md cursor-pointer">
          <div className="py-1 rounded-full cursor-pointer">
            <PiShareFat className="text-muted-foreground size-6" />
          </div>

          <p className="text-base font-semibold text-muted-foreground">Share</p>
        </div>
      )}
    </div>
  );
};
