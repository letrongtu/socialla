import { cn } from "@/lib/utils";
import { createElement, useState } from "react";

import { Hint } from "@/components/ui/hint";
import { Separator } from "@/components/ui/separator";
import { ReactionPickerTooltip } from "./reaction-picker-tooltip";

import { PiShareFat } from "react-icons/pi";
import { MessageCircle } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { reactionsWithEmojiAndIcon } from "./reaction-data/reaction-data";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { UseCreatePostReaction } from "@/features/post-reactions/api/create-post-reaction";
import { UseDeletePostReaction } from "@/features/post-reactions/api/delete-post-reaction";
import { toast } from "sonner";
import { UseUpdatePostReaction } from "@/features/post-reactions/api/update-post-reaction";
import { useGetPostReactions } from "@/features/post-reactions/api/use-get-post-reactions";

interface EngagementBarProps {
  postId: string;
  enableReaction?: boolean;
  enableComment?: boolean;
  enableShare?: boolean;
}

export const EngagementBar = ({
  postId,
  enableReaction = true,
  enableComment = true,
  enableShare = true,
}: EngagementBarProps) => {
  const { data: currentUserData, isLoading: isLoadingCurrentUserData } =
    useCurrentUser();
  const { data: postReactionData, isLoading: isLoadingPostReactionData } =
    useGetPostReactions(postId);

  const { mutate: createPostReactionMutate, isPending } =
    UseCreatePostReaction();
  const { mutate: deletePostReactionMutate } = UseDeletePostReaction();
  const { mutate: updatePostReactionMutate } = UseUpdatePostReaction();

  const [currentReaction, setCurrentReaction] = useState<string | null>(null);

  if (!currentUserData) {
    return null;
  }

  const { id: userId } = currentUserData;

  if (!userId) {
    return null;
  }

  const totalReaction = postReactionData.reduce(
    (total, reaction) => (total += reaction.count),
    0
  );
  console.log(totalReaction);

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
    <div className="flex flex-col justify-center gap-y-2">
      <div
        className={cn(
          "flex justify-end px-4",
          enableReaction && "justify-between"
        )}
      >
        {enableReaction && (
          <div className="flex items-center gap-x-1">
            <div className="flex items-center">
              <Hint label="Love">
                <div className="p-1 rounded-full bg-red-500 cursor-pointer">
                  <FaHeart className="text-white size-3" />
                </div>
              </Hint>

              <Hint label="Like">
                <div className="p-1 rounded-full bg-[#1823ab] cursor-pointer">
                  <AiFillLike className="text-white size-3" />
                </div>
              </Hint>
            </div>
            <Hint label="13k people reacted">
              <p className="text-base text-muted-foreground hover:underline cursor-pointer">
                {}
              </p>
            </Hint>
          </div>
        )}

        <div className="flex items-center gap-x-3">
          {enableComment && (
            <Hint label="8 comments">
              <p className="text-base text-muted-foreground hover:underline cursor-pointer">
                8 comments
              </p>
            </Hint>
          )}

          {enableShare && (
            <Hint label="10 shares">
              <p className="text-base text-muted-foreground hover:underline cursor-pointer">
                10 shares
              </p>
            </Hint>
          )}
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-evenly px-2">
        {enableReaction && (
          <ReactionPickerTooltip handleReaction={handleReaction}>
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
          <div className="w-full flex justify-center items-center space-x-2 hover:bg-[#c9ccd1]/30 rounded-md cursor-pointer">
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

            <p className="text-base font-semibold text-muted-foreground">
              Share
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
