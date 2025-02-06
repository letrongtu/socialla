import { cn } from "@/lib/utils";

import { PostReactionType } from "@/features/post-reactions/types";

import { PostReactionDetails } from "@/features/post-reactions/components/post-reaction-details";
import { EngagementHint } from "@/features/posts/components/engagement-bar/engagement-hint";
import { UseGetParentCommentsByPostId } from "@/features/post-comments/api/use-get-parent-comments-by-post-id";

interface PostEngagementDetailsProps {
  postReactions: PostReactionType[];
  postId: string;
  enableReaction?: boolean;
  enableComment?: boolean;
  enableShare?: boolean;
}

export const PostEngagementDetails = ({
  postReactions,
  postId,
  enableReaction = true,
  enableComment = true,
  enableShare = true,
}: PostEngagementDetailsProps) => {
  const { totalPostComments: totalPostComments } =
    UseGetParentCommentsByPostId(postId);

  return (
    <div
      className={cn(
        "flex justify-end px-4",
        enableReaction && "justify-between"
      )}
    >
      {enableReaction && <PostReactionDetails postReactions={postReactions} />}

      <div className="flex items-center gap-x-3">
        {enableComment && totalPostComments > 0 && (
          <EngagementHint label="8 comments">
            <p className="text-base text-muted-foreground hover:underline cursor-pointer">
              {totalPostComments}{" "}
              {totalPostComments > 1 ? "comments" : "comment"}
            </p>
          </EngagementHint>
        )}

        {enableShare && (
          <EngagementHint label="10 shares">
            <p className="text-base text-muted-foreground hover:underline cursor-pointer">
              10 shares
            </p>
          </EngagementHint>
        )}
      </div>
    </div>
  );
};
