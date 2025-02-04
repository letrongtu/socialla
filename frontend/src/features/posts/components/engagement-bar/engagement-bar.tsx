import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useGetPostReactions } from "@/features/post-reactions/api/use-get-post-reactions";
import { PostType } from "../../types";

import { PostEngagementButtons } from "./post-engagement-buttons";
import { PostEngagementDetails } from "./post-engagement-details";

import { Separator } from "@/components/ui/separator";

interface EngagementBarProps {
  postData: PostType;
  enableReaction?: boolean;
  enableComment?: boolean;
  enableShare?: boolean;
}

export const EngagementBar = ({
  postData,
  enableReaction = true,
  enableComment = true,
  enableShare = true,
}: EngagementBarProps) => {
  const { data: currentUserData, isLoading: isLoadingCurrentUserData } =
    useCurrentUser();

  const { data: postReactions, isLoading: isLoadingPostReactionData } =
    useGetPostReactions(postData.id);

  if (!currentUserData) {
    return null; //TODO: Loader maybe
  }

  const { id: userId } = currentUserData;

  if (!userId) {
    return null; //TODO: Loader maybe
  }

  const userReaction =
    postReactions.find((reaction) =>
      reaction.users.some((user) => user.id === userId)
    )?.reaction || null;

  return (
    <div className="flex flex-col justify-center gap-y-2">
      <PostEngagementDetails
        postReactions={postReactions}
        postId={postData.id}
        enableReaction={enableReaction}
        enableComment={enableComment}
        enableShare={enableShare}
      />

      <Separator />

      <PostEngagementButtons
        postData={postData}
        userId={userId}
        userReaction={userReaction}
        enableReaction={enableReaction}
        enableComment={enableComment}
        enableShare={enableShare}
      />
    </div>
  );
};
