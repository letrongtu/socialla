import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useGetPostReactions } from "@/features/post-reactions/api/use-get-post-reactions";

import { PostEngagementButtons } from "./post-engagement-buttons";
import { PostEngagementDetails } from "./post-engagement-details";

import { Separator } from "@/components/ui/separator";

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

  if (!currentUserData) {
    return null; //TODO: Loader maybe
  }

  const { id: userId } = currentUserData;

  if (!userId) {
    return null; //TODO: Loader maybe
  }

  const userReaction =
    postReactionData.find((reaction) => reaction.userIds.includes(userId))
      ?.reaction || null;

  return (
    <div className="flex flex-col justify-center gap-y-2">
      <PostEngagementDetails postReactionData={postReactionData} />

      <Separator />

      <PostEngagementButtons
        postId={postId}
        userId={userId}
        userReaction={userReaction}
      />
    </div>
  );
};
